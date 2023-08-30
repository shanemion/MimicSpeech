import React, { useContext } from "react";
import ChineseResponseGenerator from "../../features/generate-page/generators/ChineseResponseGenerator";

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
      {language === "English" && <ChineseResponseGenerator
          typeResponse={typeResponse}
          setTypeResponse={setTypeResponse}
        />}
      {language === "Japanese" && <ChineseResponseGenerator
          typeResponse={typeResponse}
          setTypeResponse={setTypeResponse}
        />}
      {language === "Vietnamese" && <ChineseResponseGenerator
          typeResponse={typeResponse}
          setTypeResponse={setTypeResponse}
        />}
      </div>
    </>
  );
};
