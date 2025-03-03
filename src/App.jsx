import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Function to predict future prices
const predictPrices = (price2025, cagr, years) => {
  const predictions = [];
  for (let i = 1; i <= years; i++) {
    const futurePrice = price2025 * Math.pow(1 + cagr, i);
    predictions.push({ year: 2025 + i, price: futurePrice });
  }
  return predictions;
};

function App() {
  const [parsedData, setParsedData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [cagr, setCagr] = useState(0.15); 

  // Update companies after parsing CSV
  const companies = parsedData;
  const predictions = selectedCompany ? predictPrices(selectedCompany.price, cagr, 10) : [];

  // Chart data
  const chartData = {
    labels: predictions.map(p => p.year),
    datasets: [
      {
        label: selectedCompany ? `${selectedCompany.company} Price (USD)` : "Price Prediction",
        data: predictions.map(p => p.price),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Stock Price Prediction (2025-2034)' },
    },
    scales: {
      y: { beginAtZero: false, title: { display: true, text: 'Price (USD)' } },
      x: { title: { display: true, text: 'Year' } },
    },
  };

  // Handle CSV file drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        processData(results.data);
      },
      error: (error) => console.error('Error parsing CSV:', error),
    });
  };

  const processData = (data) => {
    const processed = data
      .filter(row => row.company && row.date && row.priceUSD)
      .map(row => ({
        company: row.company,
        date: row.date,
        price: parseFloat(row.priceUSD),
      }))
      .filter(row => !isNaN(row.price));

    setParsedData(processed);
    if (processed.length > 0) setSelectedCompany(processed[0]); 
  };

  return (
    <div className="DropApp">
      <div style={{padding:"1%", justifyContent:"center", alignItems:"center"}}>
        <h1>Price Predictor App</h1>
        <h4>Full Stack Project 1: React (Frontend) and Django (Backend)</h4>
        <p>
          Project is aimed at integrating machine learning model into app.
          The app is to help predict the price of a stock based on historical data provided by the user in csv format. Data must include at least company name, date, and price. Note: price is in USD and refers to stock price. Price is predicted with CAGR (Compound Annual Growth Rate) of 15% and is calculated based on the price of the stock in 2025, February 13th.
        </p>
      </div>

      {/* Drag and Drop */}
      <Dropzone onDrop={onDrop} accept={{ 'text/csv': ['.csv'] }}>
        {({ getRootProps, getInputProps }) => (
          <section className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop a CSV file here, or click to select one.</p>
          </section>
        )}
      </Dropzone>

      <div style={{display:"flex", justifyContent:"space-between", gap:"10px"}}>
        {/* Parsed Data Table */}
        {parsedData.length > 0 && (
          <div>
            <h3>Uploaded CSV Data</h3>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.company}</td>
                    <td>{row.date}</td>
                    <td>${row.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="chart">
          {companies.length > 0 && (
            <label>
              Select Company:
              <select
                value={selectedCompany?.company || ""}
                onChange={(e) => {
                  const company = companies.find(c => c.company === e.target.value);
                  setSelectedCompany(company);
                }}
              >
                {companies.map((company, index) => (
                  <option key={index} value={company.company}>
                    {company.company}
                  </option>
                ))}
              </select>
            </label>
          )}

          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default App;
