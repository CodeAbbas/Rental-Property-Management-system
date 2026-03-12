from flask import Blueprint, request, make_response, jsonify
from decorators import jwt_required
from bson import ObjectId
import globals

users_bp = Blueprint("users_bp", __name__)
users = globals.db.users
listings = globals.db.listings

@users_bp.route('/api/v1/user/favorites', methods=['GET'])
@jwt_required
def get_favorites():
    user_id = request.user_data.get('user_id')
    user = users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)
        
    # Return the array of favorited listing IDs
    favorites = user.get("favorites", [])
    return make_response(jsonify({"favorites": favorites}), 200)

@users_bp.route('/api/v1/user/favorites/<string:listing_id>', methods=['POST'])
@jwt_required
def add_favorite(listing_id):
    user_id = request.user_data.get('user_id')
    
    if not ObjectId.is_valid(listing_id):
        return make_response(jsonify({"error": "Invalid listing ID"}), 400)
        
    # Verify the listing actually exists before favoriting
    if not listings.find_one({"_id": ObjectId(listing_id)}):
        return make_response(jsonify({"error": "Listing not found"}), 404)
        
    # Sub-document Array Mutation: $push
    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"favorites": listing_id}} 
    )
    
    return make_response(jsonify({"message": "Listing added to favorites successfully"}), 200)

@users_bp.route('/api/v1/user/favorites/<string:listing_id>', methods=['DELETE'])
@jwt_required
def remove_favorite(listing_id):
    user_id = request.user_data.get('user_id')
    
    # Sub-document Array Mutation: $pull
    result = users.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"favorites": listing_id}}
    )
    
    if result.modified_count == 0:
        return make_response(jsonify({"message": "Listing was not in favorites"}), 200)
        
    return make_response(jsonify({"message": "Listing removed from favorites"}), 200)

@users_bp.route('/api/v1/user/saved-searches', methods=['POST'])
@jwt_required
def save_search():
    user_id = request.user_data.get('user_id')
    data = request.get_json()
    
    if not data or not data.get("query_name"):
        return make_response(jsonify({"error": "query_name is required"}), 400)
        
    # Create a sub-document with its own identifier
    new_search = {
        "search_id": str(ObjectId()),
        "query_name": data.get("query_name"),
        "filters": data.get("filters", {})
    }
    
    # Sub-document Array Mutation: $push
    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"saved_searches": new_search}}
    )
    
    return make_response(jsonify(new_search), 201)