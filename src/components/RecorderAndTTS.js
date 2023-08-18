import React, { useState, useRef } from "react";
import Countdown from "./Countdown";
import Recorder from 'recorder-js';
import "../styles.css";

export const BothRecordAndTTS = ({
  sendToTTS,
  recordedChunks,
  stopRecording,
  startRecording,
  isRecording,
}) => {
  const [seconds, setSeconds] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null); // Reference to store the media stream

  const playBackBoth = async () => {
    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      const audioURL = URL.createObjectURL(blob);
      const audioElement = new Audio(audioURL);
      audioElement.play();
    }

    setTimeout(() => {
      sendToTTS();
    }, 1000);
  };

  const handleButtonClick = async () => {
    if (!isRecording) {
      setShowCountdown(true);
      const countdownInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      setTimeout(async () => {
        clearInterval(countdownInterval);
        setShowCountdown(false);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream; // Store the media stream
        recorderRef.current = new Recorder(new AudioContext(), { numChannels: 1 });
        recorderRef.current.init(stream);
        recorderRef.current.start();
        startRecording();

        setTimeout(() => {
          sendToTTS();
        }, 1000);
      }, 3000);
    } else {
      stopRecording();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop()); // Stop all tracks of the media stream
      }
    }
  };

  return (
    <div className="response-options">
      <button className={isRecording ? "recording" : "not-recording" } onClick={handleButtonClick}>
        {isRecording
          ? "Stop Recording"
          : "Record alongside TTS!"}
      </button>
      <button className="response-option" onClick={playBackBoth}>
        Playback alongside TTS!
      </button>
      {showCountdown && <Countdown seconds={seconds} setSeconds={setSeconds} />}
    </div>
  );
};

export default BothRecordAndTTS;
