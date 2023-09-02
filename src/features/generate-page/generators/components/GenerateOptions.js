import React, { useContext } from "react";
import GenerateHeader from "../../header/GenerateHeader";
import { Selectors } from "../../../../components/Selectors";
import useWindowSize from "../../../../utils/WindowSize";
import Bookmark from "../../../../components/Bookmark";
import LanguageContext from "../../../../services/language/LanguageContext";
import "./GenerateOptions.css";

const GenerateOptions = ({
  typeResponse,
  setTypeResponse,
  userPrompt,
  handlePromptChange,
  responseLength,
  handleResponseLengthChange,
  handleGenerateResponse,
  generatedResponse,
  selectedLanguage,
  credits,
  isGPTLoading
}) => {
  const { width } = useWindowSize();
  const { typedResponse, setTypedResponse } = useContext(LanguageContext);
  return (
    <div>
      <GenerateHeader
        typeResponse={typeResponse}
        setTypeResponse={setTypeResponse}
      />
      
        <div className="center">
          <Selectors
            className="selectors"
            typeResponse={typeResponse}
            setTypeResponse={setTypeResponse}
          />
        </div>
      
      {!typeResponse && (
        <div className="center">
          <div className="inputs">
            <div className="prompt-input">
              <label htmlFor="prompt">Enter a topic!:</label>
              <input
                type="text"
                id="prompt"
                value={userPrompt}
                onChange={handlePromptChange}
              />
            </div>
            <div className="response-length-input">
              <label htmlFor="respone-length"># Sentences:</label>
              <input
                type="number"
                id="responseLength"
                value={responseLength}
                onChange={handleResponseLengthChange}
              />
            </div>
          </div>
        </div>
      )}
      <div className="center">
        <div className="button-container">
          {!typeResponse && (
            <div>
              <span className="generator-credits">{credits} credits </span>
              <button
                className={isGPTLoading ? "generate-disabled" : "generate"}
                onClick={handleGenerateResponse}
                disabled={isGPTLoading}
              >
                {isGPTLoading ? "Scenario Generating..." : "Generate Scenario"}
              </button>
            </div>
          )}
          {generatedResponse && !typeResponse && (
            <Bookmark
              typeResponse={typeResponse}
              typedResponse={typedResponse}
              generatedResponse={generatedResponse}
              language={selectedLanguage}
              userPrompt={userPrompt}
              responseLength={responseLength}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateOptions;
