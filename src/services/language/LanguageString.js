
const SelectedVoice = (selectedLanguage, selectedGender) => {
  const language = selectedLanguage.value;
  const gender = selectedGender.value;

  if (language === "Chinese") {
    // console.log("gender",  gender)
    return gender === "Man" ? "zh-CN-YunxiNeural" : "zh-CN-XiaoxiaoNeural";
  }
  if (language === "English") {
    return gender === "Man" ? "en-US-GuyNeural " : "en-US-JennyNeural";
  }
  if (language === "Japanese") {
    return gender === "Man" ? "ja-JP-KeitaNeural" : "ja-JP-NanamiNeural";
  }
  if (language === "Vietnamese") {
    return gender === "Man" ? "vi-VN-NamMinhNeural" : "vi-VN-HoaiMyNeural";
  }
  if (language === "Spanish") {
    return gender === "Man" ? "es-ES-AlvaroNeural" : "es-ES-ElviraNeural";
  }
  if (language === "Korean") {
    return gender === "Man" ? "ko-KR-InJoonNeural" : "ko-KR-SunHiNeural";
  }
  if (language === "French") {
    return gender === "Man" ? "fr-FR-HenriNeural" : "fr-FR-DeniseNeural";
  }
  if (language === "German") {
    return gender === "Man" ? "de-DE-ConradNeural" : "de-DE-KatjaNeural";
  }
  if (language === "Italian") {
    return gender === "Man" ? "it-IT-DiegoNeural" : "it-IT-ElsaNeural";
  }
  if (language === "Russian") {
    return gender === "Man" ? "ru-RU-DmitryNeural" : "ru-RU-SvetlanaNeural";
  }
  if (language === "Arabic") {
    return gender === "Man" ? "ar-LB-RamiNeural" : "ar-LB-LaylaNeural";
  }
  if (language === "Hindi") {
    return gender === "Man" ? "hi-IN-AaravNeural" : "hi-IN-MadhurNeural";
  }
  if (language === "Portuguese") {
    return gender === "Man" ? "pt-BR-FranciscoNeural" : "pt-BR-FranciscaNeural";
  }
  
  // console.log("None");
  return null;
};

export default SelectedVoice;
