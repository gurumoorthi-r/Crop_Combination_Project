import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const prediction = location.state?.prediction; // Get the prediction result from state
  const navigate = useNavigate();
  if (!prediction) {
    return <h2>No Prediction Data Available</h2>;
  }

  return (
    <div className="result-container">
      <h1>Prediction Result</h1>
      
      {prediction.error ? (
        <p className="error">{prediction.error}</p>
      ) : (
        <>
          <h2>Main Recommended Crop: {prediction.main_crop}</h2>
          <h3>Suggested Sub-Crops:</h3>
          <ul>
          <ul>
  {prediction.sub_crops.map((crop, index) => (
    <li key={index}>{crop.sub_crop} (Distance: {crop.distance.toFixed(2)})</li>
  ))}
</ul>

          </ul>
          {prediction.warnings != null && <p className="warning">⚠️ {prediction.warnings}</p>}
        </>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ResultPage;
