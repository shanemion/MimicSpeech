import React, { useEffect, useState } from "react"; 
import "../styles.css";

const ResponseRenderer = ({ sentences, selectedPage, newResponse }) => {
  const [renderedSentences, setRenderedSentences] = useState(null);

  const renderSentences = (sentences, selectedPage) => {
    switch (selectedPage) {
      case "One":
        return (
          <div>
            {sentences[0].map((sentence, index) => (
              <div>
                <p className="primary-language">{sentence}</p>
                <p className="secondary-language">{sentences[1][index]}</p>
                <p className="third-language">{sentences[2][index]}</p>
              </div>
            ))}
          </div>
        );
      case "Two":
        return (
          <div>
            {sentences[0].map((sentence, index) => (
              <div>
                <p className="primary-language">{sentence}</p>
                <p className="secondary-language">{sentences[1][index]}</p>
              </div>
            ))}
          </div>
        );
      case "Three":
        return (
          <div>
            {sentences[0].map((sentence) => (
              <p className="primary-language">{sentence}</p>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    setRenderedSentences(renderSentences(sentences, selectedPage));
  }, [newResponse, selectedPage]);

  return (
    <div className="center">
      {renderedSentences}
    </div>
  );
};

export default ResponseRenderer;
