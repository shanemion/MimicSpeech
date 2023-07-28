import React, { useContext } from "react";
import Select from "react-select";
import LanguageContext from "../services/language/LanguageContext";

import "../styles.css"; // Adjust the path according to your project structure

export const LangAndGenderSelector = () => {
  const { selectedLanguage, setSelectedLanguage, selectedGender, setSelectedGender } = useContext(
    LanguageContext
  );

  const LanguageSelector = () => {
    const languageOptions = [
      { value: "Chinese", label: "Chinese" },
      { value: "English", label: "English" },
      { value: "Japanese", label: "Japanese" },
      { value: "Vietnamese", label: "Vietnamese"},
      // { value: "Burmese", label: "Burmese"}
    ];

    const handleChange = (selectedOption) => {
      setSelectedLanguage(selectedOption);
      console.log("Selected Language:", selectedOption);
    };

    return (
      <Select
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
        value={selectedGender}
        onChange={handleChange}
        options={genderOptions}
        placeholder="Choose a Voice"
      />
    );
  };

  return (
    <div className="selectorContainer">
      <LanguageSelector />
      <GenderSelector />
    </div>
  );
};
