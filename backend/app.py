from flask import Flask, jsonify, make_response
from flask_cors import CORS

# Import blueprints
from blueprints.auth.auth import auth_bp
from blueprints.listings.listings import listings_bp
from blueprints.users.users import users_bp
from blueprints.analytics.analytics import analytics_bp

app = Flask(__name__)
CORS(app) # Enable CORS for frontend integration

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(listings_bp)
app.register_blueprint(users_bp)
app.register_blueprint(analytics_bp)

# Global Error Handler for 404
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Endpoint not found'}), 404)

# Global Error Handler for 500
@app.errorhandler(500)
def internal_error(error):
    return make_response(jsonify({'error': 'Internal server error'}), 500)

if __name__ == "__main__":
    app.run(debug=True, port=5000)