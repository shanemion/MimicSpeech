import React, { useRef, useEffect, useContext } from "react";
import { useAuth } from "../services/firebase/FirebaseAuth";
import LanguageContext from "../services/language/LanguageContext";
import Chart from "chart.js/auto";
import "../styles.css";

const filterOutliers = (data) => {
  const sortedData = [...data].sort((a, b) => a - b);
  const q1 = sortedData[Math.floor(sortedData.length / 4)];
  const q3 = sortedData[Math.floor((3 * sortedData.length) / 4)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return data.filter((value) => value >= lowerBound && value <= upperBound);
};

const PitchChart = ({
  practiceData,
  synthesizedPitchData,
  recordedPitchData,
  recordedAudios,
  synthesizedPracticePitchData,
  recordedPracticePitchData,
  recordedPracticeAudios,
  generatedResponse,
  isRecordingListLoading,
  selectedPage,
  selectedSentenceIndex,
  mainString,
  rates,
  speed,
}) => {
  const { currentUser } = useAuth();
  const { selectedLanguage, selectedGender } = useContext(LanguageContext);
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

    let activeSynthesizedPitchData = [];
    let activeRecordedPitchData = [];
    let activeRecordedAudios = [];

    if (selectedPage === "Practice") {
      const synthesizedKey = `${currentUser.uid}_${mainString}-${selectedLanguage.value}-${selectedGender.value}-${rates[speed]}`;
      const key = `${selectedPage}-${selectedSentenceIndex}`;
      // console.log("Key:", key)
      if (practiceData && practiceData[key] && Array.isArray(practiceData[key].synthesizedPracticePitchData)) {
        const entry = practiceData[key].synthesizedPracticePitchData.find(e => e.id === synthesizedKey);
        if (entry) {
          activeSynthesizedPitchData = entry.data;
        }
      }
  
      if (practiceData && practiceData[key]) {
        
        activeRecordedPitchData =
          practiceData[key].recordedPracticePitchData || [];
        activeRecordedAudios = practiceData[key].recordedPracticeAudios || [];
        // console.log("PCPD:", activeSynthesizedPitchData);
        // console.log("PCSD", activeRecordedPitchData);
        // console.log("PCRD", activeRecordedAudios);
      }
    } else {
      activeSynthesizedPitchData = synthesizedPitchData || [];
      activeRecordedPitchData = recordedPitchData || [];
      activeRecordedAudios = recordedAudios || [];
      // console.log("NPD:", activeSynthesizedPitchData);
      // console.log("NRD:", activeRecordedPitchData);
      // console.log("NA:", activeRecordedAudios);
    }
    let filteredSynthesizedData = [];
    if (activeSynthesizedPitchData) {
      filteredSynthesizedData = filterOutliers(
        activeSynthesizedPitchData.filter(
          (value) => typeof value === "number" && Math.abs(value) > 0.01
        )
      );
    } else {
      console.warn("activeSynthesizedPitchData is undefined");
    }

    const datasets = [
      {
        label: "Target Pitch",
        data: filteredSynthesizedData,
        borderColor: "black",
        borderWidth: 3,
        fill: false,
        pointRadius: 0, // Add this line
      },
      ...activeRecordedAudios.map((audio, index) => {
        const pitchDataItem = activeRecordedPitchData.find(
          (item) => item.id === audio.id
        );
        const pitchData = pitchDataItem ? pitchDataItem.data : [];
        const filteredData = pitchData.filter(
          (value) => typeof value === "number" && Math.abs(value) > 0.01
        );
        return {
          label: `Recording ${index + 1}`,
          tension: 0.3,
          pointRadius: 0, // Add this line
          data: filteredData,
          borderColor: colors[index % colors.length],
          borderWidth: 3,
          fill: false,
        };
      }),
    ];

    // Calculate the maximum value from both synthesized and recorded data
    const maxSynthesizedValue = Math.max(...filteredSynthesizedData);
    const maxRecordedValues = datasets
      .slice(1)
      .map((dataset) => Math.max(...dataset.data)); // Exclude synthesized data
    const maxYValue = Math.max(maxSynthesizedValue, ...maxRecordedValues);

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: filteredSynthesizedData.map((_, index) => index),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: maxYValue,
            title: {
              display: true,
              text: "Pitch in Hz",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [
    synthesizedPitchData,
    recordedPitchData,
    recordedAudios,
    synthesizedPracticePitchData,
    recordedPracticePitchData,
    recordedPracticeAudios,
    selectedPage,
    generatedResponse,
    practiceData,
    selectedSentenceIndex,
    selectedLanguage,
    selectedGender,
    rates,
    speed,
    currentUser,
    mainString
  ]);


  return (
    <div>
      <div
        style={{
          position: "relative",
          height: "40vh",
          width: "80vw",
          padding: "10px",
        }}
        className={isRecordingListLoading ? "chart-loading" : "chart"}
      >
        <canvas ref={canvasRef} width="800" height="400"></canvas>
      </div>
    </div>
  );
};

export default PitchChart;