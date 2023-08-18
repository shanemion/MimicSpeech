import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import styles from "../styles.css";

const PitchChart = ({ synthesizedData, recordedData, generatedResponse }) => {
  const canvasRef = useRef(null);
  const colors = [
    "red",
    "blue",
    "green",
    "purple",
    "orange",
    "cyan",
    "magenta",
    "yellow",
    "lime",
    "pink",
  ];

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Filter out non-numeric values and values close to zero
    const filteredSynthesizedData = synthesizedData.filter(
      (value) => typeof value === "number" && Math.abs(value) > 0.01
    );
    const filteredRecordedData = recordedData.map((data) =>
      data.filter((value) => typeof value === "number" && Math.abs(value) > 0.01)
    );

    console.log(filteredSynthesizedData);
    console.log(filteredRecordedData);

    const datasets = [
      {
        label: "Synthesized Pitch",
        data: filteredSynthesizedData,
        borderColor: "black",
        borderWidth: 1,
        fill: false,
      },
      ...filteredRecordedData.map((data, index) => ({
        label: `Recorded Pitch ${index + 1}`,
        data: data,
        borderColor: colors[index % colors.length], // This ensures we cycle through the colors
        borderWidth: 1,
        fill: false,
      })),
    ];

    // Calculate the maximum value from both synthesized and recorded data
    const maxSynthesizedValue = Math.max(...filteredSynthesizedData);
    const maxRecordedValue = Math.max(...filteredRecordedData.flat());
    const maxYValue = Math.max(maxSynthesizedValue, maxRecordedValue);

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: filteredSynthesizedData.map((_, index) => index),
        datasets: datasets,
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: maxYValue,
          },
        },
      },
    });
    return () => chart.destroy();
  }, [synthesizedData, recordedData, generatedResponse]);

  return (
    <div className="chart">
      <canvas ref={canvasRef} width="800" height="400"></canvas>
    </div>
  );
};

export default PitchChart;
