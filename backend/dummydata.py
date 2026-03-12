import json
import random
import urllib.parse
from datetime import datetime, timedelta

def generate_dummy_data():
    property_types = ['flat', 'house', 'studio', 'maisonette']
    locations = ['Camden', 'Islington', 'Hackney', 'Greenwich', 'Westminster', 'Southwark', 'Richmond', 'Wandsworth', 'Lambeth', 'Kensington']
    statuses = ['active', 'rented', 'withdrawn']
    
    listings = []
    
    for i in range(1, 101):
        prop_type = random.choice(property_types)
        # Studios strictly have 1 bedroom
        bedrooms = random.randint(1, 5) if prop_type != 'studio' else 1
        bathrooms = random.randint(1, 3)
        location = random.choice(locations)
        
        # Dynamic Image URL ensuring caching doesn't show the same image for all 100 items
        # Using URL encoding for the text string to prevent broken links
        raw_text = f"Property {i}: {location}"
        encoded_text = urllib.parse.quote(raw_text)
        image_url = f"https://fakeimg.pl/600x400/?text={encoded_text}&font=lobster"
        
        listing = {
            "title": f"Beautiful {bedrooms} Bed {prop_type.capitalize()} in {location}",
            "description": f"A stunning {prop_type} offering spacious living and modern amenities. Perfect for professionals or families.",
            "price_pcm": random.randint(800, 4500),
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "property_type": prop_type,
            "furnished": random.choice([True, False]),
            "location": location,
            "available_from": (datetime.now() + timedelta(days=random.randint(5, 60))).strftime("%Y-%m-%d"),
            "posted_date": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
            "status": random.choices(statuses, weights=[70, 20, 10], k=1)[0],
            "image_url": image_url,
            "posted_by": "" # This will be injected dynamically by push_data.py
        }
        listings.append(listing)
        
    with open('rental_data.json', 'w') as f:
        json.dump(listings, f, indent=4)
        
if __name__ == "__main__":
    generate_dummy_data()
    print("Successfully generated 100 rental listings in rental_data.json")