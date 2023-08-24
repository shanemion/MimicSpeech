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
  isAnalyzeButtonLoading,
  setIsAnalyzeButtonLoading,
  isRecordingListLoading,
  setIsRecordingListLoading,
  uniqueAudioID
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
      setRecordedPitchData((prevData) => [
        ...prevData,
        { id: uniqueAudioID, data: data.recorded_pitch_data },
      ]);
      if (recordedAudioURL) {
        setRecordedAudios(prev => [...prev, { id: uniqueAudioID, url: recordedAudioURL }]);
      }
      console.log("Synthesized Pitch z:", data.synthesized_pitch_data);
      console.log("Recorded Pitch z:", data.recorded_pitch_data);
    }
    setIsAnalyzeButtonLoading(false);
    setIsRecordingListLoading(false);
  };

  return (
    <div className="analyze-button">
      <button
          className={isAnalyzeButtonLoading ? "disabled" : "response-option"}
          onClick={() => {
          if (localStorage.getItem("TTS_audio_url") === "" || localStorage.getItem("user_audio_url") === "") {
            alert("Listen and record before comparing!");
          } else {
            setIsRecordingListLoading(true);
            setIsAnalyzeButtonLoading(true);
            handleAnalyzeAudio();
          }
        }}
        disabled={isAnalyzeButtonLoading}
      >
        Save and Compare
      </button>
    </div>
  );
};

export default AnalyzeButton;
