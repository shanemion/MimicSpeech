import SelectedVoice from "../services/language/LanguageString";
import { blobToBase64 } from "./BlobTo64";

const SPEECH_KEY = process.env.REACT_APP_SPEECH_KEY;
const SPEECH_REGION = process.env.REACT_APP_SPEECH_REGION;

const sdk = require("microsoft-cognitiveservices-speech-sdk");

const SpeakText = async (text, selectedLanguage, selectedGender, rate, identifier) => {
  const selectedVoice = SelectedVoice(selectedLanguage, selectedGender);
  const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
  speechConfig.speechSynthesisVoiceName = selectedVoice;
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const ssmlText = `<speak version='1.0' xml:lang='en-US'><voice name='${selectedVoice}'><prosody rate='${rate}'>${text}</prosody></voice></speak>`;
  
  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssmlText,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const blob = new Blob([result.audioData], { type: 'audio/wav' });
          blobToBase64(blob).then(base64 => {
            let audioData = JSON.parse(localStorage.getItem("TTS_audio_data")) || {};
            audioData[identifier] = base64;
            localStorage.setItem("TTS_audio_data", JSON.stringify(audioData));
          });
          resolve(blob);
        } else {
          reject("Speech synthesis canceled: " + result.errorDetails);
        }
      },
      (err) => {
        reject("Error: " + err);
      }
    );
  });
};


export default SpeakText;
