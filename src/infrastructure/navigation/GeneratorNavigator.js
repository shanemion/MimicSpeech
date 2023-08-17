import React, { useContext } from "react";
import AnalyzeButton from "../../components/GraphButton";
import ChineseResponseGenerator from "../../components/generators/ChineseResponseGenerator";
import EnglishResponseGenerator from "../../components/generators/EnglishResponseGenerator";
import JapaneseResponseGenerator from "../../components/generators/JapaneseResponseGenerator";
import VietnameseResponseGenerator from "../../components/generators/VietnameseResponseGenerator";

import LanguageContext from "../../services/language/LanguageContext";

export const Navigator = ({ typeResponse, setTypeResponse }) => {
  const { selectedLanguage } = useContext(LanguageContext);

  if (!selectedLanguage) {
    return null; // or return a loading spinner
  }
  const language = selectedLanguage.value;

  return (
    <>
      <div>
      {(language === "Chinese" || language === null) && (
        <ChineseResponseGenerator
          typeResponse={typeResponse}
          setTypeResponse={setTypeResponse}
        />
      )}
      {language === "English" && <EnglishResponseGenerator />}
      {language === "Japanese" && <JapaneseResponseGenerator />}
      {language === "Vietnamese" && <VietnameseResponseGenerator />}
      </div>
      <AnalyzeButton />
    </>
  );
};
