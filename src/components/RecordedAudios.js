import React from "react";
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
  const handleDelete = (audioId) => {
    deleteAudio(audioId);
  };

  let recordings = [];

  if (selectedPage === "Practice") {
    if (
      practiceData &&
      practiceData[`${selectedPage}-${selectedSentenceIndex}`]
    ) {
      recordings =
        practiceData[`${selectedPage}-${selectedSentenceIndex}`]
          .recordedPracticeAudios;
    }
  } else {
    recordings = recordedAudios;
  }

  console.log("recordings:", recordings);

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
            practiceData={practiceData}
            synthesizedPitchData={synthesizedPitchData}
            recordedPitchData={recordedPitchData[index]}
            selectedPage={selectedPage}
            selectedSentenceIndex={selectedSentenceIndex}
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
