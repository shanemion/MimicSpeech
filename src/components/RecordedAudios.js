import React from "react";
import PitchAccuracy from "./PitchAccuracy";
import LoaderIcon from "react-loader-icon";

export const RecordedAudios = ({
  recordedAudios,
  playAudio,
  deleteAudio,
  synthesizedPitchData,
  recordedPitchData,
  isRecordingListLoading,
  setIsRecordingListLoading,
}) => {
  const handleDelete = (audioId) => {
    deleteAudio(audioId);
  };

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
      {recordedAudios.map((audio, index) => (
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
