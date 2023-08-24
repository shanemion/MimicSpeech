import React, { useContext } from "react";
import { CiPlay1 } from "react-icons/ci";
import SpeedSlider from "./SpeedSlider";
import Select from "react-select";
import LanguageContext from "../services/language/LanguageContext";

const GenderSelector = () => {
  const { selectedGender, setSelectedGender } = useContext(LanguageContext);

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
  speed,
  setSpeed,
}) => {
  return (
    <div className="tts-and-slider">
      <div className="tts-buttons">
        <button
          className="icon-button"
          onClick={sendToTTS}
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
