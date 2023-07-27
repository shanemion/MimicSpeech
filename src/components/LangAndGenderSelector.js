import React, { useContext } from "react";
import Select from "react-select";
import LanguageContext from "../services/language/LanguageContext";

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
        placeholder="Select a language..."
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
        placeholder="Select a gender..."
      />
    );
  };

  return (
    <div>
      <h1>Choose a Language:</h1>
      <LanguageSelector />
      <h1>Choose a Gender:</h1>
      <GenderSelector />
    </div>
  );
};
