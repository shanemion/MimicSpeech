// LanguageContext.js
import { createContext } from "react";

const LanguageContext = createContext({
  selectedLanguage: null,
  selectedGender: null,
  setSelectedLanguage: () => {},
  setSelectedGender: () => {},
});

export default LanguageContext;
