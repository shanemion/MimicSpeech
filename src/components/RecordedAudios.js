import React, { useEffect } from "react";
import PitchAccuracy from "./PitchAccuracy";
import LoaderIcon from "react-loader-icon";

export const RecordedAudios = ({
  practiceData,
  recordedAudios,
  recordedPracticeAudios,
  playAudio,
  deleteAudio,
  synthesizedPitchData,
  recordedPitchData,
  isRecordingListLoading,
  selectedPage,
  selectedSentenceIndex,
}) => {

  useEffect(() => {
    console.log("practiceData has changed:", practiceData);
  }, [practiceData]);
  const handleDelete = (audioId) => {
    deleteAudio(audioId);
  };


  let recordings = [];
  console.log("practiceData1", practiceData);

if (selectedPage === "Practice") {
  if (practiceData && practiceData[`${selectedPage}-${selectedSentenceIndex}`]) {
    recordings = practiceData[`${selectedPage}-${selectedSentenceIndex}`].recordedPracticeAudios;
  }
} else {
  recordings = recordedAudios;
}
console.log("recordings", recordings);
console.log("practiceData2", practiceData);


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h2>Recorded Audios</h2>
      </div>
      {recordings.map((audio, index) => (
        <div key={audio.id} className="recorded-audio-item">
          <p>Recording {index + 1}</p>
          <button onClick={() => playAudio(audio.url)}>Play</button>
          <button onClick={() => handleDelete(audio.id)}>Delete</button>
          <PitchAccuracy
            synthesizedPitchData={synthesizedPitchData}
            recordedPitchData={recordedPitchData[index]}
          />
        </div>
      ))}

      <div>
        {isRecordingListLoading && (
          <LoaderIcon type="bubbles" color="#000000" />
        )}
      </div>
    </div>
  );
};
