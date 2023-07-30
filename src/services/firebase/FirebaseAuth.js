import React, { createContext, useContext, useState, useEffect } from "react";
import { firebaseConfig } from "../../apikeys";
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

// Your web app's Firebase configuration


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
      const docRef = await addDoc(responsesRef, { ...response, language });
      return docRef.id;
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const fetchSavedResponses = async (userId) => {
    const responsesRef = collection(db, "users", userId, "responses");
    const responseSnapshot = await getDocs(responsesRef);
    return responseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };


  const deleteSavedResponse = async (userId, docId) => {
    const docRef = doc(db, "users", userId, "responses", docId);
    await deleteDoc(docRef);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
