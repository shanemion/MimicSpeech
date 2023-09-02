import React, { useContext } from "react";

import LanguageContext from "../../services/language/LanguageContext";
import CompletionGenerator from "../../features/generate-page/generators/CompletionGenerator";

export const Navigator = ({ typeResponse, setTypeResponse, userPrompt, setUserPrompt, responseLength, setResponseLength }) => {
  const { selectedLanguage } = useContext(LanguageContext);

  if (!selectedLanguage) {
    return null; // or return a loading spinner
  }
  const language = selectedLanguage.value;

  return (
    <>
      <div>
   
        <CompletionGenerator
          typeResponse={typeResponse}
          setTypeResponse={setTypeResponse}
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          responseLength={responseLength}
          setResponseLength={setResponseLength}
        />
      

      </div>
    </>
  );
};
