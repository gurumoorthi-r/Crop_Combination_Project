from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from train import SubCropRecommender
import mysql.connector
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
CORS(app, supports_credentials=True)




# Load the trained model
with open("subcrop_recommender.pkl", "rb") as model_file:
    model = pickle.load(model_file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        required_fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        try:
            values = [float(data[field]) for field in required_fields]
        except ValueError:
            return jsonify({"error": "Invalid input: All parameters must be numeric"}), 400

        result = model.recommend_sub_crops(*values)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Database connection
try:
    db = mysql.connector.connect(
        host='localhost',
        user='root',
        password='1234',
        database='world'
    )
    cursor = db.cursor()
except mysql.connector.Error as err:
    print(f"Database Connection Error: {err}")
    db = None

@app.route('/signup', methods=['POST'])
def signup():
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    data = request.json
    
    sql = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
    
    try:
        cursor.execute(sql, (data['username'], data['email'], data['password']))
        db.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

@app.route('/login', methods=['POST'])
def login():
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    data = request.json
    sql = "SELECT username, password FROM users WHERE email = %s"

    cursor.execute(sql, (data['email'],))
    user = cursor.fetchone()
    
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401
    
    
    return jsonify({"message": "Login successful", "username": user[1]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
