import React, { useState, useEffect, useContext } from "react";
import LanguageContext from "../services/language/LanguageContext";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import SpeakText from "../utils/SpeakTTS";
import { useAuth } from "../services/firebase/FirebaseAuth";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import "./WordModal.css";

const Modal = ({ show, onHide, word }) => {
  const {
    currentUser,
    ref,
    storage,
    deleteObject,
    uploadBytes,
    getDownloadURL,
    db,
    deleteDoc,
    doc,
  } = useAuth();

  const [definitions, setDefinitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phonetics, setPhonetics] = useState("");
  const [dictAudioUrl, setDictAudioUrl] = useState("");
  const { fromLanguage, selectedLanguage, selectedGender } =
    useContext(LanguageContext);
  const toLanguage = selectedLanguage.value;
  const from = fromLanguage.value;
  const [showEnglishDefinition, setShowEnglishDefinition] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    setRecordedAudioBlob(null);
  }, [word]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        setRecordedAudioBlob(e.data);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const playRecordedAudio = () => {
    if (recordedAudioBlob) {
      const audioUrl = URL.createObjectURL(recordedAudioBlob);
      new Audio(audioUrl).play();
    }
  };

  // Map to Google Translate language codes
  const langMap = {
    Chinese: "zh-CN",
    English: "en",
    Spanish: "es",
    Arabic: "ar",
    French: "fr",
    German: "de",
    Russian: "ru",
    Portuguese: "pt",
    Italian: "it",
    Korean: "ko",
    Hindi: "hi",
    Japanese: "ja",
    Vietnamese: "vi",
  };

  const openInGoogleTranslateMap = {
    Chinese: "在Google翻译中打开",
    English: "Open in Google Translate",
    Spanish: "Abrir en Google Translate",
    Arabic: "افتح في ترجمة جوجل",
    French: "Ouvrir dans Google Traduction",
    German: "In Google Übersetzer öffnen",
    Russian: "Открыть в Google Переводчике",
    Portuguese: "Abrir no Google Tradutor",
    Italian: "Apri in Google Traduttore",
    Korean: "Google 번역에서 열기",
    Hindi: "Google अनुवाद में खोलें",
    Japanese: "Google翻訳で開く",
    Vietnamese: "Mở trong Google Dịch",
  };

  const googleTranslateLink = `https://translate.google.com/?sl=${langMap[toLanguage]}&tl=${langMap[from]}&op=translate&text=${word}`;

  const searchOnGoogleMap = {
    Chinese: "在Google上搜索定义",
    English: "Search definition on Google",
    Spanish: "Buscar definición en Google",
    Arabic: "البحث عن تعريف في جوجل",
    French: "Rechercher la définition sur Google",
    German: "Definition auf Google suchen",
    Russian: "Искать определение в Google",
    Portuguese: "Pesquisar definição no Google",
    Italian: "Cerca la definizione su Google",
    Korean: "Google에서 정의 검색",
    Hindi: "Google पर परिभाषा खोजें",
    Japanese: "Googleで定義を検索",
    Vietnamese: "Tìm kiếm định nghĩa trên Google",
  };

  const googleSearchLink = `https://www.google.com/search?q=${word}+${from}+definition`;

  const handleTTS = async (word) => {
    const identifier = `${currentUser.uid}_${word}-${selectedLanguage.value}-${selectedGender.value}`;
    if (!word) {
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

    // // Step 0: Cleanup if necessary
    // const q = query(
    //   collection(db, "audioRecords"),
    //   orderBy("timestamp", "asc"),
    //   limit(200)
    // );
    // const querySnapshot = await getDocs(q);

    // if (querySnapshot.size >= 200) {
    //   // Delete the oldest record
    //   const oldestDoc = querySnapshot.docs[0];
    //   console.log("Deleting oldest doc: ", oldestDoc.id);
    //   try {
    //     await deleteDoc(doc(db, "audioRecords", oldestDoc.id));
    //   } catch (e) {
    //     console.error("Error deleting document: ", e);
    //   }
    //   // Also delete the actual audio file in storage
    //   const storageRefToDelete = ref(
    //     storage,
    //     `/words/${currentUser.uid}/${oldestDoc.data().identifier}.wav`
    //   );
    //   try {
    //     await deleteObject(storageRefToDelete);
    //   } catch (e) {
    //     console.error("Error deleting storage object: ", e);
    //   }
    // }

    let storageRef = ref(
      storage,
      `/words/${currentUser.uid}/${identifier}.wav`
    );
    // Step 1: Check if the audio for this text already exists
    try {
      const audioURL = await getDownloadURL(storageRef);
      // If we get here, it means the audio already exists.
      // console.log("Audio exists, playing from storage...");
      const audio = new Audio(audioURL);
      audio.play();
    } catch (error) {
      // getDownloadURL will throw an error if the file doesn't exist, catch it here
      if (error.code === "storage/object-not-found") {
        // console.log("Audio does not exist, generating...");

        // Step 2: Generate and upload the audio if it doesn't exist
        try {
          const audioBlob = await SpeakText(
            word,
            selectedLanguage,
            selectedGender,
            "medium",
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

  useEffect(() => {
    setDefinitions([]);
    setPhonetics("");
    setDictAudioUrl("");
    if (toLanguage === "English") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
          );
          const data = await response.json();
          setDefinitions(data[0].meanings[0].definitions);
          setPhonetics(data[0].phonetics[0]?.text || "");
          setDictAudioUrl(data[0].phonetics[0]?.audio || "");
        } catch (error) {
          console.error("An error occurred while fetching data:", error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [word]);

  const toggleShowEnglishDefinition = () => {
    setShowEnglishDefinition(!showEnglishDefinition);
  };

  const renderDefinitions = () => {
    if (loading && toLanguage === "English") {
      return <div className="loading">Loading...</div>;
    }

    return (
      <>
        {toLanguage === "English" && (
          <>
            <button
              className="show-hide-button"
              onClick={toggleShowEnglishDefinition}
            >
              {showEnglishDefinition ? "Hide Definition" : "Show Definition"}
            </button>
            {showEnglishDefinition &&
              definitions.map((definition, index) => (
                <div key={index} className="definition-container">
                  <div className="definition">{definition.definition}</div>
                  <div className="example">{definition.example}</div>
                </div>
              ))}
          </>
        )}

        <div>
          <div style={{ marginTop: "16px" }}></div>
          <div>
            <a
              href={googleSearchLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {searchOnGoogleMap[from]}
            </a>
          </div>
          <div style={{ marginTop: "8px" }}></div>
          <div>
            <a
              href={googleTranslateLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {openInGoogleTranslateMap[from]}
            </a>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {show && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>{word}</h2>
                <h3 className="phonetics">{phonetics}</h3>
                {dictAudioUrl && (
                  <div>
                    <button
                      onClick={() => new Audio(dictAudioUrl).play()}
                      className="audio-button"
                    >
                      <>Play Word</>
                      <>
                        <HiOutlineSpeakerWave />
                      </>
                    </button>
                  </div>
                )}
                {dictAudioUrl === "" && (
                  <div>
                    <button
                      onClick={() =>
                        handleTTS(word)
                      }
                      className="audio-button"
                    >
                      <>Play Word</>
                      <>
                        <HiOutlineSpeakerWave />
                      </>
                    </button>
                  </div>
                )}
                <div className="modal-button-container">
                  {" "}
                  <button
                    className={
                      isRecording ? "recording-button" : "not-recording-button"
                    }
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                  <button
                    className={
                      recordedAudioBlob ? "playback-button" : "disabled-button"
                    }
                    onClick={playRecordedAudio}
                    disabled={!recordedAudioBlob}
                  >
                    Playback
                  </button>
                </div>
              </div>

              <button onClick={onHide} className="text-close-button">
                Close
              </button>
            </div>
            <div className="modal-body">{renderDefinitions()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
