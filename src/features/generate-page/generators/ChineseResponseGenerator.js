import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../../services/firebase/FirebaseAuth";
import ResponseRenderer from "../../../components/ResponseRenderer";
import { ResponseCleaner } from "../../../utils/ResponseCleaner";
import AudioRecorder from "../../../components/AudioRecorder";
import LanguageContext from "../../../services/language/LanguageContext";
import Bookmark from "../../../components/Bookmark";
import SentencesHeader from "../../../components/SentencesHeader";
import AnalyzeButton from "../../../components/AnalyzeButton";
import { TTSsettings } from "../../../components/TTSsettings";
import PitchChart from "../../../components/PitchChart";
import { RecordedAudios } from "../../../components/RecordedAudios";
import SpeakText from "../../../utils/SpeakTTS";
import LoaderIcon from "react-loader-icon";
import GenerateHeader from "../header/GenerateHeader";
import useWindowSize from "../../../utils/WindowSize";
import { Selectors } from "../../../components/Selectors";
import "../../../../src/styles.css";
import { useTypedResponse } from "../../../services/type-response/TypedResponseContext";
import OpenAI from "openai";
import PricingModal from "../../dashboard/pricing/PricingModal";
import PricingContext from "../../../services/pricing/PricingContext";

const ChineseResponseGenerator = ({ typeResponse, setTypeResponse }) => {
  // Utils
  const { width } = useWindowSize();
  const { ref, storage, deleteObject } = useAuth();
  const {
    currentUser,
    fetchCredits,
    fetchFirstName,
    fetchLastName,
    deleteCredits,
  } = useAuth();
  const { updateTTSwav } = useAuth();

  // Contexts
  const { selectedLanguage, selectedGender } = useContext(LanguageContext);
  const [typedResponse, setTypedResponse] = useTypedResponse();
  const { pricingState, setPricingState } = useContext(PricingContext);

  // State for database and user info
  const [credits, setCredits] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // State for the response generator
  const [userPrompt, setUserPrompt] = useState(
    localStorage.getItem("userPrompt") || ""
  );
  const [responseLength, setResponseLength] = useState(
    parseInt(localStorage.getItem("numSentences"), 10) || 3
  );
  const [renderedSentencesCount, setRenderedSentencesCount] =
    useState(responseLength);
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
  const [isMounted, setIsMounted] = useState(false);
  const [recordedAudios, setRecordedAudios] = useState([]);
  const [speed, setSpeed] = useState(2); // default speed at medium
  const rates = ["x-slow", "slow", "medium", "fast", "x-fast"];
  const [synthesizedPitchData, setSynthesizedPitchData] = useState([]);
  const [recordedPitchData, setRecordedPitchData] = useState([]);
  const [isAnalyzeButtonLoading, setIsAnalyzeButtonLoading] = useState(false);
  const [isRecordingListLoading, setIsRecordingListLoading] = useState(false);
  const [isGPTLoading, setIsGPTLoading] = useState(false);


  // State for audio recorder / analysis
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

  const closePricingModal = () => {
    setPricingState(false);
  };

  useEffect(() => {
    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();

    const fetchUserFirstName = async () => {
      const userFirstName = await fetchFirstName(currentUser.uid);
      setFirstName(userFirstName);
    };

    fetchUserFirstName();

    const fetchUserLastName = async () => {
      const userLastName = await fetchLastName(currentUser.uid);
      setLastName(userLastName);
    };

    fetchUserLastName();
  }, [currentUser, fetchCredits, fetchFirstName, fetchLastName]);

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

  const handleRenderedSentencesCountChange = (event) => {
    let newValue = parseInt(event.target.value, 10);
    if (newValue > responseLength) {
      newValue = responseLength;
    }
    if (newValue < 1) {
      newValue = 1;
    }
    setRenderedSentencesCount(newValue);
  };

  const handleGenerateResponse = async () => {
    // localStorage.removeItem("TTS_audio"); // Correct key
    localStorage.removeItem("USER_wavs"); // Correct key
    setIsGPTLoading(true);
    // const prompt = `
    // Return a real-world event in simplified Mandarin Chinese, pinyin, and english on ${userPrompt}.
    // In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
    // The completion should have the following structure: ${responseLength} sentences in Chinese, then ${responseLength} sentences Pinyin, then ${responseLength} in English.`;
    const prompt = `
    Return a real-world event in simplified Mandarin Chinese, pinyin, and english on ${userPrompt}.
    In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
    The completion should be ${
      responseLength * 3
    } sentences long: ${responseLength} sentences in Chinese, then ${responseLength} sentences Pinyin, then ${responseLength} in English.`;

    console.log(prompt);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_KEY,
      dangerouslyAllowBrowser: true,
    });
    try {
      if (credits >= responseLength) {
        // const response = await openai.completions.create({
        //   model: "text-davinci-003",
        //   prompt: prompt,
        //   max_tokens: 3900,
        //   temperature: 0.2,
        //   top_p: 0.1,
        // });
        // const responseText = response.choices[0].text;

        const responseText = "one. two. three. four. five. six.";

        setGeneratedResponse(responseText);
        localStorage.setItem("generatedResponse", responseText);
        // console.log("Response from API:", response.choices[0].text);

        const handleDeleteCredits = async () => {
          const userId = currentUser.uid;
          const amount = responseLength;

          const newCredits = await deleteCredits(userId, amount);
          if (newCredits !== null) {
            console.log(`New credits: ${newCredits}`);
          }

          setCredits(newCredits);
        };

        handleDeleteCredits();

        setIsPlayButtonDisabled(false);
      } else {
        setGeneratedResponse("Not enough credits!");
      }
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
    console.log();
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
        updatedData[key].recordedPracticeAudios = updatedData[
          key
        ].recordedPracticeAudios.filter((audio) => audio.id !== audioId);
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
    const sentences = ResponseCleaner(
      generatedResponse,
      renderedSentencesCount
    );
    let mainLanguage = sentences[0];
    let newReadString = "";
    if (selectedPage === "Practice") {
      mainLanguage = mainLanguage[selectedSentenceIndex];
      newReadString = mainLanguage;
    } else {
      newReadString = mainLanguage.join(" ");
    }
    setMainString(newReadString);
    localStorage.setItem("mainString", newReadString);
    setAudioURL(null); // Reset the audio URL when the TTS text changes
    localStorage.setItem("audioURL", null);
  }, [
    generatedResponse,
    renderedSentencesCount,
    selectedSentenceIndex,
    selectedPage,
  ]);

  const sentences = ResponseCleaner(generatedResponse, responseLength);

  return (
    <div>
      {pricingState && <PricingModal onClose={closePricingModal} />}
      <div>
        <GenerateHeader
          typeResponse={typeResponse}
          setTypeResponse={setTypeResponse}
        />
        {width < 768 && (
          <div className="center">
            <Selectors
              className="selectors"
              typeResponse={typeResponse}
              setTypeResponse={setTypeResponse}
            />
          </div>
        )}
        {!typeResponse && (
          <div className="center">
            <div className="inputs">
              <div className="prompt-input">
                <label htmlFor="prompt">Enter a topic!:</label>
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
              <div >
                <span className="generator-credits">{credits} credits </span>
                <button
                  className={isGPTLoading ? "generate-disabled" : "generate"}
                  onClick={handleGenerateResponse}
                  disabled={isGPTLoading}
                >
                  {isGPTLoading
                    ? "Scenario Generating..."
                    : "Generate Scenario"}
                </button>
              </div>
            )}
            {generatedResponse && !typeResponse && (
              <Bookmark
                typeResponse={typeResponse}
                typedResponse={typedResponse}
                generatedResponse={generatedResponse}
                language={selectedLanguage}
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
              responseLength={responseLength}
              handleResponseLengthChange={handleResponseLengthChange}
              renderedSentencesCount={renderedSentencesCount}
              handleRenderedSentencesCountChange={
                handleRenderedSentencesCountChange
              }
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
                  renderedSentencesCount={renderedSentencesCount}
                />
              )}
              {generatedResponse === "Not enough credits!" && (
                <div className="center">
                  <button className="generate" onClick={() => setPricingState(true)}>
                    Buy more credits!
                  </button>
                </div>
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
