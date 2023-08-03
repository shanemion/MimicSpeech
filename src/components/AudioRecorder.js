import React, { useState, useEffect } from "react";
import { BothRecordAndTTS } from "./RecorderAndTTS.js";
import { blobToBase64 } from "../utils/BlobTo64.js";
import { useAuth } from "../services/firebase/FirebaseAuth";
import "../styles.css";

const AudioRecorder = ({ sendToTTS }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const { currentUser } = useAuth();
  const { updateUserWav } = useAuth();

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
        console.log('Data available:', e.data); // Log the data
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

  const stopRecording = async () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  
    const audioBlob = new Blob(recordedChunks, { type: "audio/wav" })
    console.log('Audio Blob:', audioBlob); // Log the blob to check if it's valid
    ;
    let base64Audio = await blobToBase64(audioBlob);
    console.log('Base64 Audio:', base64Audio); // Log the base64 string to check if it's correct

    // No need to URL encode the base64 string
    // base64Audio = encodeURIComponent(base64Audio);
  
    const userWavs = JSON.parse(localStorage.getItem("USER_wavs") || "[]");
    const newRecording = base64Audio; // The new recording
    userWavs.push(newRecording);
    localStorage.setItem("USER_wavs", JSON.stringify(userWavs));
  
    // Keep the recorded chunks for playback
    // setRecordedChunks([]);
    setAudioURL(URL.createObjectURL(audioBlob));
    setIsRecording(false);
  
    const responseId = localStorage.getItem("responseId");
    if (responseId) {
      updateUserWav(currentUser.uid, responseId, newRecording); // Pass only the new recording
    } else {
      localStorage.setItem("user_audio", base64Audio);
    }
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
      <div className="response-options">
        {/* UI for recording and playback */}
        <button
          className={isRecording ? "recording" : "not-recording"}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button
          className={!recordedChunks.length ? "disabled" : "response-option"}
          onClick={playRecordedAudio}
          disabled={!recordedChunks.length}
        >
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
