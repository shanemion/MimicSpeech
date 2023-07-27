import React, { useEffect, useState, useContext } from "react";
import ResponseRenderer from "../ResponseRenderer";
import { ResponseCleaner } from "../../utils/ResponseCleaner";
import AudioRecorder from "../AudioRecorder";
import { OPENAI_KEY } from "../../apikeys";
import LanguageContext from "../../services/language/LanguageContext";

import SpeakText from "../../utils/SpeakTTS";

const EnglishResponseGenerator = () => {
  const { selectedLanguage, selectedGender } = useContext(LanguageContext);

  const [userPrompt, setUserPrompt] = useState("A reporter giving daily news.");
  const [responseLength, setResponseLength] = useState(3); // Default response length in sentences
  const [generatedResponse, setGeneratedResponse] = useState(""); // State variable for the generated response
  const [selectedPage, setSelectedPage] = useState(
    "One"
  );
  const [audioURL, setAudioURL] = useState(null); // State variable to store the TTS audio URL
  const [mainString, setMainString] = useState("");
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(true);

  const handlePromptChange = (event) => {
    setUserPrompt(event.target.value);
  };

  const handleResponseLengthChange = (event) => {
    setResponseLength(parseInt(event.target.value, 10));
  };

  const handleGenerateResponse = async () => {
    const prompt = `
        You will receive a topic in English and will return a text output in english on the topic. 
        In your response, make the sentences humanlike, use common grammar patterns and sentence structure in English, and proper punctuation. 
        Use sentences that would be said by a native speaker.
        The completion should be ${responseLength} sentences.
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
    const textToRead = mainString;
    console.log("mainString", textToRead);
    try {
      console.log("selectedLanguage", selectedLanguage);
      const audioURL = await SpeakText(textToRead, selectedLanguage, selectedGender);
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
        <label>
          Enter Your Prompt:
          <input type="text" value={userPrompt} onChange={handlePromptChange} />
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
      <button onClick={handleGenerateResponse}>Generate Response</button>
      <div>
        <button onClick={() => setSelectedPage("One")}>English</button>
      </div>
      <ResponseRenderer sentences={sentences} selectedPage={selectedPage} />
      <AudioRecorder sendToTTS={sendToTTS} />
      <button onClick={sendToTTS} disabled={isPlayButtonDisabled}>
        Play Most Recent TTS
      </button>
    </div>
  );
};

export default EnglishResponseGenerator;
