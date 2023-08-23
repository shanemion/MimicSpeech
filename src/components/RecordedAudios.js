import React from "react";
import PitchAccuracy from "./PitchAccuracy"; 

export const RecordedAudios = ({
  recordedAudios,
  playAudio,
  deleteAudio,
  synthesizedPitchData,
  recordedPitchData,
}) => {
  const handleDelete = (audioId) => {
    deleteAudio(audioId);
  };

  return (
    <div>
      {recordedAudios.map((audio, index) => (
        <div key={audio.id} className="recorded-audio-item">
          <p>Recording {index + 1}</p>
          <button onClick={() => playAudio(audio.url) }>Play</button>
          <button onClick={() => handleDelete(audio.id)}>Delete</button>
          <PitchAccuracy
                synthesizedPitchData={synthesizedPitchData}
                recordedPitchData={recordedPitchData[index]}
              />
        </div>
      ))}
    </div>
  );
};
