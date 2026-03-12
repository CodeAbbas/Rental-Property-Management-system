from flask import Blueprint, request, make_response, jsonify
from decorators import jwt_required
import bcrypt
import jwt
import datetime
import globals

auth_bp = Blueprint("auth_bp", __name__)

users = globals.db.users
blacklist = globals.db.blacklist

@auth_bp.route('/api/v1/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get("username") or not data.get("password"):
        return make_response(jsonify({"error": "Username and password are required"}), 400)
        
    if users.find_one({"username": data["username"]}):
        return make_response(jsonify({"error": "Username already exists"}), 409)
        
    # Roles can be 'admin', 'landlord', or 'renter'. Defaulting to 'renter' if not provided.
    role = data.get("role", "renter").lower()
    if role not in ["admin", "landlord", "renter"]:
        return make_response(jsonify({"error": "Invalid role specified"}), 400)
        
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())
    
    new_user = {
        "username": data["username"],
        "password": hashed_password, # Stored as bytes, will be checked properly
        "email": data.get("email", ""),
        "role": role
    }
    
    users.insert_one(new_user)
    return make_response(jsonify({"message": f"User {data['username']} registered successfully"}), 201)

@auth_bp.route('/api/v1/login', methods=['POST'])
def login():
    # Allow both basic auth headers or JSON body for flexibility
    auth = request.authorization
    data = request.get_json() if request.is_json else None
    
    username = auth.username if auth else (data.get("username") if data else None)
    password = auth.password if auth else (data.get("password") if data else None)
    
    if not username or not password:
        return make_response(jsonify({'error': 'Authentication credentials required'}), 401)
        
    user = users.find_one({'username': username})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        # Generate JWT Token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'username': user['username'],
            'role': user.get('role', 'renter'),
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
        }, globals.SECRET_KEY, algorithm='HS256')
        
        return make_response(jsonify({'token': token, 'role': user.get('role', 'renter')}), 200)
        
    return make_response(jsonify({'error': 'Invalid username or password'}), 401)

@auth_bp.route('/api/v1/logout', methods=['GET'])
@jwt_required
def logout():
    token = request.headers.get('x-access-token')
    # Add token to blacklist to prevent reuse
    blacklist.insert_one({'token': token})
    return make_response(jsonify({'message': 'Logged out successfully'}), 200)