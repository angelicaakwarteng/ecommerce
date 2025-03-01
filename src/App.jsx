import React, { useState } from "react";
import FileUploader from '../src/FileUploader'
import DataTable from '../src/DataTable'
import Chart from '../src/Charts'

const App = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const handleDataProcessed = (data) => {
    setHistoricalData(data);
    sendDataToBackend(data);
  };

  const sendDataToBackend = (data) => {
    fetch("http://localhost:8000/api/predict/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ historical_data: data }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Predictions from backend:", data);
        setPredictions(data.predictions);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to get predictions");
      });
  };

  return (
    <>
    <div style={{flexWrap:"wrap"}}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Frontend UI: Full-Stack Project 1</h1>
        <h3>My first full-stack project. Frontend UI is built on react and Backend runs on Python, Django.</h3>
        <p>Project focuses on predicting the stock prices of the ecommerce dataset (csv file) for the next 10 years. Backend runs on ML model, Linear regression while frontend runs on React and react bootstrap. The rationale of the project is to receive the dataset at frontend (on the left) and send to backend for processing and predictions are communicated back to user in chart forms (on the right).</p>
      </div>
      <div style={{ padding: "20px", display: "flex" }}>
        <div style={{display:"block", width: "30%"}}>
          <h1>Price Predictor App</h1>
          <FileUploader onDataProcessed={handleDataProcessed} />
          {historicalData.length > 0 && <DataTable data={historicalData} />}
        </div>
        <div style={{display:"block", textAlign: "center", width: "40%"}}>
          <h1>Price Prediction Charts</h1>
          {predictions.length > 0 && <Chart predictions={predictions} />}
        </div>
      </div>
    </div>
    </>
  )
}

export default App