from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pickle
import numpy as np
from train import SubCropRecommender  # Import SubCropRecommender class

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
with open("subcrop_recommender.pkl", "rb") as model_file:
    model = pickle.load(model_file)  # Now it correctly loads SubCropRecommender

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        required_fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        try:
            N = float(data["N"])
            P = float(data["P"])
            K = float(data["K"])
            temperature = float(data["temperature"])
            humidity = float(data["humidity"])
            ph = float(data["ph"])
            rainfall = float(data["rainfall"])
        except ValueError:
            return jsonify({"error": "Invalid input: All parameters must be numeric"}), 400

        result = model.recommend_sub_crops(N, P, K, temperature, humidity, ph, rainfall)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
