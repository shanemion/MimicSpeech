import React from "react";
import PitchAccuracy from "./PitchAccuracy";
import LoaderIcon from "react-loader-icon";
import "./RecordedAudios.css";

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
  mainString,
  rates,
  speed,
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

  // console.log("recordings:", recordings);

  // write if recordings is empty, then return "No recordings yet!"
  if (recordings.length === 0) {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h3>No recordings yet!</h3>
        <p>Click "Save and Compare" to listen to your history.</p>
      </div>
      </div>
    
       
    );
  }

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
          <p>Recording {index + 1}:</p>
          <button
            className="styled-button"
            onClick={() => playAudio(audio.url)}
          >
            Play
          </button>
          <button
            className="styled-button delete-button"
            onClick={() => handleDelete(audio.id)}
          >
            Delete
          </button>
          <PitchAccuracy
            practiceData={practiceData}
            synthesizedPitchData={synthesizedPitchData}
            recordedPitchData={recordedPitchData[index]}
            selectedPage={selectedPage}
            selectedSentenceIndex={selectedSentenceIndex}
            mainString={mainString}
            rates={rates}
            speed={speed}
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
