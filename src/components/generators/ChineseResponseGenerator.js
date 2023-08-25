import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import ResponseRenderer from "../ResponseRenderer";
import { ResponseCleaner } from "../../utils/ResponseCleaner";
import AudioRecorder from "../AudioRecorder";
import LanguageContext from "../../services/language/LanguageContext";
import Bookmark from "../Bookmark";
import SentencesHeader from "../SentencesHeader";
import AnalyzeButton from "../AnalyzeButton";
import { TTSsettings } from "../TTSsettings";
import PitchChart from "../PitchChart";
import { RecordedAudios } from "../RecordedAudios";
import SpeakText from "../../utils/SpeakTTS";
import LoaderIcon from "react-loader-icon";
import "../../styles.css";

const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;

const ChineseResponseGenerator = ({ typeResponse, setTypeResponse }) => {
  const { ref, storage, deleteObject } = useAuth();
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
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [mainString, setMainString] = useState(
    localStorage.getItem("mainString") || ""
  );
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(
    localStorage.getItem("isPlayButtonDisabled") === "true"
  );
  const [typedResponse, setTypedResponse] = useState(
    localStorage.getItem("typedResponse") || ""
  );
  const [isMounted, setIsMounted] = useState(false);
  const [recordedAudios, setRecordedAudios] = useState([]);
  const [speed, setSpeed] = useState(2); // default speed at medium
  const rates = ["x-slow", "slow", "medium", "fast", "x-fast"];
  const [synthesizedPitchData, setSynthesizedPitchData] = useState([]);
  const [recordedPitchData, setRecordedPitchData] = useState([]);
  const { updateTTSwav } = useAuth();
  const { currentUser } = useAuth();
  const [isAnalyzeButtonLoading, setIsAnalyzeButtonLoading] = useState(false);
  const [isRecordingListLoading, setIsRecordingListLoading] = useState(false);
  const [isGPTLoading, setIsGPTLoading] = useState(false);
  const [uniqueAudioID, setUniqueAudioID] = useState("");

  const [practiceData, setPracticeData] = useState({});
  const [synthesizedPracticePitchData, setSynthesizedPracticePitchData] =
    useState([]);
  const [recordedPracticeAudios, setRecordedPracticeAudios] = useState([]);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [uniquePracticeAudioID, setUniquePracticeAudioID] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePromptChange = (event) => {
    const newValue = event.target.value;
    setUserPrompt(newValue);
    localStorage.setItem("userPrompt", newValue);
  };

  const handleResponseLengthChange = (event) => {
    let newValue = parseInt(event.target.value, 10);
    if (newValue > 6) {
      newValue = 6;
    }
    if (newValue < 1) {
      newValue = 1;
    }
    setResponseLength(newValue);
    localStorage.setItem("numSentences", newValue.toString());
  };

  const handleGenerateResponse = async () => {
    // localStorage.removeItem("TTS_audio"); // Correct key
    localStorage.removeItem("USER_wavs"); // Correct key
    setIsGPTLoading(true);
    const prompt = `
    Return a real-world event in simplified Mandarin Chinese, pinyin, and english on ${userPrompt}.
    In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
    The completion should have the following structure: ${responseLength} sentences in Chinese, then ${responseLength} sentences Pinyin, then ${responseLength} in English.`;

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
        max_tokens: 820,
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
    setIsGPTLoading(false);

    const deletePromises = recordedAudios.map(async (audio) => {
      console.log("Deleting audio:", audio.id);
      const audioRef = ref(
        storage,
        `recordedAudios/${currentUser.uid}/${audio.id}.wav`
      );
      console.log(
        "Attempting to delete:",
        `recordedAudios/${currentUser.uid}/${audio.id}.wav`
      );
      try {
        await deleteObject(audioRef);
        console.log(
          "Successfully deleted:",
          `recordedAudios/${currentUser.uid}/${audio.id}.wav`
        );
      } catch (error) {
        console.error("Error deleting object: ", error);
      }
    });

    Promise.all(deletePromises)
      .then(() => {
        console.log("All delete operations completed.");
      })
      .catch((error) => {
        console.error("Some delete operations failed:", error);
      });
    setSynthesizedPitchData([]);
    setRecordedAudios([]);
    setPracticeData({});
    setSynthesizedPracticePitchData([]);
    setRecordedPracticeAudios([]);
  };

  const handleTTS = async (
    textToRead,
    selectedLanguage,
    selectedGender,
    rate
  ) => {
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

  const playAudio = (url) => {
    const audioElement = new Audio(url);
    audioElement.play();
  };

  const deleteAudio = (audioId) => {
    // Delete the audio from recordedAudios
    setRecordedAudios((prev) => prev.filter((audio) => audio.id !== audioId));

    // Delete the corresponding pitch data from recordedPitchData
    setRecordedPitchData((prevData) =>
      prevData.filter((item) => item.id !== audioId)
    );
    setPracticeData((prevData) => {
      const updatedData = { ...prevData };
      for (const key in updatedData) {
        updatedData[key].recordedPracticeAudios = updatedData[key].recordedPracticeAudios.filter(
          (audio) => audio.id !== audioId
        );
      }
      return updatedData;
    });  
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
    let mainLanguage = sentences[0];
    let newReadString = "";
    if (selectedPage === "Practice") {
      mainLanguage = mainLanguage[selectedSentenceIndex];
      newReadString = mainLanguage
    } else {
     newReadString = mainLanguage.join(" ");
    }
    setMainString(newReadString);
    localStorage.setItem("mainString", newReadString);
    setAudioURL(null); // Reset the audio URL when the TTS text changes
    localStorage.setItem("audioURL", null);
  }, [generatedResponse, responseLength, selectedSentenceIndex, selectedPage]);

  // useEffect(() => {
  //   const sentences = ResponseCleaner(generatedResponse, responseLength);
  //   const mainLanguage = sentences[0];
  //   const newReadString = mainLanguage.join(" ");
  //   setMainString(newReadString);
  //   localStorage.setItem("mainString", newReadString);
  //   setAudioURL(null); // Reset the audio URL when the TTS text changes
  //   localStorage.setItem("audioURL", null);
  // }, [generatedResponse, responseLength]);

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
                <label htmlFor="respone-length"># Sentences:</label>
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
                className={isGPTLoading ? "generate-disabled" : "generate"}
                onClick={handleGenerateResponse}
                disabled={isGPTLoading}
              >
                {isGPTLoading ? "Response Generating..." : "Generate Response"}
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
      </div>
      {generatedResponse && !typeResponse && (
        <div>
          <div className="outlined-container">
            <SentencesHeader
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <div className="outlined-subcontainer">
              {isGPTLoading && (
                <LoaderIcon
                  type={"spin"}
                  style={{ marginTop: 20, marginBottom: 20 }}
                />
              )}
              {!isGPTLoading && (
                <ResponseRenderer
                  sentences={sentences}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  generatedResponse={generatedResponse}
                  selectedSentenceIndex={selectedSentenceIndex}
                  setSelectedSentenceIndex={setSelectedSentenceIndex}
                  previousPage={previousPage}
                  setPreviousPage={setPreviousPage}
                />
              )}
            </div>
            <TTSsettings
              sendToTTS={sendToTTS}
              isPlayButtonDisabled={isPlayButtonDisabled}
              speed={speed}
              setSpeed={setSpeed}
            />
          </div>
          <AudioRecorder
            sendToTTS={sendToTTS}
            setRecordedAudioURL={setRecordedAudioURL}
            setIsAnalyzeButtonLoading={setIsAnalyzeButtonLoading}
            setUniqueAudioID={setUniqueAudioID}
            selectedPage={selectedPage}
            previousPage={previousPage}
            selectedSentenceIndex={selectedSentenceIndex}
            setUniquePracticeAudioID={setUniquePracticeAudioID}
          />
          <div>
            <AnalyzeButton
              practiceData={practiceData}
              setPracticeData={setPracticeData}
              setSynthesizedPitchData={setSynthesizedPitchData}
              setRecordedPitchData={setRecordedPitchData}
              generatedResponse={generatedResponse}
              recordedAudioURL={recordedAudioURL}
              setRecordedAudios={setRecordedAudios}
              isAnalyzeButtonLoading={isAnalyzeButtonLoading}
              setIsAnalyzeButtonLoading={setIsAnalyzeButtonLoading}
              setIsRecordingListLoading={setIsRecordingListLoading}
              uniqueAudioID={uniqueAudioID}
              selectedPage={selectedPage}
              selectedSentenceIndex={selectedSentenceIndex}
              uniquePracticeAudioID={uniquePracticeAudioID}
            />
            <div className="chart-and-list">
              <div className="recording-and-graph">
                <PitchChart
                practiceData={practiceData}
                  synthesizedPitchData={synthesizedPitchData}
                  recordedPitchData={recordedPitchData}
                  recordedAudios={recordedAudios}
                  synthesizedPracticePitchData={synthesizedPracticePitchData}
                  recordedPracticePitchData={recordedPitchData}
                  recordedPracticeAudios={recordedPracticeAudios}
                  generatedResponse={generatedResponse}
                  isRecordingListLoading={isRecordingListLoading}
                  selectedPage={selectedPage}
                  selectedSentenceIndex={selectedSentenceIndex}
                />
                <div className="recordings-list">
                  <RecordedAudios
                    practiceData={practiceData}
                    recordedAudios={recordedAudios}
                    recordedPracticeAudios={recordedPracticeAudios}
                    playAudio={playAudio}
                    deleteAudio={deleteAudio}
                    synthesizedPitchData={synthesizedPitchData}
                    recordedPitchData={recordedPitchData}
                    setRecordedPitchData={setRecordedPitchData}
                    isRecordingListLoading={isRecordingListLoading}
                    selectedPage={selectedPage}
                    selectedSentenceIndex={selectedSentenceIndex}
                  />
                </div>
              </div>
            </div>
          </div>
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
            {/* <Bookmark
              typeResponse={typeResponse}
              typedResponse={typedResponse}
              generatedResponse={typedResponse}
              language="Chinese"
            /> */}
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
