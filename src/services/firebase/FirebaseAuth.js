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
  collection,
  addDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnKNYzLM0Dj_EeU5zyzzqssEYsugrY00w",
  authDomain: "mimicspeech.firebaseapp.com",
  projectId: "mimicspeech",
  storageBucket: "mimicspeech.appspot.com",
  messagingSenderId: "408207858237",
  appId: "1:408207858237:web:492c88ff5bf45b8f746854",
  measurementId: "G-369LQQ8NZQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

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
      await addDoc(responsesRef, { ...response, language });
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    db,
    saveResponse,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
