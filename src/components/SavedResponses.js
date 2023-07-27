import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/firebase/FirebaseAuth';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const SavedResponses = () => {
  const { currentUser } = useAuth();
  const [savedResponses, setSavedResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const db = getFirestore();
      const q = query(collection(db, "users", currentUser.uid, "responses"), where("language", "==", "Chinese"));
      
      const querySnapshot = await getDocs(q);
      const responses = querySnapshot.docs.map(doc => doc.data());
      setSavedResponses(responses);
    };

    if (currentUser) {
      fetchResponses();
    }
  }, [currentUser]);

  return (
    <div>
      <h1>Saved Responses</h1>
      {savedResponses.map((response, index) => (
        <div key={index}>
          <h2>Response #{index+1}</h2>
          <p>{response.text}</p>
        </div>
      ))}
    </div>
  );
}

export default SavedResponses;
