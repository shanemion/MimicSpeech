import React from "react";

const ResponseRenderer = ({ sentences, selectedPage }) => {
  const renderSentences = () => {
    switch (selectedPage) {
      case "One":
        // sentences[0] is the list that needs to be read by TTS
        console.log("sentences[0]", sentences[0])
        return <div>{sentences[0].map((sentence) => <p>{sentence}</p>)}</div>;
      case "Two":
        return (
          <div>
            {sentences[0].map((sentence, index) => (
              <div>
                <p>{sentence}</p>
                <p>{sentences[1][index]}</p>
              </div>
            ))}
          </div>
        );
      case "Three":
        return (
          <div>
            {sentences[0].map((sentence, index) => (
              <div>
                <p>{sentence}</p>
                <p>{sentences[1][index]}</p>
                <p>{sentences[2][index]}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Render the sentences based on the selected page */}
      {renderSentences()}
    </div>
  );
};

export default ResponseRenderer;
