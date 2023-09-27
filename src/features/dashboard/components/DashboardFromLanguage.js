import React, { useContext } from "react";
import Select from "react-select";
import LanguageContext from "../../../services/language/LanguageContext";

const DashboardFromLanguage = () => {
  const { fromLanguage, setFromLanguage } = useContext(LanguageContext);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      // backgroundColor: "#f4f4f4", 
      backgroundColor: "#fff", // match the background color of the sidebar
      padding: "10px 20px",
      borderRadius: "12px", // Reduced for a more modern look
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      borderColor: state.isFocused ? "#A5A5A5" : "#ccc", // Conditional border color
      "&:hover": {
        borderColor: state.isFocused ? "#A5A5A5" : "#ccc", // Hover state
      },
      width: "100%",
      height: "auto",
      fontSize: "16px", // Increased font size for better readabilityß
    }),

    // Dropdown indicator icon
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "#333", // Darker color for better contrast
      transition: "all .2s ease", // Smooth transition for hover and active states
      "&:hover": {
        color: "#555", // Slightly darker on hover
      },
    }),
  };

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
  ];

  const handleChange = (selectedOption) => {
    setFromLanguage(selectedOption);
    // console.log("Selected Language:", selectedOption);
  };

  return (
    <div>
      <label
        style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "40px" }}
      >
        From Language:
      </label>

      <Select
        styles={customStyles}
        // components={{ DropdownIndicator: customDropdownIndicator }}
        value={fromLanguage}
        onChange={handleChange}
        options={languageOptions}
        isSearchable={true}
        placeholder="From Language"
      />
    </div>
  );
};

export default DashboardFromLanguage;
