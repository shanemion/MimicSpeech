import React, { useState, useEffect } from "react";
import { BothRecordAndTTS } from "./RecorderAndTTS.js";
import { useAuth } from "../services/firebase/FirebaseAuth";
import Recorder from "recorder-js"; // Import Recorder.js
import "./AudioRecorder.css";

const AudioRecorder = ({
  sendToTTS,
  setRecordedAudioURL,
  setIsAnalyzeButtonLoading,
  setUniqueAudioID,
  selectedPage,
  previousPage,
  selectedSentenceIndex,
  setUniquePracticeAudioID,
  setRecAllowAnalyze,
  setIsAnalyzeButtonDisabled,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [tempAudioURL, setTempAudioURL] = useState("");
  const { currentUser } = useAuth();
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
        const identifier = new Date().toISOString();
        const practiceIdentifier = `${previousPage}_${selectedSentenceIndex}_${new Date().toISOString()}`;
        setIsAnalyzeButtonLoading(true);
        // Upload the blob to Firebase Storage
        let storageRef;
        if (selectedPage === "Practice") {
          // Use a more specific identifier for practice mode
          storageRef = ref(
            storage,
            `recordedPracticeAudios/${currentUser.uid}/${practiceIdentifier}.wav`
          );
          // Update your practice audio state here
        } else {
          // existing functionality
          storageRef = ref(
            storage,
            `recordedAudios/${currentUser.uid}/${identifier}.wav`
          );
        }
        console.log("storageRef", storageRef);
        await uploadBytes(storageRef, blob);
        recorder.stream.getTracks().forEach((track) => track.stop());
        console.log(tempAudioURL);
        // Get the download URL and store it in local storage
        const audioURL = await getDownloadURL(storageRef);
        setUniqueAudioID(identifier)
        setUniquePracticeAudioID(practiceIdentifier)
        setIsAnalyzeButtonLoading(false);
        setTempAudioURL(audioURL);
        localStorage.setItem("user_audio_url", audioURL);
        console.log("audioURL", audioURL);
        console.log(localStorage.getItem("user_audio_url"))
      });
      setIsRecording(false);
      setIsAnalyzeButtonDisabled(false);
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
      <div className="audio-recorder-button-container">
        <button
          className={isRecording ? "recording-button" : "not-recording-button"}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button
          className={tempAudioURL ? "playback-button" : "disabled-button"}
          onClick={tempAudioURL ? playRecordedAudio : () => alert('Make sure to record your voice first!')}
        >
          Playback
        </button>
      </div>
      <BothRecordAndTTS
        sendToTTS={sendToTTS}
        stopRecording={stopRecording}
        startRecording={startRecording}
        isRecording={isRecording}
        tempAudioURL={tempAudioURL}
      />
    </div>
  );
};

export default AudioRecorder;
