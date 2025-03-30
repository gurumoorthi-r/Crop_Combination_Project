import React from "react";
import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const prediction = location.state?.prediction; // Get the prediction result from state

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
            {prediction.sub_crops.map((crop, index) => (
              <li key={index}>{crop}</li>
            ))}
          </ul>
          {prediction.warnings && <p className="warning">⚠️ {prediction.warnings}</p>}
        </>
      )}
    </div>
  );
};

export default ResultPage;
