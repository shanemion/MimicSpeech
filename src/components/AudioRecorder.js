import React, { useState, useEffect } from "react";
import { BothRecordAndTTS } from "./RecorderAndTTS.js";
import { blobToBase64 } from "../utils/BlobTo64.js";
import { useAuth } from "../services/firebase/FirebaseAuth";
import Recorder from "recorder-js"; // Import Recorder.js
import "../styles.css";

const AudioRecorder = ({ sendToTTS, recordedAudios, setRecordedAudios, recordedAudioURL, setRecordedAudioURL, isAnalyzeButtonLoading, setIsAnalyzeButtonLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [tempAudioURL, setTempAudioURL] = useState("");
  const { currentUser } = useAuth();
  const { updateUserWav } = useAuth();
  const { ref, storage, uploadBytes, getDownloadURL } = useAuth();
  const [recorder, setRecorder] = useState(null);

  const startRecording = async () => {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const recorderInstance = new Recorder(audioContext);
      recorderInstance.init(stream);
      recorderInstance.start();

      setIsRecording(true);
      setRecorder(recorderInstance);
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  };

  const stopRecording = async () => {

    if (recorder) {
      recorder.stop().then(async ({ blob }) => {
        setRecordedAudioURL(URL.createObjectURL(blob));
        setTempAudioURL(URL.createObjectURL(blob));
        setIsAnalyzeButtonLoading(true);
        // Upload the blob to Firebase Storage
        const storageRef = ref(
          storage,
          `recordedAudios/${currentUser.uid}/${new Date().toISOString()}.wav`
          );
        await uploadBytes(storageRef, blob);
        recorder.stream.getTracks().forEach(track => track.stop());

          console.log(tempAudioURL)
        // Get the download URL and store it in local storage
        const audioURL = await getDownloadURL(storageRef);
        setIsAnalyzeButtonLoading(false);
        setTempAudioURL(audioURL);
        localStorage.setItem("user_audio_url", audioURL);
      });
      setIsRecording(false);

    }
  };

  const playRecordedAudio = () => {
    if (tempAudioURL) {
      const audioElement = new Audio(tempAudioURL);
      audioElement.play();
    }
  };


  useEffect(() => {
    return () => {
      if (recorder) {
        recorder.stop();
      }
    };
  }, [recorder]);

  return (
    <div>
      <div className="response-options">
        <button
          className={isRecording ? "recording" : "not-recording"}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Record"}
        </button>
        <button
          className={!tempAudioURL ? "disabled" : "response-option"}
          onClick={playRecordedAudio}
          disabled={!tempAudioURL}
        >
          Playback
        </button>
      </div>
      <BothRecordAndTTS
        sendToTTS={sendToTTS}
        stopRecording={stopRecording}
        startRecording={startRecording}
        isRecording={isRecording}
      />
    </div>
  );
};

export default AudioRecorder;