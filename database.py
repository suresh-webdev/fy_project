from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

# MongoDB Atlas connection string
client = MongoClient("mongodb+srv://new:new@client.d8j8m.mongodb.net/?retryWrites=true&w=majority&appName=Client")

# Specify the database and collection
db = client["oee_db"]
collection = db["oee_data"] 

# GET endpoint to fetch user data based on user ID
@app.route('/api/user/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        # Query the collection to find a document where the 'user_id' field matches the user_id
        user_data = collection.find_one({"user_id": user_id})

        if user_data:
            # Convert the _id field to a string
            user_data["_id"] = str(user_data["_id"])

            # Return the user data as JSON
            return jsonify(user_data), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        # Return an error if something goes wrong
        return jsonify({"error": str(e)}), 500

# GET endpoint to fetch all data
@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        # Fetch all documents from the collection
        users_data = list(collection.find({}))  # Find all documents in the collection
        
        # Convert '_id' to string as it is an ObjectId and not JSON serializable by default
        for user in users_data:
            user["_id"] = str(user["_id"])

        if users_data:
            # Return all user data as JSON
            return jsonify(users_data), 200
        else:
            return jsonify({"error": "No users found"}), 404

    except Exception as e:
        # Return an error if something goes wrong
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5500,debug=True)
