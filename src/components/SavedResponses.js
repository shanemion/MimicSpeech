import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../services/firebase/FirebaseAuth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../services/language/LanguageContext";

const SavedResponses = ({
  userPrompt,
  setUserPrompt,
  responseLength,
  setResponseLength
}) => {
  const { currentUser, deleteSavedResponse } = useAuth();
  const [savedResponses, setSavedResponses] = useState([]);
  const navigate = useNavigate();
  const {
    fromLanguage,
    setFromLanguage,
    selectedLanguage,
    setSelectedLanguage,
  } = useContext(LanguageContext);

  useEffect(() => {
    fetchResponses();
  }, [currentUser]); // Changed [[currentUser]] to [currentUser]

  const fetchResponses = async () => {
    const db = getFirestore();
    const q = query(collection(db, "users", currentUser.uid, "responses"));
    // const q = query(collection(db, "users", currentUser.uid, "responses"), where("language", "==", "Chinese"));

    const querySnapshot = await getDocs(q);
    const responses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSavedResponses(responses);
  };

  const handleDelete = async (id) => {
    await deleteSavedResponse(currentUser.uid, id);
    fetchResponses();
  };

  const handleUseResponse = (response) => {
    localStorage.setItem("generatedResponse", response.text);
    localStorage.setItem("responseLanguage", response.language);
    localStorage.setItem("numSentences", response.numSentences);
    setFromLanguage(response.fromLanguage);
    setSelectedLanguage(response.selectedLanguage);
    setUserPrompt(response.userPrompt);
    console.log(response.userPrompt)
    console.log("1", userPrompt)
    setResponseLength(response.responseLength);
    navigate("/generator");
  };

  return (
    <div>
      <h1>Saved Responses</h1>
      {savedResponses.map((response, index) => (
        <div key={index}>
          <h2>Response #{index + 1}</h2>
          <p>{response.text}</p>
          <button onClick={() => handleDelete(response.id)}>Delete</button>
          <button onClick={() => handleUseResponse(response)}>
            Use this Response
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedResponses;
