// LanguageContext.js
import { createContext } from "react";

const LanguageContext = createContext({
  selectedLanguage: "Chinese",
  selectedGender: null,
  setSelectedLanguage: () => {},
  setSelectedGender: () => {},
});

export default LanguageContext;
