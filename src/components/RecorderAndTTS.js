import React, { useState } from "react";
import Countdown from "./Countdown";

export const BothRecordAndTTS = ({
  sendToTTS,
  recordedChunks,
  stopRecording,
  startRecording,
  isRecording,
}) => {
  const [seconds, setSeconds] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false); // State to control the rendering of the countdown

  const playBackBoth = () => {
    if (recordedChunks && recordedChunks.length > 0) {
      const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
      const audioURL = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioURL);
      audioElement.play();
    }

    setTimeout(() => {
      if (recordedChunks) {
        sendToTTS();
      }
    }, 1000);
  };

  const handleButtonClick = () => {
    if (!isRecording) {
      setShowCountdown(true); // Show the countdown when the button is clicked and not recording
      const countdownInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        setShowCountdown(false); // Hide the countdown after the recording starts
        startRecording();
        setTimeout(() => {
          sendToTTS();
        }, 1000);
      }, 3000); // Set the duration of the countdown here (3 seconds in this example)
    } else {
      stopRecording();
    }
  };

  return (
    <div>
      {/* UI for recording and playback */}
      <button onClick={handleButtonClick}>
        {isRecording
          ? "Stop Recording"
          : "Start Recording alongside Text to Speech!"}
      </button>
      <button onClick={() => playBackBoth()}>
        Listen to your voice alongside Text to Speech!
      </button>
      {showCountdown && <Countdown seconds={seconds} setSeconds={setSeconds} />}
    </div>
  );
};
