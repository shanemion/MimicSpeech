
const analyzeAudio = async (selectedPage, practiceData, pracSynKey, idToken) => {
  let synthesizedAudioURL;
  if (selectedPage !== "Practice") {
    synthesizedAudioURL = localStorage.getItem("TTS_audio");
    console.log("If Audio URL:", synthesizedAudioURL);
  } else {
    synthesizedAudioURL = practiceData[pracSynKey];
    console.log("Else Audio URL:", synthesizedAudioURL);
  }
  const recordedAudioURL = localStorage.getItem("user_audio_url");
  console.log("Synthesized Audio URL:", synthesizedAudioURL);
  console.log("Recorded Audio URL:", recordedAudioURL);

  if (!synthesizedAudioURL || !recordedAudioURL) {
    console.error("Missing audio URLs");
    return;
  }

  let data;
  if (selectedPage === "Practice") {
    data = {
      synthesized_audio_url: synthesizedAudioURL,
      recorded_audio_url: recordedAudioURL,
    };
  } else {
    data = {
      synthesized_audio_url: synthesizedAudioURL,
      recorded_audio_url: recordedAudioURL,
    };
  }
  console.log("Data:", data);

  try {
    const response = await fetch("http://127.0.0.1:5001/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    if (responseData.error) {
      console.error("Server error:", responseData.error);
      return null; // Return null or some error indication if there's an error
    } else {
      // Handle the pitch data here
      console.log(
        "Synthesized Pitch Data:",
        responseData.synthesized_pitch_data
      );
      console.log("Recorded Pitch Data:", responseData.recorded_pitch_data);
      return responseData; // Return the responseData so it can be used in AnalyzeButton
    }
  } catch (error) {
    console.error("Error sending audio data:", error);
    return null; // Return null or some error indication if there's an exception
  }
};

export default analyzeAudio;
