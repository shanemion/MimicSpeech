import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
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
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { local } from "d3";

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
  const [googleSignInPending, setGoogleSignInPending] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const register = async (email, password, additionalData) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("userCredential", userCredential)
    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...additionalData,
      credits: 10,  
      // firstName: "",
      // lastName: "",
      plan: "free",
      subscriptionId: "",
    });
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

  // Initialize Google Auth Provider
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Check if the user is new and doesn't exist in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Initialize credits and plan
        await setDoc(doc(db, "users", user.uid), {
          credits: 15,
          firstName: "",
          lastName: "",
          plan: "free",
        });
        // Enter into the intermediate step for Google Sign-In
        setGoogleSignInPending(true);
      } else {
        // User already registered, navigate directly
        setCurrentUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchCredits = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data().credits || 0;
  };

  const fetchFirstName = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data().firstName || "";
  };

  const fetchLastName = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data().lastName || "";
  };

  const fetchPlan = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data().plan || "free";
  };

  const fetchSubscriptionId = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data().subscriptionId || "lol";
  };

  const deleteCredits = async (userId, amount) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const currentCredits = userDoc.data().credits || 0;
      const newCredits = Math.max(currentCredits - amount, 0); // Ensure credits don't go below 0
      await setDoc(userRef, { credits: newCredits }, { merge: true });
  
      return newCredits; // Return the new credits for further use if needed
    } catch (error) {
      console.error("Error deleting credits:", error);
      return null; 
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const saveResponse = async (userId, response, language, fromLanguage, selectedLanguage, userPrompt, responseLength) => {
    try {
      const responsesRef = collection(db, "users", userId, "responses");
      const numSentences =
        parseInt(localStorage.getItem("numSentences"), 10) || 3;
  
      const docRef = await addDoc(responsesRef, {
        ...response,

        language,
        numSentences,
        fromLanguage: fromLanguage,  // Assuming fromLanguage is an object with a `value` property
        selectedLanguage: selectedLanguage,  // Assuming selectedLanguage is an object with a `value` property
        userPrompt: userPrompt || "",
        responseLength: responseLength || 3,
        timestamp: new Date().toISOString(), // Add this line
      });
    
      localStorage.setItem("responseId", docRef.id);
      console.log("Document written with ID: ", docRef.id);

      return docRef.id;
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };
  

  const fetchSavedResponses = async (userId) => {
    const responsesRef = collection(db, "users", userId, "responses");
    const responseSnapshot = await getDocs(responsesRef);
    return responseSnapshot.docs.map((doc) => {
      const responseData = doc.data();
      const numSentences = responseData.numSentences; // Retrieve the numSentences value from the response data
      localStorage.setItem("numSentences", numSentences.toString()); // Update the localStorage with this value
      return { id: doc.id, ...responseData };
    });
  };

  const deleteSavedResponse = async (userId, docId) => {
    const docRef = doc(db, "users", userId, "responses", docId);
    await deleteDoc(docRef);
    localStorage.removeItem("responseId");
    console.log("Document successfully deleted!");
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
      await setDoc(
        responseRef,
        { USERwav: existingRecordings },
        { merge: true }
      );
    } else {
      // Handle the case where the response doesn't exist (e.g., initialize as a new response)
      await setDoc(responseRef, { USERwav: [newRecording] }, { merge: true });
    }
  };

  const getResponseById = async (userId, responseId) => {
    const responseRef = doc(db, "users", userId, "responses", responseId);
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
    getDownloadURL,
    deleteObject,
    signInWithGoogle,
    fetchCredits,
    fetchFirstName,
    fetchLastName,
    fetchPlan,
    deleteCredits,
    deleteDoc,
    doc,
    googleSignInPending,
    setGoogleSignInPending,
    getDoc,
    setDoc,
    fetchSubscriptionId
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
