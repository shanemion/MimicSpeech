import { SPEECH_KEY, SPEECH_REGION } from "../apikeys.js";
import SelectedVoice from "../services/language/LanguageString";

const sdk = require("microsoft-cognitiveservices-speech-sdk");

const SpeakText = async (text, selectedLanguage, selectedGender) => {
  const selectedVoice = SelectedVoice(selectedLanguage, selectedGender);

  const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
  speechConfig.speechSynthesisVoiceName = selectedVoice;
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(result.audioData); // Return the audio data (URL or binary data) to the caller
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
