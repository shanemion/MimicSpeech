import React, { useState, useEffect } from "react";
import { BothRecordAndTTS } from "./BothRecordAndTTS.js";

const AudioRecorder = ({ sendToTTS }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const playRecordedAudio = () => {
    if (recordedChunks.length === 0) return;

    const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
    const audioURL = URL.createObjectURL(audioBlob);

    const audioElement = new Audio(audioURL);
    audioElement.play();
  };

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  return (
    <div>
      <div>
        {/* UI for recording and playback */}
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={playRecordedAudio} disabled={!recordedChunks.length}>
          Play Recorded Audio
        </button>
      </div>
      <BothRecordAndTTS
        sendToTTS={sendToTTS}
        recordedChunks={recordedChunks}
        stopRecording={stopRecording}
        startRecording={startRecording}
        isRecording={isRecording}
      />
    </div>
  );
};

export default AudioRecorder;