import React, { useState } from "react";
import LanguageContext from "./LanguageContext";

const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  return (
    <LanguageContext.Provider
      value={{ selectedLanguage, selectedGender, setSelectedLanguage, setSelectedGender }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
