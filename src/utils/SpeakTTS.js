import { SPEECH_KEY, SPEECH_REGION } from "../apikeys.js";
import SelectedVoice from "../services/language/LanguageString";
import { blobToBase64 } from "./BlobTo64";


const sdk = require("microsoft-cognitiveservices-speech-sdk");

const SpeakText = async (text, selectedLanguage, selectedGender, rate, userId, updateTTSwav) => {
  const responseId = localStorage.getItem("responseId");

  const selectedVoice = SelectedVoice(selectedLanguage, selectedGender);

  const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
  speechConfig.speechSynthesisVoiceName = selectedVoice;
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  let processedText = text;

  // Wrap text with SSML tags and adjust the rate
  const ssmlText = `<speak version='1.0' xml:lang='en-US'><voice name='${selectedVoice}'><prosody rate='${rate}'>${processedText}</prosody></voice></speak>`;

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssmlText,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const blob = new Blob([result.audioData], { type: 'audio/wav' }); // Assuming the audio data is in WAV format
          blobToBase64(blob).then(base64 => {
            localStorage.setItem("TTS_audio", base64);
          });
          resolve(blob);
        } else {
          reject(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
        }
      },
      (err) => {
        reject("err - " + err);
      }
    );
  });
};

export default SpeakText;
