// LanguageContext.js
import { createContext } from "react";

const LanguageContext = createContext({
  selectedLanguage: "",
  selectedGender: null,
  setSelectedLanguage: () => {},
  setSelectedGender: () => {},
  fromLanguage: "",
  setFromLanguage: () => {},
});

export default LanguageContext;
