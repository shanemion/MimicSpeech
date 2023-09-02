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
      return "en-GB-RyanNeural";
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

  if (language === "Spanish") {
    if (gender === "Man") {
      return "es-ES-AlvaroNeural";
    }
    return "es-ES-ElviraNeural";
  }

  if (language === "Korean") {
    if (gender === "Man") {
      return "ko-KR-InJoonNeural";
    }
    return "ko-KR-SunHiNeural";
  }

  if (language === "French") {
    if (gender === "Man") {
      return "fr-FR-DeniseNeural";
    }
    return "fr-FR-HenriNeural";
  }

  if (language === "German") {
    if (gender === "Man") {

      return "de-DE-ConradNeural";
    }
    return "de-DE-KatjaNeural";

  }

  if (language === "Italian") {
    if (gender === "Man") {
      return "it-IT-DiegoNeural";
    }
    return "it-IT-ElsaNeural";
  }

  if (language === "Russian") {
    if (gender === "Man") {
      return "ru-RU-DmitryNeural";
    }
    return "ru-RU-SvetlanaNeural";
  }

  if (language === "Arabic") {
    if (gender === "Man") {
      return "ar-LB-RamiNeural";
    }
    return "ar-LB-LaylaNeural";
  }

  if (language === "Hindi") {
    if (gender === "Man") {

      return "hi-IN-AaravNeural";
    }
    return "hi-IN-MadhurNeural";
  }

  if (language === "Portuguese") {
    if (gender === "Man") {
      return "pt-BR-FranciscoNeural";
    }
    return "pt-BR-FranciscaNeural";
  }

  console.log("none")
  return null;
};

export default SelectedVoice;
