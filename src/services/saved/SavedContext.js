import React, { createContext, useContext, useState } from 'react';

const SavedResponseContext = createContext();

export const useSavedResponse = () => {
  return useContext(SavedResponseContext);
};

export const SavedResponseProvider = ({ children }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <SavedResponseContext.Provider value={{ isSaved, setIsSaved }}>
      {children}
    </SavedResponseContext.Provider>
  );
};
