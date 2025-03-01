import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

const FileUploader = ({ onDataProcessed }) => {
  const [fileName, setFileName] = useState("");
  const [historicalData, setHistoricalData] = useState([]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === "text/csv") {
      setFileName(file.name);
      parseCSV(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        processData(result.data);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const processData = (data) => {
    console.log("Raw CSV Data:", data);

    const processed = data
      .filter((row) => row.company && row.date && row.priceUSD)
      .map((row) => ({
        company: row.company,
        date: row.date,
        price: parseFloat(row.priceUSD),
      }))
      .filter((row) => !isNaN(row.price));

    console.log("Processed Data:", processed);

    if (processed.length === 0) {
      alert("No valid data found in the CSV file.");
      return;
    }

    setHistoricalData(processed);
    onDataProcessed(processed);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
        "text/csv": [".csv"],
     } // Ensure proper MIME type
  });

  return (
    <div>
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        <p>Drag & drop a CSV file here, or click to select</p>
      </div>
      {fileName && <p><strong>Uploaded:</strong> {fileName}</p>}
    </div>
  );
};

const styles = {
  dropzone: {
    border: "2px dashed #ccc",
    borderRadius: "5px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "20px",
  },
};

export default FileUploader;
