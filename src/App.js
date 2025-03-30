import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import ResultPage from "./ResultPage"; // Import the result page
import "./App.css"; 

const Home = () => {
  const [nitrogen, setNitrogen] = useState("");
  const [potassium, setPotassium] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [ph, setPh] = useState("");

  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [rainfall, setRainfall] = useState("");

  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [fetchWeather, setFetchWeather] = useState(true);
  const navigate = useNavigate(); // For navigation
  const apiKey = "4fb4ab3828a77ad38f04560066b6bdd3";

  const handlePredict = async () => {
    if (!nitrogen || !phosphorus || !potassium || !ph) {
      setError("Please fill in all soil composition fields (N, P, K, pH).");
      return;
    }
  
    if (!fetchWeather) {
      if (!temp || !humidity || !rainfall) {
<<<<<<< HEAD
        setError("Please enter Temperature, Humidity, and Rainfall manually.");
=======
        setError("Please enter Temperature, Humidity, and Rainfall manually .");
>>>>>>> 4c3e4e4 (second commit)
        return;
      }
    } else {
      if (!weatherData) {
        setError("Weather data not available. Try again.");
        return;
      }
    }
  
    const requestData = {
      N: Number(nitrogen),
      P: Number(phosphorus),
      K: Number(potassium),
      temperature: fetchWeather ? weatherData.main.temp : Number(temp),
      humidity: fetchWeather ? weatherData.main.humidity : Number(humidity),
      ph: Number(ph),
      rainfall: fetchWeather ? (weatherData.rain ? weatherData.rain["1h"] : 0) : Number(rainfall),
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", requestData);
      const prediction = response.data;
      console.log(prediction)
      // Navigate to result page with prediction
      navigate("/result", { state: { prediction } });
  
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get prediction.");
    }
  };
  
  

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Failed to fetch weather data: " + err.message);
    }
  };

  useEffect(() => {
    if (fetchWeather && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError("Failed to get your location: " + error.message);
        }
      );
    }
  }, [fetchWeather]);

  return (
    <div className="app">
      <div className="form-container">
        <h1>Land Details & Weather</h1>

        <div className="form-group">
          <label>Nitrogen (N)</label>
          <input type="number" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} placeholder="Enter Nitrogen level" />
        </div>
        <div className="form-group">
          <label>Potassium (K)</label>
          <input type="number" value={potassium} onChange={(e) => setPotassium(e.target.value)} placeholder="Enter Potassium level" />
        </div>
        <div className="form-group">
          <label>Phosphorus (P)</label>
          <input type="number" value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} placeholder="Enter Phosphorus level" />
        </div>
        <div className="form-group">
          <label>pH</label>
          <input type="number" value={ph} onChange={(e) => setPh(e.target.value)} placeholder="Enter pH level" />
        </div>

        <div className="form-group">
          <label>Weather Data Source</label>
          <select value={fetchWeather} onChange={(e) => setFetchWeather(e.target.value === "true")}>
            <option value="true">Use Current Weather</option>
            <option value="false">Enter Manually</option>
          </select>
        </div>

        {fetchWeather ? (
          <div className="weather-info">
            {weatherData ? (
              <>
                <h2>Weather Information:</h2>
                <p>Temperature: {weatherData.main.temp} °C</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Rainfall: {weatherData.rain ? weatherData.rain["1h"] : 0} mm</p>
              </>
            ) : (
              <p>Loading weather data...</p>
            )}
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="Enter Temperature" />
            </div>
            <div className="form-group">
              <label>Humidity (%)</label>
              <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder="Enter Humidity" />
            </div>
            <div className="form-group">
              <label>Rainfall (mm)</label>
              <input type="number" value={rainfall} onChange={(e) => setRainfall(e.target.value)} placeholder="Enter Rainfall" />
            </div>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <button onClick={handlePredict}>Get Prediction</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App;
