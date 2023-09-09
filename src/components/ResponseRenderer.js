import React, { useEffect, useState, useContext } from "react";
import useWindowSize from "../utils/WindowSize";
import { LiaBookReaderSolid } from "react-icons/lia";
import LanguageContext from "../services/language/LanguageContext";

import "../styles.css";

const ResponseRenderer = ({
  sentences,
  selectedPage,
  setSelectedPage,
  generatedResponse,
  selectedSentenceIndex,
  setSelectedSentenceIndex,
  previousPage,
  setPreviousPage,
  renderedSentencesCount,
  numLanguages,
}) => {
  const { width } = useWindowSize();
  const [renderedSentences, setRenderedSentences] = useState(null);
  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);
  const toLanguage = selectedLanguage.value;
  const from = fromLanguage.value;

  const handleSentenceClick = (index) => {
    setPreviousPage(selectedPage);
    setSelectedSentenceIndex(index);
    setSelectedPage("Practice");
  };

  const handleBackClick = () => {
    setSelectedSentenceIndex(null);
    setSelectedPage(previousPage);
  };

  const renderPracticePage = () => {
    switch (previousPage) {
      case "One":
        if (from === toLanguage) {
          return (
            <>
              <p className="primary-language">
                {sentences[0][selectedSentenceIndex]}
              </p>
            </>
          );
        } else if (
          toLanguage === "Chinese" ||
          toLanguage === "Japanese" ||
          toLanguage === "Korean" ||
          toLanguage === "Russian" ||
          toLanguage === "Arabic" ||
          toLanguage === "Hindi"
        ) {
          return (
            <>
              <p className="primary-language">
                {sentences[0][selectedSentenceIndex]}
              </p>
              <p className="secondary-language">
                {sentences[1][selectedSentenceIndex]}
              </p>

              <p className="third-language">
                {sentences[2][selectedSentenceIndex]}
              </p>
            </>
          );
        } else if (
          toLanguage === "English" ||
          toLanguage === "Spanish" ||
          toLanguage === "French" ||
          toLanguage === "German" ||
          toLanguage === "Italian" ||
          toLanguage === "Portuguese" ||
          toLanguage === "Vietnamese"
        ) {
          return (
            <>
              <p className="primary-language">
                {sentences[0][selectedSentenceIndex]}
              </p>
              <p className="secondary-language">
                {sentences[1][selectedSentenceIndex]}
              </p>
            </>
          );
        } else {
          return (
            <p className="primary-language">
              {sentences[0][selectedSentenceIndex]}
            </p>
          );
        }

      case "Two":
        if (
          toLanguage === "Chinese" ||
          toLanguage === "Japanese" ||
          toLanguage === "Korean" ||
          toLanguage === "Russian" ||
          toLanguage === "Arabic" ||
          toLanguage === "Hindi"
        ) {
          return (
            <>
              <p className="primary-language">
                {sentences[0][selectedSentenceIndex]}
              </p>
              <p className="secondary-language">
                {sentences[1][selectedSentenceIndex]}
              </p>
            </>
          );
        } else {
          return (
            <p className="primary-language">
              {sentences[0][selectedSentenceIndex]}
            </p>
          );
        }

      case "Three":
        return (
          <p className="primary-language">
            {sentences[0][selectedSentenceIndex]}
          </p>
        );
      default:
        return null;
    }
  };

  const renderRow = (index) => (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {width > 1070 &&
        selectedPage !== "Three" &&
        generatedResponse !== "Not enough credits!" && (
          <button
            style={{
              position: "absolute",
              left: "-50px",
              top: "50px",
              transform: "translateY(-50%)",
            }}
            className="practice-button"
            onClick={() => handleSentenceClick(index)}
          >
            <div className="practice-icon">
              <LiaBookReaderSolid />
            </div>
          </button>
        )}
      <div>
        <p className="primary-language">{sentences[0][index]}</p>
        {selectedPage !== "Three" &&
          toLanguage !== from &&
          (selectedPage !== "Two" ||
            !(
              toLanguage === "English" ||
              toLanguage === "Spanish" ||
              toLanguage === "French" ||
              toLanguage === "German" ||
              toLanguage === "Italian" ||
              toLanguage === "Portuguese" ||
              toLanguage === "Vietnamese"
            )) && <p className="secondary-language">{sentences[1][index]}</p>}
        {selectedPage === "One" &&
          (toLanguage === "Chinese" ||
            toLanguage === "Japanese" ||
            toLanguage === "Korean" ||
            toLanguage === "Russian" ||
            toLanguage === "Arabic" ||
            toLanguage === "Hindi") && (
            <p className="third-language">{sentences[2][index]}</p>
          )}
        {(width <= 1070 || selectedPage === "Three") &&
          generatedResponse !== "Not enough credits!" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <button
                className="practice-button"
                onClick={() => handleSentenceClick(index)}
              >
                <div className="practice-icon">
                  <LiaBookReaderSolid />
                </div>
              </button>
            </div>
          )}
        <div
          style={{
            justifyContent: "center",
          }}
        >
          <hr style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );

  const renderSentences = (sentences, selectedPage) => {
    if (selectedPage === "Practice") {
      return (
        <div>
          {renderPracticePage()}
          <button
            onClick={handleBackClick}
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "20px",
            }}
            className="response-option"
          >
            Back
          </button>
        </div>
      );
    }

    return (
      <div>
        {sentences[0]
          .slice(0, renderedSentencesCount)
          .map((_, index) => renderRow(index))}
      </div>
    );
  };

  useEffect(() => {
    setRenderedSentences(renderSentences(sentences, selectedPage));
  }, [generatedResponse, selectedPage, renderedSentencesCount, width]);

  return <div className="center">{renderedSentences}</div>;
};

export default ResponseRenderer;
