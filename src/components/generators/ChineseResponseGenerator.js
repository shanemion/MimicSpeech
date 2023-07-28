import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import ResponseRenderer from "../ResponseRenderer";
import { ResponseCleaner } from "../../utils/ResponseCleaner";
import AudioRecorder from "../AudioRecorder";
import { OPENAI_KEY } from "../../apikeys";
import LanguageContext from "../../services/language/LanguageContext";

import SpeakText from "../../utils/SpeakTTS";

const ChineseResponseGenerator = () => {
  const { currentUser, saveResponse } = useAuth(); // Use the saveResponse function from AuthContext
  const { selectedLanguage, selectedGender } = useContext(LanguageContext);
  const [userPrompt, setUserPrompt] = useState("A reporter giving daily news.");
  const [responseLength, setResponseLength] = useState(3); // Default response length in sentences
  const [generatedResponse, setGeneratedResponse] = useState(""); // State variable for the generated response
  const [selectedPage, setSelectedPage] = useState("Three");
  const [audioURL, setAudioURL] = useState(null); // State variable to store the TTS audio URL
  const [mainString, setMainString] = useState("");
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(true);
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(false);
  const [typeResponse, setTypeResponse] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");
  const [isMounted, setIsMounted] = useState(false);

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
    const prompt = `
        You will receive a topic in English and will return a translated text output in simplified Mandarin Chinese, pinyin, and english on the topic. 
        In your response, make the sentences humanlike, use common grammar patterns and sentence structure in Chinese, and proper punctuation. 
        The completion should be ${responseLength} sentences for each mode of output (Chinese, Pinyin, and English).
        Here is the prompt: ${userPrompt}`;

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
        <div>
          <label>
            Enter Your Prompt:
            <input
              type="text"
              value={userPrompt}
              onChange={handlePromptChange}
            />
          </label>
        </div>
        <div>
          <label>
            Response Length (in Sentences):
            <input
              type="number"
              value={responseLength}
              onChange={handleResponseLengthChange}
            />
          </label>
        </div>
        {!generatedResponse && (
          <button
            onClick={() => {
              handleGenerateResponse();
              setTypeResponse(true);
            }}
            disabled={isGenerateDisabled}
          >
            Generate Response
          </button>
        )}
        <button
          onClick={() => {
            setTypeResponse(!typeResponse);
            setIsGenerateDisabled(!isGenerateDisabled);
          }}
        >
          {typeResponse ? "Back to Generated Response" : "Type Custom Response"}
        </button>
      </div>
      {generatedResponse && !typeResponse && (
        <div>
          <div>
            <button onClick={() => setSelectedPage("One")}>Chinese</button>
            <button onClick={() => setSelectedPage("Two")}>
              Chinese and Pinyin
            </button>
            <button onClick={() => setSelectedPage("Three")}>
              Chinese, Pinyin, and English
            </button>
          </div>
          <ResponseRenderer sentences={sentences} selectedPage={selectedPage} />
          <AudioRecorder sendToTTS={sendToTTS} />
          <button onClick={sendToTTS} disabled={isPlayButtonDisabled}>
            Play Most Recent TTS
          </button>
        </div>
      )}
      {typeResponse && (
        <div>
          <div>
            <textarea
              value={typedResponse}
              onChange={(event) => {
                const newText = event.target.value;
                setTypedResponse(newText);
                setIsPlayButtonDisabled(newText.trim() === "");
              }}
            />
            <AudioRecorder sendToTTS={sendToTTS} />
            <button onClick={sendToTTS} disabled={isPlayButtonDisabled}>
              Play Most Recent TTS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChineseResponseGenerator;
