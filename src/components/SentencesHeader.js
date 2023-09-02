import React, { useContext } from "react";
import LanguageContext from "../services/language/LanguageContext";

const SentencesHeader = ({
  selectedPage,
  setSelectedPage,
  responseLength,
  handleResponseLengthChange,
  renderedSentencesCount,
  handleRenderedSentencesCountChange,
}) => {
  const { selectedLanguage, fromLanguage } = useContext(LanguageContext);
  const language = selectedLanguage.value;
  const from = fromLanguage.value;

  // create an object to store the three button name options depending on the selected language
  const buttonNames = {
    Chinese: ["Chinese, Pinyin, ", "Chinese and Pinyin", "Chinese"],
    English: ["English", "English"],
    Spanish: ["Spanish", "Spanish"],
    Japanese: ["Japanese, Romaji, ", "Japanese and Romaji", "Japanese"],
    Vietnamese: ["Vietnamese", "Vietnamese"],
    Korean: ["Korean, RR, ", "Korean and RR", "Korean"],
    French: ["French", "French"],
    German: ["German", "German"],
    Italian: ["Italian", "Italian"],
    Russian: ["Russian, RR, ", "Russian and RR", "Russian"],
    Arabic: ["Arabic, Arabizi, ", "Arabic and Arabizi", "Arabic"],
    Hindi: ["Hindi, Romanagari, ", "Hindi and Romanagari", "Hindi"],
    Portuguese: ["Portuguese", "Portuguese"],
  };

  console.log("selectedPage", selectedPage);
  // console.log("selectedLanguage", selectedLanguage);
  // console.log(buttonNames[language][0]);

  return (
    <div className="sentences-header">
      {selectedPage !== "Practice" && (
        <div className="response-options">
          {language !== from && (
            <button
              className={
                selectedPage === "One"
                  ? "response-option-selected"
                  : "response-option"
              }
              onClick={() => {
                setSelectedPage("One");
                localStorage.setItem("selectedPage", "One");
              }}
            >
              {buttonNames[language][0] + " and " + from}
            </button>
          )}
          <button
            className={
              selectedPage === "Two"
                ? "response-option-selected"
                : "response-option"
            }
            onClick={() => {
              setSelectedPage("Two");
              localStorage.setItem("selectedPage", "Two");
            }}
          >
            {buttonNames[language][1]}
          </button>
          {buttonNames[language][2] !== undefined && (
            <button
              className={
                selectedPage === "Three"
                  ? "response-option-selected"
                  : "response-option"
              }
              onClick={() => {
                setSelectedPage("Three");
                localStorage.setItem("selectedPage", "Three");
              }}
            >
              {buttonNames[language][2]}
            </button>
          )}
          <div className="input-container">
            <div className="number-container">
              <input
                type="number"
                id="renderedSentencesCount"
                className="input-number"
                value={renderedSentencesCount}
                onChange={handleRenderedSentencesCountChange}
              />
              <label htmlFor="responseLength" className="input-label">
                / {` ${responseLength} Sentences`}
              </label>
            </div>
          </div>
        </div>
      )}

      {selectedPage === "Practice" && (
        <div className="response-options">Practice Mode</div>
      )}
    </div>
  );
};

export default SentencesHeader;
