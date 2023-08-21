import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();


const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, additionalData) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Save additional data to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), additionalData);
    setCurrentUser(userCredential.user);
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    setCurrentUser(userCredential.user);
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const saveResponse = async (userId, response, language) => {
    try {
      const responsesRef = collection(db, "users", userId, "responses");
      const numSentences = parseInt(localStorage.getItem("numSentences"), 10) || 3;
      const responseId = localStorage.getItem("responseId");
  
      // Only add TTS and USER wav files if the response has been saved
      let ttsAudioBase64 = null;
      let userWavsBase64 = null;
      if (responseId !== null) {
        ttsAudioBase64 = localStorage.getItem("TTS_audio");
        userWavsBase64 = JSON.parse(localStorage.getItem("USER_wavs") || "[]");
      }
  
      const docRef = await addDoc(responsesRef, {
        ...response,
        TTSwav: ttsAudioBase64,
        USERwav: userWavsBase64,
        language,
        numSentences,
      });
  
      return docRef.id;
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };
  
  
  
  const fetchSavedResponses = async (userId) => {
    const responsesRef = collection(db, "users", userId, "responses");
    const responseSnapshot = await getDocs(responsesRef);
    return responseSnapshot.docs.map(doc => {
      const responseData = doc.data();
      const numSentences = responseData.numSentences; // Retrieve the numSentences value from the response data
      localStorage.setItem("numSentences", numSentences.toString()); // Update the localStorage with this value
      return { id: doc.id, ...responseData };
    });
  };
  

  const deleteSavedResponse = async (userId, docId) => {
    const docRef = doc(db, "users", userId, "responses", docId);
    await deleteDoc(docRef);
  };

  const updateTTSwav = async (userId, responseId, ttsAudioBase64) => {
    const responseRef = doc(db, "users", userId, "responses", responseId);
    await setDoc(responseRef, { TTSwav: ttsAudioBase64 }, { merge: true });
  };
  
  
  const updateUserWav = async (userId, responseId, newRecording) => {
    const responseRef = doc(db, "users", userId, "responses", responseId);
    const responseDoc = await getDoc(responseRef);
  
    if (responseDoc.exists()) {
      const existingRecordings = responseDoc.data().USERwav || [];
      existingRecordings.push(newRecording);
      await setDoc(responseRef, { USERwav: existingRecordings }, { merge: true });
    } else {
      // Handle the case where the response doesn't exist (e.g., initialize as a new response)
      await setDoc(responseRef, { USERwav: [newRecording] }, { merge: true });
    }
  };
  

  const getResponseById = async (userId, responseId) => {
    const responseRef = doc(db, 'users', userId, 'responses', responseId);
    const responseDoc = await getDoc(responseRef);
    
    if (responseDoc.exists()) {
      return { id: responseDoc.id, ...responseDoc.data() };
    } else {
      return null;
    }
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    db,
    saveResponse,
    fetchSavedResponses,
    deleteSavedResponse,
    getResponseById,
    updateTTSwav,
    updateUserWav,
    ref,
    storage,
    uploadBytes,
    getDownloadURL
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};