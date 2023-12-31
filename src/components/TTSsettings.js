import React, { useContext, useEffect } from "react";
import { CiPlay1 } from "react-icons/ci";
import SpeedSlider from "./SpeedSlider";
import Select from "react-select";
import LanguageContext from "../services/language/LanguageContext";

const GenderSelector = () => {
  const { selectedGender, setSelectedGender } = useContext(LanguageContext);

  useEffect(() => {
    // console.log("useEffect", selectedGender);
  }, [selectedGender]);

  const genderOptions = [
    { value: "Man", label: "Man" },
    { value: "Woman", label: "Woman" },
  ];

  const handleChange = (selectedOption) => {
    // console.log("Selected Option:", selectedOption)
    setSelectedGender(selectedOption);
    // console.log("Selected Gender:", selectedOption);
  };

  return (
    <Select
      className="gender-selector"
      value={selectedGender}
      onChange={handleChange}
      options={genderOptions}
      placeholder="Choose a Voice"
    />
  );
};

export const TTSsettings = ({
  sendToTTS,
  isPlayButtonDisabled,
  setIsPlayButtonDisabled,
  speed,
  setSpeed,
}) => {
  return (
    <div className="tts-and-slider">
      <div className="tts-buttons">
        <button
          className="icon-button"
          onClick={() => {
       
            sendToTTS();
            setIsPlayButtonDisabled(true);
            setTimeout(() => {
              setIsPlayButtonDisabled(false);
            }, 1500);
            
          }}
          disabled={isPlayButtonDisabled}
        >
        <div className="inside-icon-button">
          <div className="play-icon">
            <CiPlay1 />
          </div>
          <div style={{ fontSize: "1.2em" }}>Play</div>
        </div>
      </button>
      <GenderSelector />
      </div>
      <SpeedSlider speed={speed} setSpeed={setSpeed} />
    </div>
  );
};
