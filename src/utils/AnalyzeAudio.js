import { select } from "d3";

const analyzeAudio = async (selectedPage) => {
    const synthesizedAudioURL = localStorage.getItem("TTS_audio_url");
    const recordedAudioURL = localStorage.getItem("user_audio_url");
    const synthesizedPracticeAudioURL = localStorage.getItem("TTS_practice_audio_url");
    const recordedPracticeAudioURL = localStorage.getItem("user_practice_audio_url");

    // console.log("Synthesized Audio URL:", synthesizedAudioURL);
    // console.log("Recorded Audio URL:", recordedAudioURL);
    // console.log("Synthesized Practice Audio URL:", synthesizedPracticeAudioURL);
    // console.log("Recorded Practice Audio URL:", recordedPracticeAudioURL);

    if (!synthesizedAudioURL || !recordedAudioURL) {
      console.error("Missing audio URLs");
      return;
    }
    
    let data;
    if (selectedPage === "Practice") {
     data = {
        synthesized_audio_url: synthesizedAudioURL,
        recorded_audio_url: recordedAudioURL,
    }} else {
        data = {
            synthesized_audio_url: synthesizedAudioURL,
            recorded_audio_url: recordedAudioURL,
        };
    }
    console.log("Data:", data)
  
    try {
        const response = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.error) {
            console.error("Server error:", responseData.error);
            return null; // Return null or some error indication if there's an error
        } else {
            // Handle the pitch data here
            console.log("Synthesized Pitch Data:", responseData.synthesized_pitch_data);
            console.log("Recorded Pitch Data:", responseData.recorded_pitch_data);
            return responseData; // Return the responseData so it can be used in AnalyzeButton
        }
    } catch (error) {
        console.error("Error sending audio data:", error);
        return null; // Return null or some error indication if there's an exception
    }
};

export default analyzeAudio;
