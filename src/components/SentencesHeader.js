import React from "react";

const SentencesHeader = ({
  selectedPage,
  setSelectedPage,
  responseLength,
  handleResponseLengthChange,
  renderedSentencesCount,
  handleRenderedSentencesCountChange
}) => {
  return (
    <div className="sentences-header">
      {selectedPage !== "Practice" && (
        <div className="response-options">
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
            Chinese, Pinyin, and English
          </button>
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
            Chinese and Pinyin
          </button>
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
            Chinese
          </button>
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
