import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import styles from "../styles.css";

const filterOutliers = (data) => {
    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = sortedData[Math.floor(sortedData.length / 4)];
    const q3 = sortedData[Math.floor(3 * sortedData.length / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
  
    return data.filter((value) => value >= lowerBound && value <= upperBound);
  };

const PitchChart = ({ synthesizedPitchData, recordedPitchData, recordedAudios, generatedResponse }) => {
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

    const filteredSynthesizedData = filterOutliers(
        synthesizedPitchData.filter(
          (value) => typeof value === "number" && Math.abs(value) > 0.01
        )
      );

    const datasets = [
      {
        label: "Synthesized Pitch",
        data: filteredSynthesizedData,
        borderColor: "black",
        borderWidth: 1,
        fill: false,
      },
      ...recordedAudios.map((audio, index) => {
        const pitchDataItem = recordedPitchData.find(item => item.id === audio.id);
        const pitchData = pitchDataItem ? pitchDataItem.data : [];
        const filteredData = pitchData.filter(
          (value) => typeof value === "number" && Math.abs(value) > 0.01
        );
        return {
          label: `Recorded Pitch ${index + 1}`,
          data: filteredData,
          borderColor: colors[index % colors.length],
          borderWidth: 1,
          fill: false,
        };
      }),
    ];

    // Calculate the maximum value from both synthesized and recorded data
    const maxSynthesizedValue = Math.max(...filteredSynthesizedData);
    const maxRecordedValues = datasets.slice(1).map(dataset => Math.max(...dataset.data)); // Exclude synthesized data
    const maxYValue = Math.max(maxSynthesizedValue, ...maxRecordedValues);

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
  }, [synthesizedPitchData, recordedPitchData, recordedAudios, generatedResponse]);

  return (
    <div className="chart">
      <canvas ref={canvasRef} width="800" height="400"></canvas>
    </div>
  );
};

export default PitchChart;
