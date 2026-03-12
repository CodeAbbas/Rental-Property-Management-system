from flask import Blueprint, request, make_response, jsonify
from decorators import jwt_required
import globals

analytics_bp = Blueprint("analytics_bp", __name__)
listings = globals.db.listings

@analytics_bp.route('/api/v1/analytics/average-rent', methods=['GET'])
@jwt_required
def average_rent():
    # Application Domain: Affordability indicators [cite: 88]
    area = request.args.get('area')
    
    pipeline = []
    
    # If a specific area is provided, filter first
    if area:
        pipeline.append({"$match": {"location": {"$regex": area, "$options": "i"}}})
        
    # Aggregation: Group by location and calculate the average price
    pipeline.append({
        "$group": {
            "_id": "$location",
            "average_price_pcm": {"$avg": "$price_pcm"},
            "total_listings_in_area": {"$sum": 1}
        }
    })
    
    try:
        results = list(listings.aggregate(pipeline))
        # Format the float for cleaner JSON output
        for res in results:
            res["average_price_pcm"] = round(res["average_price_pcm"], 2)
            
        return make_response(jsonify(results), 200)
    except Exception as e:
        return make_response(jsonify({"error": "Aggregation failed", "details": str(e)}), 500)

@analytics_bp.route('/api/v1/analytics/popular-types', methods=['GET'])
@jwt_required
def popular_types():
    # Application Domain: Most sought-after property types [cite: 88]
    pipeline = [
        {
            "$group": {
                "_id": "$property_type",
                "total_count": {"$sum": 1}
            }
        },
        {
            # Sort in descending order to show the most popular first
            "$sort": {"total_count": -1}
        }
    ]
    
    try:
        results = list(listings.aggregate(pipeline))
        return make_response(jsonify(results), 200)
    except Exception as e:
        return make_response(jsonify({"error": "Aggregation failed", "details": str(e)}), 500)