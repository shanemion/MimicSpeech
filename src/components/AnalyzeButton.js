import React, { useEffect } from "react";
import analyzeAudio from "../utils/AnalyzeAudio";
import "../styles.css";

const AnalyzeButton = ({
  practiceData,
  setPracticeData,
  setSynthesizedPitchData,
  setRecordedPitchData,
  generatedResponse,
  recordedAudioURL,
  setRecordedAudios,
  isAnalyzeButtonLoading,
  setIsAnalyzeButtonLoading,
  setIsRecordingListLoading,
  uniqueAudioID,
  selectedPage,
  selectedSentenceIndex,
  uniquePracticeAudioID,
}) => {
  useEffect(() => {
    localStorage.setItem("user_audio_url", "");
    setSynthesizedPitchData([]);
    setRecordedPitchData([]);
    setRecordedAudios([]);
  }, [generatedResponse]);

  const handleAnalyzeAudio = async () => {
    const data = await analyzeAudio(selectedPage);
    if (data) {
      if (selectedPage === "Practice") {
        const key = `${selectedPage}-${selectedSentenceIndex}`;
        const newPracticeData = {
          ...practiceData,
          [key]: {
            synthesizedPracticePitchData: data.synthesized_pitch_data,
            recordedPracticePitchData: [
              ...(practiceData[key]?.recordedPracticePitchData || []),
              { id: uniquePracticeAudioID, data: data.recorded_pitch_data },
            ],
            recordedPracticeAudios: [
              ...(practiceData[key]?.recordedPracticeAudios || []),
              { id: uniquePracticeAudioID, url: recordedAudioURL },
            ],
          },
        };
        setPracticeData(newPracticeData);
        console.log("Practice Data:", newPracticeData)
      } else {
        setSynthesizedPitchData(data.synthesized_pitch_data);
        setRecordedPitchData((prevData) => [
          ...prevData,
          { id: uniqueAudioID, data: data.recorded_pitch_data },
        ]);
        if (recordedAudioURL) {
          setRecordedAudios((prev) => [
            ...prev,
            { id: uniqueAudioID, url: recordedAudioURL },
          ]);
        }
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
          if (
            (localStorage.getItem("TTS_audio_url") === "" ||
            localStorage.getItem("user_audio_url") === "") || 
            (practiceData[`${selectedPage}-${selectedSentenceIndex}`]?.recordedPracticePitchData?.length === 0 ||
            practiceData[`${selectedPage}-${selectedSentenceIndex}`]?.recordedPracticeAudios?.length === 0)
          ) {
            alert("Play TTS and record audio before comparing!");
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
