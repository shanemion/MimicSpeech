import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import ResponseRenderer from "../ResponseRenderer";
import { ResponseCleaner } from "../../utils/ResponseCleaner";
import AudioRecorder from "../AudioRecorder";
import { OPENAI_KEY } from "../../apikeys";
import LanguageContext from "../../services/language/LanguageContext";
import Bookmark from "../Bookmark";
import SpeedSlider from "../SpeedSlider";
import { blobToBase64 } from "../../utils/BlobTo64";
import { useSavedAudio } from "../../services/saved/SavedAudioContext";
import "../../styles.css";

import SpeakText from "../../utils/SpeakTTS";

const ChineseResponseGenerator = ({ typeResponse, setTypeResponse }) => {
  const { saveAudio } = useSavedAudio();

  const { selectedLanguage, selectedGender } = useContext(LanguageContext);
  const [userPrompt, setUserPrompt] = useState(
    localStorage.getItem("userPrompt") || "A reporter giving daily news."
  );
  const [responseLength, setResponseLength] = useState(
    parseInt(localStorage.getItem("numSentences"), 10) || 3
  );
  
  const [generatedResponse, setGeneratedResponse] = useState(
    localStorage.getItem("generatedResponse") || ""
  );
  const [selectedPage, setSelectedPage] = useState(
    localStorage.getItem("selectedPage") || "One"
  );
  const [audioURL, setAudioURL] = useState(
    localStorage.getItem("audioURL") || null
  );
  const [mainString, setMainString] = useState(
    localStorage.getItem("mainString") || ""
  );
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(
    localStorage.getItem("isPlayButtonDisabled") === "true"
  );
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(
    localStorage.getItem("isGenerateDisabled") === "true"
  );
  const [typedResponse, setTypedResponse] = useState(
    localStorage.getItem("typedResponse") || ""
  );
  const [isMounted, setIsMounted] = useState(false);

  const [speed, setSpeed] = useState(2); // default speed at medium

  const rates = ['x-slow', 'slow', 'medium', 'fast', 'x-fast'];

  const { updateTTSwav} = useAuth();

  const { currentUser } = useAuth();
  

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePromptChange = (event) => {
    const newValue = event.target.value;
    setUserPrompt(newValue);
    localStorage.setItem("userPrompt", newValue);
  };

  const handleResponseLengthChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setResponseLength(newValue);
    localStorage.setItem("numSentences", newValue.toString());
  };
  

  const handleGenerateResponse = async () => {
    localStorage.removeItem("TTS_audio"); // Correct key
    localStorage.removeItem("USER_wavs"); // Correct key
    const prompt = `
    Return a real-world, individual dialogue in simplified Mandarin Chinese, pinyin, and english on ${userPrompt}. 
    In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons. 
    The completion should have the following structure: ${responseLength} sentences in Chinese, then ${responseLength} sentences Pinyin, then ${responseLength} in English.`

    console.log(prompt);

    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
      apiKey: OPENAI_KEY,
    });

    const openai = new OpenAIApi(configuration);
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 4000,
        temperature: 0.2,
        top_p: 0.1,
      });

      const responseText = response.data.choices[0].text;
      setGeneratedResponse(responseText);
      localStorage.setItem("generatedResponse", responseText);
      console.log("Response from API:", response.data.choices[0].text);

      setIsPlayButtonDisabled(false);
    } catch (error) {
      console.error("Error generating response:", error);
      if (error.response && error.response.body) {
        console.log("Error Response from API:", error.response.body);
        setGeneratedResponse(
          "Error generating response. Try a shorter prompt!"
        );
      }
    }
  };

  const handleTTS = async (textToRead, selectedLanguage, selectedGender, rate) => {
    try {
      const audioUrlFromTTS = await SpeakText(
        textToRead,
        selectedLanguage,
        selectedGender,
        rates[speed]
      );
      let base64 = localStorage.getItem("TTS_audio");
  
      base64 = encodeURIComponent(base64); // Encode the base64 string
      const responseId = localStorage.getItem("responseId");
      if (responseId !== null) {
        updateTTSwav(currentUser.uid, responseId, base64); // Update Firestore
      } else {
        // Save to local storage only
        localStorage.setItem("TTS_audio", base64);
      }
      setAudioURL(audioUrlFromTTS);
      localStorage.setItem("audioURL", audioUrlFromTTS);
      console.log("TTS Audio URL:", audioUrlFromTTS);
    } catch (error) {
      console.error("Error generating TTS:", error);
    }
  };
  

  async function sendToTTS() {
    let textToRead = "";
    if (!typeResponse) {
      textToRead = mainString;
    } else {
      textToRead = typedResponse;
    }
  
    console.log("textToRead:", textToRead);
    await handleTTS(textToRead, selectedLanguage, selectedGender, rates[speed]);
  }

  useEffect(() => {
    const sentences = ResponseCleaner(generatedResponse, responseLength);
    const mainLanguage = sentences[0];
    const newReadString = mainLanguage.join(" ");
    setMainString(newReadString);
    localStorage.setItem("mainString", newReadString);
    setAudioURL(null); // Reset the audio URL when the TTS text changes
    localStorage.setItem("audioURL", null);
  }, [generatedResponse, responseLength]);

  const sentences = ResponseCleaner(generatedResponse, responseLength);

  return (
    <div>
      <div>
        {!typeResponse && (
          <div className="center">
          <div className="inputs">
            <div className="prompt-input">
              <label htmlFor="prompt">Enter Your Prompt:</label>
              <input
                type="text"
                id="prompt"
                value={userPrompt}
                onChange={handlePromptChange}
              />
            </div>
            <div className="response-length-input">
              <label htmlFor="respone-length">
                # Sentences:
              </label>
              <input
                type="number"
                id="responseLength"
                value={responseLength}
                onChange={handleResponseLengthChange}
              />
            </div>
          </div>
          </div>
        )}
        <div className="center">
          <div className="button-container">
            {!typeResponse && (
              <button
                className="generate"
                onClick={handleGenerateResponse}
                disabled={isGenerateDisabled}
              >
                Generate Response
              </button>
            )}
            {generatedResponse && !typeResponse && (
              <Bookmark
                typeResponse={typeResponse}
                typedResponse={typedResponse}
                generatedResponse={generatedResponse}
                language="Chinese"
              />
            )}
          </div>
        </div>
        <SpeedSlider speed={speed} setSpeed={setSpeed} />
      </div>
      {generatedResponse && !typeResponse && (
        <div>
          <div className="response-options">
            <button
              className={
                selectedPage === "One"
                  ? "response-option-selected"
                  : "response-option"
              }
              onClick={() => {
                setSelectedPage("One");
                localStorage.setItem("selectedPage", "One");
              }}
            >
              Chinese, Pinyin, and English
            </button>
            <button
              className={
                selectedPage === "Two"
                  ? "response-option-selected"
                  : "response-option"
              }
              onClick={() => {
                setSelectedPage("Two");
                localStorage.setItem("selectedPage", "Two");
              }}
            >
              Chinese and Pinyin
            </button>
            <button
              className={
                selectedPage === "Three"
                  ? "response-option-selected"
                  : "response-option"
              }
              onClick={() => {
                setSelectedPage("Three");
                localStorage.setItem("selectedPage", "Three");
              }}
            >
              Chinese
            </button>
          </div>
          <ResponseRenderer
            sentences={sentences}
            selectedPage={selectedPage}
            newResponse={generatedResponse}
          />
          <div className="center">
            <button
              className="response-option"
              onClick={sendToTTS}
              disabled={isPlayButtonDisabled}
            >
              Play Text to Speech
            </button>
          </div>
          <AudioRecorder sendToTTS={sendToTTS} />
        </div>
      )}
      {typeResponse && (
        <div>
          <div>
            <textarea
              placeholder="Type your response in chosen language here..."
              value={typedResponse}
              onChange={(event) => {
                const newText = event.target.value;
                setTypedResponse(newText);
                localStorage.setItem("typedResponse", newText);
                setIsPlayButtonDisabled(newText.trim() === "");
                localStorage.setItem(
                  "isPlayButtonDisabled",
                  (newText.trim() === "").toString()
                );
              }}
            />
            <Bookmark
              typeResponse={typeResponse}
              typedResponse={typedResponse}
              generatedResponse={typedResponse}
              language="Chinese"
            />
          </div>
          <div className="center">
            <button
              className="response-option"
              onClick={sendToTTS}
              disabled={isPlayButtonDisabled}
            >
              Play Text to Speech
            </button>
          </div>
          <AudioRecorder sendToTTS={sendToTTS} />
        </div>
      )}
    </div>
  );
};

export default ChineseResponseGenerator;
