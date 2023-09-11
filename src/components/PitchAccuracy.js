import React, { useContext } from "react";
import { useAuth } from "../services/firebase/FirebaseAuth";
import LanguageContext from "../services/language/LanguageContext";

const filterOutliers = (data) => {
    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = sortedData[Math.floor(sortedData.length / 4)];
    const q3 = sortedData[Math.floor(3 * sortedData.length / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
  
    return data.filter((value) => value >= lowerBound && value <= upperBound);
  };

const PitchAccuracy = ({ practiceData, synthesizedPitchData, recordedPitchData, selectedPage, selectedSentenceIndex, mainString, rates, speed }) => {

  const { currentUser } = useAuth();
  const { selectedLanguage, selectedGender } = useContext(LanguageContext);
  let activePitchData = [];
  let activeRecordedPitchData = [];

  if (selectedPage === "Practice") {
    const key = `${selectedPage}-${selectedSentenceIndex}`;
    const synthesizedKey = `${currentUser.uid}_${mainString}-${selectedLanguage.value}-${selectedGender.value}-${rates[speed]}`;
  
    if (practiceData && practiceData[key] ) {
  // Check if the object at `practiceData[key]` contains a field called `synthesizedPracticePitchData`
  if (Array.isArray(practiceData[key].synthesizedPracticePitchData)) {
    
              const entry = practiceData[key].synthesizedPracticePitchData.find(e => e.id === synthesizedKey);

              // If the entry was found, retrieve its `data` field
              if (entry) {
                activePitchData = entry.data;
              }
            }
    
      // This line should work fine as you mentioned
      activeRecordedPitchData = practiceData[key].recordedPracticePitchData.flatMap(e => e.data) || [];
    }
  }else {
    activePitchData = synthesizedPitchData || [];
    activeRecordedPitchData = recordedPitchData.data || [];
  }

  console.log("Active Pitch Data:", activePitchData);
  console.log("Active Recorded Pitch Data:", activeRecordedPitchData);

  if (!activePitchData) {
    return <div>Loading...</div>;
  }
  if (!activeRecordedPitchData) {
    return <div>Loading....</div>;
  }
  // const recordedData = recordedPitchData.data;  //   const recordedData = synthesizedPitchData;
  // console.log("Recorded Pitch:", recordedData);

  let filteredSynthesizedData = activePitchData.filter(
    (value) => typeof value === "number" && Math.abs(value) > 0.01
  );

  let filteredRecordedData = activeRecordedPitchData.filter(
    (value) => typeof value === "number" && Math.abs(value) > 0.01
  );

  filteredSynthesizedData = filterOutliers(filteredSynthesizedData);
  filteredRecordedData = filterOutliers(filteredRecordedData);

  while (filteredRecordedData.length < filteredSynthesizedData.length) {
    filteredRecordedData.push(0.01);
  }

  if (filteredRecordedData.length > filteredSynthesizedData.length) {
    filteredRecordedData = filteredRecordedData.slice(
      0,
      filteredSynthesizedData.length
    );
  }

  // console.log("Filtered Synthesized Pitch:", filteredSynthesizedData);
  // console.log("Filtered Recorded Pitch:", filteredRecordedData);

  const calculateAccuracy = () => {
    // Calculate the average pitch for each dataset
    const avgSynthesized =
      filteredSynthesizedData.reduce((a, b) => a + b, 0) /
      filteredSynthesizedData.length;
    const avgRecorded =
      filteredRecordedData.reduce((a, b) => a + b, 0) /
      filteredRecordedData.length;

    // Calculate the overall average pitch
    const overallAvg = (avgSynthesized + avgRecorded) / 2;

    // Normalize each dataset based on the overall average pitch
    const normalizedSynthesized = filteredSynthesizedData.map(
      (x) => x - overallAvg
    );
    const normalizedRecorded = filteredRecordedData.map((x) => x - overallAvg);

    // Initialize variables to hold the sum of accuracies and the number of points
    let accuracy = 0;
    let totalAccuracy = 0;

    // Loop through each point to calculate the accuracy
    for (let i = 0; i < normalizedSynthesized.length; i++) {
      const distance = Math.abs(
        normalizedRecorded[i] - normalizedSynthesized[i]
      );

      // Check if the point is within the safe zone
      if (distance <= 50) {
        accuracy += 1;
      } else {
        // Apply custom scaling for points outside the safe zone
        let scalingFactor = 0;
        if (distance <= 60) scalingFactor = 0.9;
        else if (distance <= 70) scalingFactor = 0.75;
        else if (distance <= 80) scalingFactor = 0.65;
        else if (distance <= 90) scalingFactor = 0.45;
        else if (distance <= 100) scalingFactor = 0.25;
        else if (distance <= 110) scalingFactor = 0.15;
        else if (distance <= 120) scalingFactor = 0.1;
        else if (distance <= 130) scalingFactor = 0.05;
        else if (distance <= 140) scalingFactor = 0.03;
        else if (distance <= 150) scalingFactor = 0.02;
        else if (distance <= 160) scalingFactor = 0.01;
        // ... (add more conditions as needed)
        else scalingFactor = 0; // for distances far from the safe zone

        accuracy += scalingFactor;
      }
      totalAccuracy += 1;
    }

    // Calculate the overall accuracy
    const overallAccuracy = (accuracy / totalAccuracy) * 100;
    const roundedOverallAccuracy = parseFloat(overallAccuracy.toFixed(2));

    return roundedOverallAccuracy;
  };

  const calculatePurePitchAccuracy = () => {
    let totalPercentAccuracy = 0;
    let count = 0;

    // Calculate the rate of change (derivative) for each dataset
    const rateOfChangeSynthesized = filteredSynthesizedData
      .slice(1)
      .map((val, i) => val - filteredSynthesizedData[i]);
    const rateOfChangeRecorded = filteredRecordedData
      .slice(1)
      .map((val, i) => val - filteredRecordedData[i]);

    for (let i = 0; i < rateOfChangeSynthesized.length; i++) {
      const changeSynthesized = rateOfChangeSynthesized[i];
      const changeRecorded = rateOfChangeRecorded[i];

      if (
        Math.abs(changeSynthesized) > 0.01 &&
        Math.abs(changeRecorded) > 0.01
      ) {
        // Check if the rate of change is within the safe zone (e.g., +/- 5 Hz)
        if (Math.abs(changeSynthesized - changeRecorded) <= 5) {
          totalPercentAccuracy += 1;
        } else {
          // Apply custom scaling for rate changes outside the safe zone
          let scalingFactor = 0;
          const distance = Math.abs(changeSynthesized - changeRecorded);
          if (distance <= 10) scalingFactor = 0.9;
          else if (distance <= 15) scalingFactor = 0.75;
          else if (distance <= 20) scalingFactor = 0.65;
          else if (distance <= 25) scalingFactor = 0.45;
          else if (distance <= 30) scalingFactor = 0.25;
            else if (distance <= 35) scalingFactor = 0.15;
            else if (distance <= 40) scalingFactor = 0.1;
            else if (distance <= 45) scalingFactor = 0.05;
          else scalingFactor = 0; // for distances far from the safe zone

          totalPercentAccuracy += scalingFactor;
        }
        count++;
      }
    }

    const purePitchAccuracy =
      count === 0 ? 0 : (totalPercentAccuracy / count) * 100;
    return parseFloat(purePitchAccuracy.toFixed(2)); // Rounded to 2 decimal places
  };

  // Usage
  let purePitchAccuracy = calculatePurePitchAccuracy();
  // console.log("Pure Pitch Accuracy:", purePitchAccuracy);

  let accuracy = calculateAccuracy();
  // console.log("Accuracy:", accuracy);

  return (
    <div className="pitch-accuracy">
      <p>Accuracy: {accuracy}%</p>
      <p>Pure Pitch Accuracy: {purePitchAccuracy}%</p>
    </div>
  );
};

export default PitchAccuracy;
