import React from "react";
import PitchAccuracy from "./PitchAccuracy"; // Make sure to adjust the import path if needed
import analyzeAudio from "../utils/AnalyzeAudio";

export const RecordedAudios = ({
  recordedAudios,
  playAudio,
  deleteAudio,
  synthesizedPitchData,
  recordedPitchData,
  setRecordedPitchData,
  forceChartUpdate,
}) => {
  const handleDelete = (audioId) => {
    deleteAudio(audioId);
  };

  return (
    <div>
      {recordedAudios.map((audio, index) => (
        <div key={audio.id} className="recorded-audio-item">
          <p>Recording {index + 1}</p>
          <button onClick={() => playAudio(audio.url)}>Play</button>
          <button onClick={() => handleDelete(audio.id)}>Delete</button>
          {/* <PitchAccuracy
                synthesizedData={synthesizedData}
                recordedData={recordedData}
              /> */}
        </div>
      ))}
    </div>
  );
};
