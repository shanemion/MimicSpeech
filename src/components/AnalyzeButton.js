import React, { useEffect, useState, useContext } from "react";
import analyzeAudio from "../utils/AnalyzeAudio";
import LanguageContext from "../services/language/LanguageContext";
import { useAuth } from "../services/firebase/FirebaseAuth";
import "./AnalyzeButton.css";

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
  uniquePracticeSynthesizedPitchID,
  isAnalyzeButtonDisabled,
  setIsAnalyzeButtonDisabled,
  mainString,
  rates,
  speed,
}) => {
  const { currentUser } = useAuth();
  const { selectedLanguage, selectedGender } = useContext(LanguageContext);


  useEffect(() => {
    localStorage.setItem("user_audio_url", "");
    setSynthesizedPitchData([]);
    setRecordedPitchData([]);
    setRecordedAudios([]);
  }, [generatedResponse]);

  useEffect(() => {
    setIsAnalyzeButtonDisabled(true);
  }, [selectedPage]);

  const handleAnalyzeAudio = async () => {
    const pracSynKey = `${currentUser.uid}_${mainString}-${selectedLanguage.value}-${selectedGender.value}-${rates[speed]}`;
    // console.log("pracSynKey:", pracSynKey);
    const data = await analyzeAudio(selectedPage, practiceData, pracSynKey);
    if (data) {
      if (selectedPage === "Practice") {
        const key = `${selectedPage}-${selectedSentenceIndex}`;
        const synthesizedKey = `${currentUser.uid}_${mainString}-${selectedLanguage.value}-${selectedGender.value}-${rates[speed]}`;
        const newPracticeData = {
          ...practiceData,
          [key]: {
            // synthesizedPracticePitchData: data.synthesized_pitch_data,
            synthesizedPracticePitchData: [
              ...(practiceData[synthesizedKey]?.synthesized_pitch_data ||
                []),
              {
                id: uniquePracticeSynthesizedPitchID,
                data: data.synthesized_pitch_data,
              },
            ],
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
        console.log("Practice Data:", newPracticeData);
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
      // console.log("Synthesized Pitch z:", data.synthesized_pitch_data);
      // console.log("Recorded Pitch z:", data.recorded_pitch_data);
    }
    setIsAnalyzeButtonLoading(false);
    setIsRecordingListLoading(false);
  };

  return (
    <>
      {isAnalyzeButtonDisabled ? (
        <div className="analyze-button">
          <div className="tooltip-container">
            <button
              className={
                isAnalyzeButtonLoading || isAnalyzeButtonDisabled
                  ? "analyze-button-disabled"
                  : "analyze-button-not-disabled"
              }
              onClick={() => {
                if (
                  !localStorage.getItem("TTS_audio") ||
                  !localStorage.getItem("user_audio_url")
                  // !practiceData[`${selectedPage}-${selectedSentenceIndex}`]
                  //   ?.recordedPracticePitchData?.length ||
                  // !practiceData[`${selectedPage}-${selectedSentenceIndex}`]
                  //   ?.recordedPracticeAudios?.length
                ) {
                  alert("Play TTS and record audio before comparing!!");
                } else {
                  setIsRecordingListLoading(true);
                  setIsAnalyzeButtonLoading(true);
                  setIsAnalyzeButtonDisabled(true);
                  handleAnalyzeAudio();
                }
              }}
              disabled={isAnalyzeButtonLoading || isAnalyzeButtonDisabled}
            >
              Save and Compare
            </button>
            {isAnalyzeButtonDisabled && (
              <div className="tooltip-text">
                Record a(nother) voice clip to analyze your performance!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="analyze-button">
          <button
            className={
              isAnalyzeButtonLoading || isAnalyzeButtonDisabled
                ? "analyze-button-disabled"
                : "analyze-button-not-disabled"
            }
            onClick={() => {
              if (
                selectedPage !== "Practice" && (
                !localStorage.getItem("TTS_audio") ||
                !localStorage.getItem("user_audio_url")) 
              ) {
                alert("Play TTS and record audio before comparing!!!");
                console.log(localStorage.getItem("TTS_audio"));
                console.log(localStorage.getItem("user_audio_url"));
                console.log(
                  practiceData[`${selectedPage}-${selectedSentenceIndex}`]
                    ?.recordedPracticePitchData?.length
                );
                console.log(
                  practiceData[`${selectedPage}-${selectedSentenceIndex}`]
                    ?.recordedPracticeAudios?.length
                );
                console.log(
                  practiceData[
                    `${currentUser.uid}_${mainString}-${selectedLanguage.value}-${selectedGender.value}-${rates[speed]}`
                  ]?.synthesizedPracticePitchData?.length
                );
              } else if (
                selectedPage === "Practice" &&
                // !practiceData[`${selectedPage}-${selectedSentenceIndex}`]
                //   ?.recordedPracticePitchData?.length ||
                // !practiceData[`${selectedPage}-${selectedSentenceIndex}`]
                //   ?.recordedPracticeAudios?.length ||
                !practiceData[`${currentUser.uid}_${mainString}-${selectedLanguage.value}-${selectedGender.value}-${rates[speed]}`] 
              ) {
                alert("Play TTS and record audio before comparing!");
                console.log("new mode", practiceData[`${currentUser.uid}_${mainString}-${selectedLanguage.value}-${selectedGender.value}-${rates[speed]}`]
                ?.synthesizedPracticePitchData?.length);
              } else {
                setIsRecordingListLoading(true);
                setIsAnalyzeButtonLoading(true);
                setIsAnalyzeButtonDisabled(true);
                handleAnalyzeAudio();
              }
            }}
            disabled={isAnalyzeButtonLoading || isAnalyzeButtonDisabled}
          >
            Save and Compare
          </button>
        </div>
      )}
    </>
  );
};

export default AnalyzeButton;
