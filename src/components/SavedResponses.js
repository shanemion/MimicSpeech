import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/firebase/FirebaseAuth';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const SavedResponses = () => {
  const { currentUser, deleteSavedResponse } = useAuth();
  const [savedResponses, setSavedResponses] = useState([]);
  const navigate = useNavigate(); // get the useNavigate hook

  useEffect(() => {
    fetchResponses();
  }, [currentUser]);

  const fetchResponses = async () => {
    const db = getFirestore();
    const q = query(collection(db, "users", currentUser.uid, "responses"), where("language", "==", "Chinese"));
    
    const querySnapshot = await getDocs(q);
    const responses = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setSavedResponses(responses);
  };

  const handleDelete = async (id) => {
    await deleteSavedResponse(currentUser.uid, id);
    fetchResponses(); // refresh the savedResponses after deletion
  };

  const handleUseResponse = (response) => {
    // Store the response text and language in localStorage
    localStorage.setItem('generatedResponse', response.text);
    localStorage.setItem('responseLanguage', response.language);
    // Navigate back to the main page
    navigate('/');
  };

  return (
    <div>
      <h1>Saved Responses</h1>
      {savedResponses.map((response, index) => (
        <div key={index}>
          <h2>Response #{index+1}</h2>
          <p>{response.text}</p>
          <button onClick={() => handleDelete(response.id)}>Delete</button>
          <button onClick={() => handleUseResponse(response)}>Use this Response</button> {/* Add this button */}
        </div>
      ))}
    </div>
  );
}

export default SavedResponses;
