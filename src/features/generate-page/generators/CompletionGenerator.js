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
import GeneratePrompt from "./prompts/Prompts";
import GenerateOptions from "./components/GenerateOptions";
import { useSavedResponse } from "../../../services/saved/SavedContext";
import { listAll } from "@firebase/storage";
import { PitchChartXAxis } from "../../../components/PitchChartXAxis";

const CompletionGenerator = ({
  typeResponse,
  setTypeResponse,
  userPrompt,
  setUserPrompt,
  responseLength,
  setResponseLength,
}) => {
  // Utils
  const { width } = useWindowSize();
  const { ref, storage, deleteObject, uploadBytes, getDownloadURL } = useAuth();
  const {
    currentUser,
    fetchCredits,
    fetchFirstName,
    fetchLastName,
    deleteCredits,
  } = useAuth();
  const { updateTTSwav } = useAuth();

  // Contexts
  const { selectedLanguage, selectedGender, fromLanguage } =
    useContext(LanguageContext);
  const [typedResponse, setTypedResponse] = useTypedResponse();
  const { pricingState, setPricingState } = useContext(PricingContext);
  const { isSaved, setIsSaved } = useSavedResponse();

  // State for database and user info
  const [credits, setCredits] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // State for the response generator

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
  const [numLanguages, setNumLanguages] = useState(2);

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

  useEffect(() => {
    localStorage.setItem("userPrompt", userPrompt);
  }, [userPrompt]);

  const handleResponseLengthChange = (event) => {
    let newValue = parseInt(event.target.value, 10);
    if (newValue > 6) {
      newValue = 6;
    }
    if (newValue < 2) {
      newValue = 2;
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
    localStorage.removeItem("TTS_audio"); // Correct key
    localStorage.removeItem("USER_wavs"); // Correct key
    setIsSaved(false);
    if (!fromLanguage || !selectedLanguage) {
      alert("Please select a language.");
      return;
    }
    setIsGPTLoading(true);

    console.log("selectedLanguage", selectedLanguage);

    const prompt = GeneratePrompt({
      fromLanguage: fromLanguage,
      selectedLanguage: selectedLanguage,
      userPrompt: userPrompt,
      responseLength: responseLength,
    });

    console.log(prompt);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_KEY,
      dangerouslyAllowBrowser: true,
    });
    try {
      if (credits >= responseLength) {
        const response = await openai.completions.create({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 3900,
          temperature: 0.2,
          top_p: 0.1,
        });
        const responseText = response.choices[0].text;

        // const responseText = "one. two. three. four. five. six.";

        setGeneratedResponse(responseText);
        localStorage.setItem("generatedResponse", responseText);
        console.log("Response from API:", response.choices[0].text);

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

    const deleteUnsavedAudios = async (userId) => {
      // Get the list of audio blobs stored in Firebase Storage
      const listRef = ref(storage, `/synthesizedAudios/${currentUser.uid}/`);
      const { items } = await listAll(listRef);

      // Delete each item in the folder
      for (const item of items) {
        await deleteObject(item);
      }
    };

    deleteUnsavedAudios(currentUser.uid);

    setSynthesizedPitchData([]);
    setRecordedAudios([]);
    setPracticeData({});
    setSynthesizedPracticePitchData([]);
    setRecordedPracticeAudios([]);
  };

  const docId = localStorage.getItem("responseId");
  console.log("docIda", docId);

  // useEffect(() => {
  //   const moveFiles = async () => {
  //     // The folder where your synthesized audio files are originally saved
  //     const originalFolderRef = ref(storage, `${docId}/synthesizedAudios/${currentUser.uid}`);

  //     try {
  //       // List all files in the folder
  //       const res = await listAll(originalFolderRef);

  //       for (const itemRef of res.items) {
  //         // Download the file to a blob
  //         const fileURL = await getDownloadURL(itemRef);
  //         const response = await fetch(fileURL);
  //         const blob = await response.blob();

  //         // Extract the file name from the itemRef
  //         const fileName = itemRef.name;

  //         // Upload the blob to the new location
  //         const newFolderRef = ref(
  //           storage,
  //           `savedSynthesizedAudios/${docId}/${currentUser.uid}/${fileName}`
  //         );
  //         await uploadBytes(newFolderRef, blob);

  //         // Delete the original file
  //         await deleteObject(itemRef);
  //       }
  //     } catch (error) {
  //       console.error("Error moving files:", error);
  //     }
  //   };

  //   moveFiles();
  // }, [isSaved, docId, storage, ref, currentUser.uid, getDownloadURL, uploadBytes, deleteObject]);

  const handleTTS = async (
    textToRead,
    selectedLanguage,
    selectedGender,
    rate
  ) => {
    if (!textToRead) {
      alert("Please enter some text to read.");
      return;
    }
    if (!selectedLanguage) {
      alert("Please select a language.");
      return;
    }
    if (!selectedGender) {
      alert("Please select a voice.");
      return;
    }

    const identifier = `${currentUser.uid}_${textToRead}-${selectedLanguage.value}-${selectedGender.value}-${rate}`;
    console.log("identifier", identifier);
    console.log("docId", docId);
    let storageRef;
    if (isSaved) {
      storageRef = ref(
        storage,
        `/savedSynthesizedAudios/${currentUser.uid}/${identifier}.wav`
      );
    } else {
      storageRef = ref(
        storage,
        `/synthesizedAudios/${currentUser.uid}/${identifier}.wav`
      );
    }

    // Step 1: Check if the audio for this text already exists
    try {
      const audioURL = await getDownloadURL(storageRef);
      // If we get here, it means the audio already exists.
      console.log("Audio exists, playing from storage...");
      const audio = new Audio(audioURL);
      audio.play();
    } catch (error) {
      // getDownloadURL will throw an error if the file doesn't exist, catch it here
      if (error.code === "storage/object-not-found") {
        console.log("Audio does not exist, generating...");

        // Step 2: Generate and upload the audio if it doesn't exist
        try {
          const audioBlob = await SpeakText(
            textToRead,
            selectedLanguage,
            selectedGender,
            rate,
            identifier
          );

          await uploadBytes(storageRef, audioBlob);
        } catch (error) {
          console.error("Error generating or uploading TTS:", error);
        }
      } else {
        // Handle other errors
        console.error("An unknown error occurred:", error);
      }
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
      renderedSentencesCount,
      numLanguages,
      selectedLanguage,
      fromLanguage
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
    numLanguages,
    selectedLanguage,
    fromLanguage,
  ]);

  const sentences = ResponseCleaner(
    generatedResponse,
    responseLength,
    numLanguages,
    selectedLanguage,
    fromLanguage
  );

  return (
    <div>
      {pricingState && <PricingModal onClose={closePricingModal} />}
      <GenerateOptions
        typeResponse={typeResponse}
        setTypeResponse={setTypeResponse}
        userPrompt={userPrompt}
        handlePromptChange={handlePromptChange}
        responseLength={responseLength}
        handleResponseLengthChange={handleResponseLengthChange}
        handleGenerateResponse={handleGenerateResponse}
        generatedResponse={generatedResponse}
        selectedLanguage={selectedLanguage}
        credits={credits}
        isGPTLoading={isGPTLoading}
      />
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
                  numLanguages={numLanguages}
                />
              )}
              {generatedResponse === "Not enough credits!" && (
                <div className="center">
                  <button
                    className="generate"
                    onClick={() => setPricingState(true)}
                  >
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
                  mainString={mainString}
                  selectedLanguage={selectedLanguage}
                />
                <PitchChartXAxis
                  selectedPage={selectedPage}
                  renderedSentencesCount={renderedSentencesCount}
                  mainString={mainString}
                  selectedLanguage={selectedLanguage}
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

export default CompletionGenerator;
