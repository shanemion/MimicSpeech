import React, { useState, useEffect } from "react";
import { BothRecordAndTTS } from "./RecorderAndTTS.js";
import { blobToBase64 } from "../utils/BlobTo64.js";
import { useAuth } from "../services/firebase/FirebaseAuth";
import Recorder from "recorder-js"; // Import Recorder.js
import "../styles.css";

const AudioRecorder = ({ sendToTTS, recordedAudios, setRecordedAudios }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
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
        setAudioURL(URL.createObjectURL(blob));

        // Upload the blob to Firebase Storage
        const storageRef = ref(
          storage,
          "recordedAudios/" + new Date().toISOString() + ".wav"
        );
        await uploadBytes(storageRef, blob);
        recorder.stream.getTracks().forEach(track => track.stop());


        // Get the download URL and store it in local storage
        const audioURL = await getDownloadURL(storageRef);
        setRecordedAudios(prev => [...prev, { id: new Date().toISOString(), url: audioURL }]);
        localStorage.setItem("user_audio_url", audioURL);
      });
      setIsRecording(false);

    }
  };

  const playRecordedAudio = () => {
    if (audioURL) {
      const audioElement = new Audio(audioURL);
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
          className={!audioURL ? "disabled" : "response-option"}
          onClick={playRecordedAudio}
          disabled={!audioURL}
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
