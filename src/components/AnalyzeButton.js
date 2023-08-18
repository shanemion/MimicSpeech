import React, { useState, useEffect } from "react";
import analyzeAudio from "../utils/AnalyzeAudio";
import PitchChart from "./PitchChart";
import "../styles.css";

const AnalyzeButton = ({
  synthesizedPitchData,
  setSynthesizedPitchData,
  recordedPitchData,
  setRecordedPitchData,
  generatedResponse,
  setRecordedAudios
}) => {
    useEffect(() => {
        // Clear the pitch data in local storage when generatedResponse changes
        localStorage.setItem("TTS_audio_url", "");
        localStorage.setItem("user_audio_url", "");
        setSynthesizedPitchData([]);
        setRecordedPitchData([]);
        setRecordedAudios([]);
    }, [generatedResponse]);
    

  const handleAnalyzeAudio = async () => {
    const data = await analyzeAudio();
    if (data) {
      setSynthesizedPitchData(data.synthesized_pitch_data);
      setRecordedPitchData((prevData) => [
        ...prevData,
        data.recorded_pitch_data,
      ]);

      console.log("Synthesized Pitch z:", data.synthesized_pitch_data);
      console.log("Recorded Pitch z:", data.recorded_pitch_data);
    }
  };

  console.log("Synthesized Pitch Data Length:", synthesizedPitchData.length);
  console.log("Recorded Pitch Data Length:", recordedPitchData.length);

  return (
    <div className="analyze-button">
      <button
        className="response-option"
        // onClick={handleAnalyzeAudio}
        onClick={localStorage.getItem("TTS_audio_url") === "" || localStorage.getItem("user_audio_url") === "" ? () => alert("Listen and record before comparing!") : handleAnalyzeAudio}
      >
        Save and Compare
      </button>

    </div>
  );
};

export default AnalyzeButton;
