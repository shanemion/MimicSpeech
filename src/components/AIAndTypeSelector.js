import React, { useState } from "react";
import Select from "react-select";

import "../styles.css"; // Adjust the path according to your project structure

export const AiAndTypeSelector = ({typeResponse, setTypeResponse}) => {

  const modeOptions = [
    { value: false, label: "AI Response" },
    { value: true, label: "Type Own Response" },
  ];

  const handleChange = (selectedOption) => {
    setTypeResponse(selectedOption.value);
    // console.log("Selected Mode:", selectedOption);
  };

  const selectedMode = modeOptions.find(option => option.value === typeResponse);

  return (
    <Select
      className="selectorContainer"
      value={selectedMode}
      onChange={handleChange}
      options={modeOptions}
      placeholder="Choose Response Type"
    />
  );
};
