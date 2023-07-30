import React, { useState, useEffect } from "react";
import LanguageContext from "./LanguageContext";

const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    return storedLanguage ? JSON.parse(storedLanguage) : null;
  });

  const [selectedGender, setSelectedGender] = useState(() => {
    const storedGender = localStorage.getItem("selectedGender");
    return storedGender ? JSON.parse(storedGender) : null;
  });

  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem("selectedLanguage", JSON.stringify(selectedLanguage));
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (selectedGender) {
      localStorage.setItem("selectedGender", JSON.stringify(selectedGender));
    }
  }, [selectedGender]);

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        selectedGender,
        setSelectedLanguage,
        setSelectedGender,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
