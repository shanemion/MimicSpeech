const writeWavFile = (base64Audio) => {
    // Decode the base64 string
    // console.log("base64Audio", base64Audio)
    const audioData = atob(base64Audio.split(',')[1]);
    const arrayBuffer = new Uint8Array(audioData.length);
  
    for (let i = 0; i < audioData.length; i++) {
      arrayBuffer[i] = audioData.charCodeAt(i);
    }
  
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob); // Create a Blob URL
  };
  
export default writeWavFile;
