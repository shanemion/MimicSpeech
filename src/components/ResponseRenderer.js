import React, { useEffect, useState } from "react";
import useWindowSize from "../utils/WindowSize";
import { LiaBookReaderSolid } from "react-icons/lia";

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
}) => {
  const { width } = useWindowSize();
  const [renderedSentences, setRenderedSentences] = useState(null);

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
      case "Two":
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
      {width > 740 &&
        selectedPage !== "Three" &&
        generatedResponse !== "Not enough credits!" && (
          <button
            style={{
              position: "absolute",
              left: "5px",
              top: "20px",
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
        {selectedPage !== "Three" && (
          <p className="secondary-language">{sentences[1][index]}</p>
        )}
        {selectedPage === "One" && (
          <p className="third-language">{sentences[2][index]}</p>
        )}
        {(width <= 740 || selectedPage === "Three") && generatedResponse !== "Not enough credits!" && (
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
