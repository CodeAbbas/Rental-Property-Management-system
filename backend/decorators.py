from flask import jsonify, request, make_response
import jwt
from functools import wraps
import globals

blacklist = globals.db.blacklist

def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            
        if not token:
            return make_response(jsonify({'error': 'Authentication token is missing'}), 401)
            
        try:
            # Decode token and attach payload to request for downstream role/ID checking
            data = jwt.decode(token, globals.SECRET_KEY, algorithms=['HS256'])
            request.user_data = data 
        except jwt.ExpiredSignatureError:
            return make_response(jsonify({'error': 'Token has expired'}), 401)
        except jwt.InvalidTokenError:
            return make_response(jsonify({'error': 'Token is invalid'}), 401)
        
        # Stateless logout check
        bl_token = blacklist.find_one({'token': token})
        if bl_token is not None:
            return make_response(jsonify({'error': 'Token has been revoked. Please log in again.'}), 401)
        
        return func(*args, **kwargs)
    return jwt_required_wrapper

def admin_required(func):
    @wraps(func)
    def admin_required_wrapper(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return make_response(jsonify({'error': 'Token is missing'}), 401)
            
        try:
            data = jwt.decode(token, globals.SECRET_KEY, algorithms=['HS256'])
            # Enforce Admin Role strictly
            if data.get('role') == 'admin':
                return func(*args, **kwargs)
            else:
                return make_response(jsonify({'error': 'Admin privileges required'}), 403)
        except Exception:
            return make_response(jsonify({'error': 'Token is invalid or missing'}), 401)
            
    return admin_required_wrapper
