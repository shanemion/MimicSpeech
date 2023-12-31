import React, { useState, useEffect } from "react";
import LanguageContext from "./LanguageContext";

const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    return storedLanguage ? JSON.parse(storedLanguage) : null;
  });

  const [ fromLanguage, setFromLanguage ] = useState(() => {
    const storedLanguage = localStorage.getItem("fromLanguage");
    return storedLanguage ? JSON.parse(storedLanguage) : null;
  });

  // const [selectedGender, setSelectedGender] = useState(() => {
  //   const storedGender = localStorage.getItem("selectedGender");
  //   return storedGender ? JSON.parse(storedGender) : null;
  // });
  const [selectedGender, setSelectedGender] = useState(() => {
    const storedGender = localStorage.getItem("selectedGender");
    return storedGender ? JSON.parse(storedGender) : null;
});

useEffect(() => {
    localStorage.setItem("selectedGender", JSON.stringify(selectedGender));
}, [selectedGender]);


  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem("selectedLanguage", JSON.stringify(selectedLanguage));
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (fromLanguage) {
      localStorage.setItem("fromLanguage", JSON.stringify(fromLanguage));
    }
  }, [fromLanguage]);

  // useEffect(() => {
  //   if (selectedGender) {
  //     localStorage.setItem("selectedGender", JSON.stringify(selectedGender));
  //   }
  // }, [selectedGender]);

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        selectedGender,
        setSelectedLanguage,
        setSelectedGender,
        fromLanguage,
        setFromLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
