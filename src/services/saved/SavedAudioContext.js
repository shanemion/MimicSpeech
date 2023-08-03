import React, { createContext, useContext, useState } from "react";
import { useAuth } from "../firebase/FirebaseAuth";

const SavedAudioContext = createContext();

export const useSavedAudio = () => {
  return useContext(SavedAudioContext);
};

export const SavedAudioProvider = ({ children }) => {
  const { currentUser, saveResponse, getResponseById } = useAuth();

  const saveAudio = async (responseId, type, base64Audio) => {
    if (currentUser) {
      const response = await getResponseById(currentUser.uid, responseId);
      if (response) {
        const audioField = type === "tts" ? "tts_audio" : "user_audio";
        await saveResponse(currentUser.uid, {
          ...response,
          [audioField]: base64Audio,
        });
      }
    }
  };

  return (
    <SavedAudioContext.Provider value={{ saveAudio }}>
      {children}
    </SavedAudioContext.Provider>
  );
};
