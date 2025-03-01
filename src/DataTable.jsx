import React from "react";

const DataTable = ({ data }) => {
  return (
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
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.company}</td>
              <td>{row.date}</td>
              <td>${row.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
