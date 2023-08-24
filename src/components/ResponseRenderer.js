import React, { useEffect, useState } from "react"; 
import "../styles.css";

const ResponseRenderer = ({ sentences, selectedPage, setSelectedPage, generatedResponse }) => {
  const [renderedSentences, setRenderedSentences] = useState(null);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

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
            <p className="primary-language">{sentences[0][selectedSentenceIndex]}</p>
            <p className="secondary-language">{sentences[1][selectedSentenceIndex]}</p>
            <p className="third-language">{sentences[2][selectedSentenceIndex]}</p>
          </>
        );
      case "Two":
        return (
          <>
            <p className="primary-language">{sentences[0][selectedSentenceIndex]}</p>
            <p className="secondary-language">{sentences[1][selectedSentenceIndex]}</p>
          </>
        );
      case "Three":
        return (
          <p className="primary-language">{sentences[0][selectedSentenceIndex]}</p>
        );
      default:
        return null;
    }
  };

  const renderRow = (index) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button 
        style={{ marginRight: '50px' }}
        onClick={() => handleSentenceClick(index)}
      >
        Practice
      </button>
      <div>
        <p className="primary-language">{sentences[0][index]}</p>
        {selectedPage !== "Three" && <p className="secondary-language">{sentences[1][index]}</p>}
        {selectedPage === "One" && <p className="third-language">{sentences[2][index]}</p>}
      </div>
    </div>
  );

  const renderSentences = (sentences, selectedPage) => {
    if (selectedPage === "Practice") {
      return (
        <div>
          {renderPracticePage()}
          <button onClick={handleBackClick}   style={{
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '20px'
  }}>Back</button>

        </div>
      );
    }

    return (
      <div>
        {sentences[0].map((_, index) => renderRow(index))}
      </div>
    );
  };

  useEffect(() => {
    setRenderedSentences(renderSentences(sentences, selectedPage));
  }, [generatedResponse, selectedPage]);

  return (
    <div className="center">
      {renderedSentences}
    </div>
  );
};

export default ResponseRenderer;
