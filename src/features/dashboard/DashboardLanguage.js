import React, { useContext } from "react";
import Select from "react-select";
import LanguageContext from "../../../src/services/language/LanguageContext";

const DashboardLanguage = () => {
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);

  const languageOptions = [
    {
      value: "Chinese",
      label: "Chinese",
    },
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "Arabic", label: "Arabic" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Russian", label: "Russian" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Italian", label: "Italian" },
    { value: "Korean", label: "Korean" },
    { value: "Hindi", label: "Hindi" },
    { value: "Japanese", label: "Japanese" },
    { value: "Vietnamese", label: "Vietnamese" },
    { value: "Tagalog", label: "Tagalog" },
  ];

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    // console.log("Selected Language:", selectedOption);
  };

  return (
    <Select
      className="selectorWidthRight"
      value={selectedLanguage}
      onChange={handleChange}
      options={languageOptions}
      isSearchable={true}
      placeholder="Choose a Language"
    />
  );
};

export default DashboardLanguage;
