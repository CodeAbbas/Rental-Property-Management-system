from flask import Blueprint, request, make_response, jsonify
from decorators import jwt_required
from bson import ObjectId
import datetime
import globals

listings_bp = Blueprint("listings_bp", __name__)
listings = globals.db.listings

@listings_bp.route('/api/v1/listings', methods=['GET'])
def get_all_listings():
    data_to_return = []
    
    # Pagination 
    page_num = request.args.get('pn', default=1, type=int)
    page_size = request.args.get('ps', default=10, type=int)
    page_start = (page_num - 1) * page_size
    
    try:
        # Build query for filtering (e.g., ?status=active)
        query = {}
        if request.args.get('status'):
            query['status'] = request.args.get('status')
            
        cursor = listings.find(query).skip(page_start).limit(page_size)
        
        # Data Serialization: Flattening ObjectIds [cite: 66]
        for listing in cursor:
            listing['_id'] = str(listing['_id'])
            data_to_return.append(listing)
            
        return make_response(jsonify(data_to_return), 200)
    except Exception as e:
        return make_response(jsonify({"error": "Internal Server Error", "details": str(e)}), 500)

@listings_bp.route('/api/v1/listings/search', methods=['GET'])
def search_listings():
    # Advanced MongoDB Operation: Regex Searching 
    keyword = request.args.get('q', '')
    if not keyword:
        return make_response(jsonify({"error": "Search query parameter 'q' is required"}), 400)
        
    search_query = {
        "$or": [
            {"title": {"$regex": keyword, "$options": "i"}},
            {"description": {"$regex": keyword, "$options": "i"}},
            {"location": {"$regex": keyword, "$options": "i"}}
        ]
    }
    
    try:
        cursor = listings.find(search_query).limit(50)
        results = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            results.append(doc)
        return make_response(jsonify(results), 200)
    except Exception as e:
        return make_response(jsonify({"error": "Search failed", "details": str(e)}), 500)

@listings_bp.route('/api/v1/listings/<string:l_id>', methods=['GET'])
def get_one_listing(l_id):
    if not ObjectId.is_valid(l_id):
        return make_response(jsonify({"error": "Invalid ID format"}), 400)
        
    listing = listings.find_one({"_id": ObjectId(l_id)})
    if listing:
        listing["_id"] = str(listing["_id"])
        return make_response(jsonify(listing), 200)
    return make_response(jsonify({"error": "Listing not found"}), 404)

@listings_bp.route('/api/v1/listings', methods=['POST'])
@jwt_required
def add_listing():
    user = request.user_data
    # RBAC: Only Admins and Landlords can create listings [cite: 95, 112, 115]
    if user.get('role') not in ['admin', 'landlord']:
        return make_response(jsonify({"error": "Permission denied. Only landlords or admins can post listings."}), 403)
        
    data = request.get_json()
    if not data or not data.get("title") or not data.get("price_pcm"):
        return make_response(jsonify({"error": "Missing required fields (title, price_pcm)"}), 400)
        
    new_listing = {
        "title": data.get("title"),
        "description": data.get("description", ""),
        "price_pcm": float(data.get("price_pcm")),
        "bedrooms": int(data.get("bedrooms", 0)),
        "bathrooms": int(data.get("bathrooms", 0)),
        "property_type": data.get("property_type", "flat"),
        "furnished": data.get("furnished", False),
        "location": data.get("location", ""),
        "available_from": data.get("available_from", ""),
        "posted_date": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "status": "active",
        "posted_by": user.get("user_id") # Track ownership [cite: 77]
    }
    
    result = listings.insert_one(new_listing)
    new_listing["_id"] = str(result.inserted_id)
    return make_response(jsonify(new_listing), 201)

@listings_bp.route('/api/v1/listings/<string:l_id>', methods=['PUT'])
@jwt_required
def update_listing(l_id):
    if not ObjectId.is_valid(l_id):
        return make_response(jsonify({"error": "Invalid ID format"}), 400)
        
    user = request.user_data
    listing = listings.find_one({"_id": ObjectId(l_id)})
    
    if not listing:
        return make_response(jsonify({"error": "Listing not found"}), 404)
        
    # RBAC: Only the owner or an admin can edit [cite: 97, 112, 115]
    if user.get('role') != 'admin' and listing.get('posted_by') != user.get('user_id'):
        return make_response(jsonify({"error": "Permission denied. You do not own this listing."}), 403)
        
    data = request.get_json()
    if not data:
        return make_response(jsonify({"error": "No update data provided"}), 400)
        
    # Exclude immutable fields from update
    update_data = {k: v for k, v in data.items() if k not in ['_id', 'posted_by', 'posted_date']}
    
    result = listings.update_one({"_id": ObjectId(l_id)}, {"$set": update_data})
    
    if result.modified_count == 1:
        return make_response(jsonify({"message": "Listing updated successfully"}), 200)
    return make_response(jsonify({"message": "No changes made"}), 200)

@listings_bp.route('/api/v1/listings/<string:l_id>', methods=['DELETE'])
@jwt_required
def delete_listing(l_id):
    if not ObjectId.is_valid(l_id):
        return make_response(jsonify({"error": "Invalid ID format"}), 400)
        
    user = request.user_data
    listing = listings.find_one({"_id": ObjectId(l_id)})
    
    if not listing:
        return make_response(jsonify({"error": "Listing not found"}), 404)
        
    # RBAC: Only the owner or an admin can delete [cite: 98, 112, 115]
    if user.get('role') != 'admin' and listing.get('posted_by') != user.get('user_id'):
        return make_response(jsonify({"error": "Permission denied. You do not own this listing."}), 403)
        
    listings.delete_one({"_id": ObjectId(l_id)})
    return make_response(jsonify({"message": "Listing deleted successfully"}), 200)