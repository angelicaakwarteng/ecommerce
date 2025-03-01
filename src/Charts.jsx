import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const Chart = ({ predictions }) => {
  return (
    <div>
      <LineChart width={800} height={400} data={predictions}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" name="Historical Prices" />
          {predictions.length > 0 && (
            <Line type="monotone" dataKey="price" data={predictions} stroke="#82ca9d" name="Predicted Prices" />
          )}
      </LineChart>
    </div>
  );
};

export default Chart;
