import React, { useContext } from "react";
import Select from "react-select";
import LanguageContext from "../services/language/LanguageContext";

import "../styles.css"; // Adjust the path according to your project structure

export const Selectors = ({ typeResponse, setTypeResponse }) => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedGender,
    setSelectedGender,
  } = useContext(LanguageContext);

  const AiAndTypeSelector = () => {
    const modeOptions = [
      { value: false, label: "AI Response" },
      { value: true, label: "Type Own Response" },
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
      { value: "Japanese", label: "Japanese" },
      { value: "Vietnamese", label: "Vietnamese" },
      // { value: "Burmese", label: "Burmese"}
    ];

    const handleChange = (selectedOption) => {
      setSelectedLanguage(selectedOption);
      console.log("Selected Language:", selectedOption);
    };

    return (
      <Select
        className="selectorWidth"
        value={selectedLanguage}
        onChange={handleChange}
        options={languageOptions}
        placeholder="Choose a Language"
      />
    );
  };

  const GenderSelector = () => {
    const genderOptions = [
      { value: "Man", label: "Man" },
      { value: "Woman", label: "Woman" },
    ];

    const handleChange = (selectedOption) => {
      setSelectedGender(selectedOption);
      console.log("Selected Gender:", selectedOption);
    };

    return (
      <Select
        className="selectorWidth"
        value={selectedGender}
        onChange={handleChange}
        options={genderOptions}
        placeholder="Choose a Voice"
      />
    );
  };

  return (
    <div className="selectorContainer">
      <AiAndTypeSelector />
      <LanguageSelector />
      <GenderSelector />
    </div>
  );
};
