import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import {
  getFirestore,
  collection,
  getDocs,
  query
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSavedResponse } from "../../services/saved/SavedContext";
import LanguageContext from "../../services/language/LanguageContext";
import './SavedResponses.css';
import { listAll } from "@firebase/storage";
import LoaderIcon from "react-loader-icon";


const SavedResponses = ({
  userPrompt,
  setUserPrompt,
  responseLength,
  setResponseLength,
}) => {
  const { currentUser, deleteSavedResponse } = useAuth();
  const { isSaved, setIsSaved } = useSavedResponse();
  const [savedResponses, setSavedResponses] = useState([]);
  const { ref, storage, deleteObject } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const {
    fromLanguage,
    setFromLanguage,
    selectedLanguage,
    setSelectedLanguage,
  } = useContext(LanguageContext);
  const [filterLanguage, setFilterLanguage] = useState("");

  useEffect(() => {
    fetchResponses();
  }, [currentUser]);

  const fetchResponses = async () => {
    const db = getFirestore();
    const q = query(collection(db, "users", currentUser.uid, "responses"));
    const querySnapshot = await getDocs(q);
    const responses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Sort responses by timestamp, most recent at the top
    responses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setSavedResponses(responses);
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteSavedResponse(currentUser.uid, id);

    const deleteUnsavedAudios = async (userId) => {
      // Get the list of audio blobs stored in Firebase Storage
      const listRef = ref(storage, `/savedSynthesizedAudios/${currentUser.uid}/`);
      const { items } = await listAll(listRef);

      // Delete each item in the folder
      for (const item of items) {
        await deleteObject(item);
      }
    };

    deleteUnsavedAudios(currentUser.uid);

    fetchResponses();
  };

  const handleUseResponse = (response) => {
    console.log("response", response)
    localStorage.setItem("responseId", response.id);
    localStorage.setItem("generatedResponse", response.text);
    console.log("generatedResponse", response.text)
    localStorage.setItem("responseLanguage", response.language);
    localStorage.setItem("numSentences", response.numSentences);
    setFromLanguage(response.fromLanguage);
    setSelectedLanguage(response.selectedLanguage);
    setUserPrompt(response.userPrompt);
    console.log(response.userPrompt)
    console.log("1", userPrompt)
    setResponseLength(response.responseLength);
    navigate("/generator");
    setIsSaved(true); 
  };

  

  const filteredResponses = filterLanguage ? savedResponses.filter(r => r.selectedLanguage.value === filterLanguage) : savedResponses;


  if (isLoading) {
    return <div style={{marginTop: "40vh"}}> 
        <LoaderIcon type="bubbles" color="#000000" />
    </div>;
  }

  return (
    <div className="sr-container">
      <h1 className="sr-title">Saved Responses</h1>
      <div className="sr-filter-container">
        <label className="sr-filter-label">Filter by Completion Language: </label>
        <select className="sr-filter-select" onChange={(e) => setFilterLanguage(e.target.value)}>
          <option value="">All</option>
          <option value="Chinese">Chinese</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Russian">Russian</option>
          <option value="Spanish">Spanish</option>
          <option value="Vietnamese">Vietnamese</option>
        </select>
      </div>
      {filteredResponses.map((response, index) => (
         <div key={index} className="sr-response">
         <h2 className="sr-response-title">{response.userPrompt || `Unnamed Response`}</h2>
         <p className="sr-response-text">{response.text}</p>
         <button className="sr-button sr-button-delete" onClick={() => handleDelete(response.id)}>Delete</button>
         <button className="sr-button" onClick={() => handleUseResponse(response)}>Use this Response</button>
       </div>
     ))}
   </div>
 );
};

export default SavedResponses;
