import React, { useContext } from "react";
import Select from "react-select";
import LanguageContext from "../services/language/LanguageContext";

import "../styles.css"; // Adjust the path according to your project structure

export const Selectors = ({ typeResponse, setTypeResponse }) => {
  const {
    selectedLanguage,
    setSelectedLanguage,
  } = useContext(LanguageContext);

  const AiAndTypeSelector = () => {
    const modeOptions = [
      { value: false, label: "AI Response" },
      { value: true, label: "Type Response" },
    ];

    const handleChange = (selectedOption) => {
      setTypeResponse(selectedOption.value);
      console.log("Selected Mode:", selectedOption);
    };

    const selectedMode = modeOptions.find(
      (option) => option.value === typeResponse
    );

    return (
      <Select
        className="selectorWidth"
        value={selectedMode}
        onChange={handleChange}
        options={modeOptions}
        placeholder="Choose Response Type"
      />
    );
  };

  const LanguageSelector = () => {
    const languageOptions = [
      { value: "Chinese", label: "Chinese" },
      { value: "English", label: "English" },
      { value: "Spanish", label: "Spanish"},
      { value: "Japanese", label: "Japanese" },
      { value: "Vietnamese", label: "Vietnamese" },
      { value: "Korean", label: "Korean"},
      { value: "French", label: "French"},
      { value: "German", label: "German"},
      { value: "Italian", label: "Italian"},
      { value: "Russian", label: "Russian"},
      { value: "Arabic", label: "Arabic"},
      { value: "Hindi", label: "Hindi"},
      { value: "Portuguese", label: "Portuguese"},
      { value: "Tagalog", label: "Tagalog"}
    ];

    const handleChange = (selectedOption) => {
      setSelectedLanguage(selectedOption);
      console.log("Selected Language:", selectedOption);
    };

    return (
      <Select
        className="selectorWidthRight"
        value={selectedLanguage}
        onChange={handleChange}
        options={languageOptions}
        placeholder="Choose a Language"
      />
    );
  };



  return (
    <div className="selectorContainer">
      <AiAndTypeSelector />
      <LanguageSelector />
    </div>
  );
};
