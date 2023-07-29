import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import ResponseRenderer from "../ResponseRenderer";
import { ResponseCleaner } from "../../utils/ResponseCleaner";
import AudioRecorder from "../AudioRecorder";
import { OPENAI_KEY } from "../../apikeys";
import LanguageContext from "../../services/language/LanguageContext";
import "../../styles.css";

import SpeakText from "../../utils/SpeakTTS";

const ChineseResponseGenerator = ({ typeResponse, setTypeResponse }) => {
  const { currentUser, saveResponse } = useAuth(); // Use the saveResponse function from AuthContext
  const { selectedLanguage, selectedGender } = useContext(LanguageContext);
  const [userPrompt, setUserPrompt] = useState("A reporter giving daily news.");
  const [responseLength, setResponseLength] = useState(3); // Default response length in sentences
  const [generatedResponse, setGeneratedResponse] = useState(""); // State variable for the generated response
  const [selectedPage, setSelectedPage] = useState("One");
  const [audioURL, setAudioURL] = useState(null); // State variable to store the TTS audio URL
  const [mainString, setMainString] = useState("");
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(true);
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [buttonSelected, setButtonSelected] = useState("One");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePromptChange = (event) => {
    setUserPrompt(event.target.value);
  };

  const handleResponseLengthChange = (event) => {
    setResponseLength(parseInt(event.target.value, 10));
  };

  const handleGenerateResponse = async () => {
const prompt = `Construct a typical scene based on "${userPrompt}". The response should contain ${responseLength} sentences each of Mandarin Chinese, Pinyin, and English, for a total of ${responseLength*3} sentences. The scene should be experiential and the language humanlike, adhering to common Chinese grammar and proper punctuation.`;


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
        temperature: 0,
      });

      // Update the state with the generated response
      setGeneratedResponse(response.data.choices[0].text);
      console.log("Response from API:", response.data.choices[0].text);
      saveResponse(
        currentUser.uid,
        { text: response.data.choices[0].text, audioUrl: "fake.test/url" },
        "Chinese"
      );
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

  async function sendToTTS() {
    let textToRead = "";
    if (!typeResponse) {
      textToRead = mainString;
    } else {
      textToRead = typedResponse;
    }

    console.log("textToRead:", textToRead);
    try {
      console.log("selectedLanguage", selectedLanguage);
      const audioURL = await SpeakText(
        textToRead,
        selectedLanguage,
        selectedGender
      );
      console.log("TTS Audio URL:", audioURL);
    } catch (error) {
      console.error("Error generating TTS:", error);
    }
  }

  useEffect(() => {
    const sentences = ResponseCleaner(generatedResponse, responseLength);
    const mainLanguage = sentences[0];
    const newReadString = mainLanguage.join(" ");
    setMainString(newReadString);
    setAudioURL(null); // Reset the audio URL when the TTS text changes
  }, [generatedResponse, responseLength]);

  const sentences = ResponseCleaner(generatedResponse, responseLength);

  return (
    <div>
      <div>
        {!typeResponse && (
          <div>
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
              <label htmlFor="responseLength">
                Response Length (in Sentences):
              </label>
              <input
                type="number"
                id="responseLength"
                value={responseLength}
                onChange={handleResponseLengthChange}
              />
            </div>
          </div>
        )}
        <div className="center">
          {!typeResponse && (
            <button
              className="generate"
              onClick={() => {
                handleGenerateResponse();
              }}
              disabled={isGenerateDisabled}
            >
              Generate Response
            </button>
          )}
        </div>
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
              onClick={() => setSelectedPage("One")}
            >
              Chinese, Pinyin, and English
            </button>
            <button
              className={
                selectedPage === "Two"
                  ? "response-option-selected"
                  : "response-option"
              }
              onClick={() => setSelectedPage("Two")}
            >
              Chinese and Pinyin
            </button>
            <button
              className={
                selectedPage === "Three"
                  ? "response-option-selected"
                  : "response-option"
              }
              onClick={() => setSelectedPage("Three")}
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
                setIsPlayButtonDisabled(newText.trim() === "");
              }}
            />
            <div className="center">
              <button
                className="bottom-options"
                onClick={sendToTTS}
                disabled={isPlayButtonDisabled}
              >
                Play Text to Speech
              </button>
            </div>
            <AudioRecorder sendToTTS={sendToTTS} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChineseResponseGenerator;
