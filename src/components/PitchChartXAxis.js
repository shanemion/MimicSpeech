import { useContext } from "react";
import LanguageContext from "../services/language/LanguageContext";

const isPunctuation = (str, language) => {
  let punctuationRe;

  switch (language) {
    case "Chinese":
      punctuationRe = /[.,，:;!?'"()。、・！？：；「」『』（）]/;
      break;
    case "English":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "Spanish":
      punctuationRe = /[.,，:;!?'"()¿¡]/;
      break;
    case "Japanese":
      punctuationRe = /[.,，:;!?'"()。、・！？：；「」『』（）]/;
      break;
    case "Vietnamese":
      punctuationRe = /[.,，;:?!'\"()“”]/;
      break;
    case "Korean":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "French":
      punctuationRe = /[.,，:;!?'"()«»]/;
      break;
    case "German":
      punctuationRe = /[.,，:;!?'"()„“]/;
      break;
    case "Italian":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "Russian":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "Arabic":
      punctuationRe = /[.,，:;!?'"()،؛؟]/;
      break;
    case "Hindi":
      punctuationRe = /[.,，:;!?'"()।॥]/;
      break;
    case "Portuguese":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    default:
      punctuationRe = /[.,，:;!?'"()]/;
  }

  return punctuationRe.test(str);
};

const stripPunctuation = (str, language) => {
  let punctuationRe;

  switch (language) {
    case "Chinese":
      punctuationRe = /[.,，:;!?'"()。、・！？：；「」『』（）]/g;
      break;
    case "English":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "Spanish":
      punctuationRe = /[.,，:;!?'"()¿¡]/;
      break;
    case "Japanese":
      punctuationRe = /[.,，:;!?'"()。、・！？：；「」『』（）]/;
      break;
    case "Vietnamese":
      punctuationRe = /[.,，;:?!'\"()“”]/;
      break;
    case "Korean":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "French":
      punctuationRe = /[.,，:;!?'"()«»]/;
      break;
    case "German":
      punctuationRe = /[.,，:;!?'"()„“]/;
      break;
    case "Italian":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "Russian":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    case "Arabic":
      punctuationRe = /[.,，:;!?'"()،؛؟]/;
      break;
    case "Hindi":
      punctuationRe = /[.,，:;!?'"()।॥]/;
      break;
    case "Portuguese":
      punctuationRe = /[.,，:;!?'"()]/;
      break;
    default:
      punctuationRe = /[.,，:;!?'"()]/g;
  }

  return str.replace(new RegExp(punctuationRe, "g"), "");
};

const filterPunctuation = (labels, language) => {
    return labels.map((label) => stripPunctuation(label, language));
  };

export const PitchChartXAxis = ({
  selectedPage,
  renderedSentencesCount,
  mainString,
  selectedLanguage,
}) => {
  const toLanguage = selectedLanguage.value;

  let labels = [];

  if (selectedPage === "One") {
    for (let i = 0; i < renderedSentencesCount; i++) {
      labels.push(i + 1);
    }
    labels.push(" ");
  } else if (toLanguage === "Chinese") {
    labels = Array.from(mainString);
    console.log(labels);
    labels = filterPunctuation(labels, toLanguage);
    console.log(labels);
    labels.push(" ");
  } else {
    labels = mainString.split(" ");
    labels = filterPunctuation(labels, toLanguage); // You can determine the actual language here
    labels.push(" ");
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          width: "80vw",
          padding: "0px 0px 10px 70px",
        }}
      >
        {labels.map((label, index) => (
          <div key={index}>{label}</div>
        ))}
      </div>

      {selectedPage === "One" ? (
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            width: "80vw",
            padding: "5px 0px 10px 70px",
            color: "grey",
            fontSize: "0.8rem",
          }}
        >
          Sentence
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            width: "80vw",
            padding: "5px 0px 10px 70px",
            color: "grey",
            fontSize: "0.8rem",

          }}
        >
          {toLanguage === "Chinese" ? "Character" : "Word"}
        </div>
      )}
    </div>
  );
};
