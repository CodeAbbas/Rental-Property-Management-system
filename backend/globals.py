from pymongo import MongoClient

# Global Configuration
SECRET_KEY = 'super_secret_rental_key_661'

# MongoDB Connection
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.rentalDB
