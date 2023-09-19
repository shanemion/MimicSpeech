import React, { useState, useContext, useEffect } from "react";
import GenerateHeader from "../../header/GenerateHeader";
import { Selectors } from "../../../../components/Selectors";
import useWindowSize from "../../../../utils/WindowSize";
import Bookmark from "../../../../components/Bookmark";
import LanguageContext from "../../../../services/language/LanguageContext";
import { AiOutlineSend, AiOutlineClose } from "react-icons/ai";
import { CgOptions } from "react-icons/cg";
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
  isGPTLoading,
}) => {
  const { width } = useWindowSize();
  const { typedResponse } = useContext(LanguageContext);
  const [isExpanded, setIsExpanded] = useState(true); // State for expanded/collapsed settings
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [shouldCollapse, setShouldCollapse] = useState(false);

  useEffect(() => {
    if (shouldCollapse) {
        setShowPlaceholder(false);
        setShouldCollapse(false); // Reset so it can be expanded again later
    }
  }, [shouldCollapse]);

  return (
    <div>
      <GenerateHeader
        typeResponse={typeResponse}
        setTypeResponse={setTypeResponse}
      />
      <div style={{ height: "15px" }}></div>
      <div
        className={`options-outlined-container ${
          isExpanded ? "expanded-container" : ""
        }`}
      >
        <div className={isExpanded ? "overlay" : ""}>
          <div className="bookmark">
            {generatedResponse && (
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
          <button
            className="toggle-expand"
            onClick={() => {
              if (isExpanded) {
                setShouldCollapse(true); // Explicitly collapsing, so set shouldCollapse to true
              } else {
                setShowPlaceholder(true); // Only expand if it is not already expanded
              }
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <AiOutlineClose /> : <CgOptions />}
          </button>
          {isExpanded && (
            <div className="center">
              <Selectors
                className="selectors"
                typeResponse={typeResponse}
                setTypeResponse={setTypeResponse}
              />
            </div>
          )}

          <div className="center">
            <div className="inputs">
              <div className="prompt-input">
                <label htmlFor="prompt" className="input-label">
                  Enter a topic!
                </label>
                <input
                  className="styled-input"
                  type="text"
                  id="prompt"
                  value={userPrompt}
                  onChange={handlePromptChange}
                  placeholder="Type your topic here"
                />
              </div>
              {!isExpanded && (
                <button
                  className={
                    isGPTLoading ? "small-generate-disabled" : "small-generate"
                  }
                  disabled={isGPTLoading}
                  onClick={() => {handleGenerateResponse(); setShouldCollapse(true)}}
                >
                  <AiOutlineSend />
                </button>
              )}

              {isExpanded && (
                <div className="response-length-input">
                  <label htmlFor="response-length" className="input-label">
                    Sentences:
                  </label>
                  <input
                    className="styled-input"
                    type="number"
                    id="responseLength"
                    value={responseLength}
                    onChange={handleResponseLengthChange}
                    placeholder="Enter number of sentences"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="vertical">
            <div className="button-container">
              {isExpanded && (
                <>
                  <button
                    className={isGPTLoading ? "generate-disabled" : "generate"}
                    onClick={() => {
                      handleGenerateResponse();
                      setShowPlaceholder(false);

                      setIsExpanded(false);
                    }}
                    disabled={isGPTLoading}
                  >
                    {isGPTLoading ? (
                      "Scenario Generating..."
                    ) : (
                      <>
                        Generate Scenario
                        <span
                          style={{
                            marginLeft: "8px",
                            verticalAlign: "middle",
                            position: "relative",
                            top: ".7px",
                          }}
                        >
                          <AiOutlineSend />
                        </span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
            <span className="generator-credits">{credits} credits</span>
          </div>
        </div>
      </div>
      <div className={`placeholder ${showPlaceholder ? "expanded" : "collapsed"}`}></div>
    </div>
  );
};

export default GenerateOptions;
