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
  recordedAudioURL,
  setRecordedAudios,
}) => {

  useEffect(() => {
    localStorage.setItem("user_audio_url", "");
    setSynthesizedPitchData([]);
    setRecordedPitchData([]);
    setRecordedAudios([]);
  }, [generatedResponse]);

  const handleAnalyzeAudio = async () => {
    const data = await analyzeAudio();
    if (data) {
      setSynthesizedPitchData(data.synthesized_pitch_data);
      const uniqueId = new Date().toISOString();
      setRecordedPitchData((prevData) => [
        ...prevData,
        { id: uniqueId, data: data.recorded_pitch_data },
      ]);
      if (recordedAudioURL) {
        setRecordedAudios(prev => [...prev, { id: uniqueId, url: recordedAudioURL }]);
      }
      console.log("Synthesized Pitch z:", data.synthesized_pitch_data);
      console.log("Recorded Pitch z:", data.recorded_pitch_data);
    }
  };

  return (
    <div className="analyze-button">
      <button
        className="response-option"
        onClick={() => {
          if (localStorage.getItem("TTS_audio_url") === "" || localStorage.getItem("user_audio_url") === "") {
            alert("Listen and record before comparing!");
          } else {
            handleAnalyzeAudio();
          }
        }}
      >
        Save and Compare
      </button>
    </div>
  );
};

export default AnalyzeButton;
