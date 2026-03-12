from pymongo import MongoClient
import bcrypt
import json

# Connect to DB
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.rentalDB

def reset_database():
    print("Dropping existing collections...")
    db.users.drop()
    db.listings.drop()
    db.blacklist.drop()

    print("Creating default users with bcrypt hashed passwords...")
    admin_pw = bcrypt.hashpw(b"admin123", bcrypt.gensalt())
    landlord_pw = bcrypt.hashpw(b"landlord123", bcrypt.gensalt())
    renter_pw = bcrypt.hashpw(b"renter123", bcrypt.gensalt())

    users = [
        {"username": "admin", "password": admin_pw, "email": "admin@rental.com", "role": "admin"},
        {"username": "landlord", "password": landlord_pw, "email": "landlord@rental.com", "role": "landlord"},
        # Renters get embedded arrays for sub-document operations
        {"username": "renter", "password": renter_pw, "email": "renter@rental.com", "role": "renter", "favorites": [], "saved_searches": []}
    ]
    
    result = db.users.insert_many(users)
    
    # Extract the ID of the Landlord we just created (index 1 in the array)
    landlord_id = str(result.inserted_ids[1]) 

    print("Loading dummy data...")
    try:
        with open('rental_data.json', 'r') as f:
            listings_data = json.load(f)
    except FileNotFoundError:
        print("Error: rental_data.json not found. Please run dummydata.py first.")
        return

    # Assign the landlord ID to all dummy listings to simulate a populated system
    for listing in listings_data:
        listing["posted_by"] = landlord_id

    print("Seeding database with 100 listings...")
    db.listings.insert_many(listings_data)
    
    print("\nDatabase reset and seeded successfully!")
    print("---------------------------------------")
    print("Use these Test Accounts in Postman:")
    print("  Admin:    admin / admin123")
    print("  Landlord: landlord / landlord123")
    print("  Renter:   renter / renter123")

if __name__ == "__main__":
    reset_database()