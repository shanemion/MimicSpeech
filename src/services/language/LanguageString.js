import React, { useContext } from "react";
import LanguageContext from "./LanguageContext";

const SelectedVoice = (selectedLanguage, selectedGender) => {

  const language = selectedLanguage.value;
  const gender = selectedGender.value;

  if (language === "Chinese") {
    if (gender === "Man") {
      return "zh-CN-YunxiNeural";
    }
    return "zh-CN-XiaoxiaoNeural";
  }

  if (language === "English") {
    if (gender === "Man") {
      return "en-US-TonyNeural";
    }
    console.log("es-US-PalomaNeural")
    return "en-US-JennyNeural";
  }

  if (language === "Japanese") {
    if (gender === "Man") {
      return "ja-JP-KeitaNeural";
    }
    return "ja-JP-NanamiNeural";
  }

  if (language === "Vietnamese") {
    if (gender === "Man") {
      return "vi-VN-NamMinhNeural";
    }
    return "vi-VN-HoaiMyNeural";
  }


  if (language === "Burmese") {
    if (gender === "Man") {
      return "my-MM-ThihaNeural";
    }
    return "my-MM-NilarNeural";
  }


  console.log("none")
  return null;
};

export default SelectedVoice;
