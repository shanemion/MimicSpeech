const GeneratePrompt = ({ fromLanguage, selectedLanguage, userPrompt, responseLength }) => {
    // Define a function to generate the prompt
    const generatePrompt = () => {
      let prompt = "";
      let toLanguage = selectedLanguage.value;
      let origLanguage = fromLanguage.value;
  
      if (toLanguage === "Chinese") {
        prompt = `
          Return a reenactment in simplified Mandarin, pinyin, and ${origLanguage} on ${userPrompt}.
          In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
          The completion should be ${responseLength * 3} sentences long: ${responseLength} sentences in Chinese, then ${responseLength} sentences Pinyin, then ${responseLength} in ${origLanguage}.`;
      } else if (toLanguage === "Korean") {
        prompt = `
            Return a reenactment in Korean, RR, and ${origLanguage} on ${userPrompt}.
            In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
            The completion should be ${responseLength * 3} sentences long: ${responseLength} sentences in Korean, then ${responseLength} sentences in RR, then ${responseLength} in ${origLanguage}.`;
        } else if (toLanguage === "Russian") {
        prompt = `
            Return a reenactment in Russian, RR, and ${origLanguage} on ${userPrompt}.
            In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
            The completion should be ${responseLength * 3} sentences long: ${responseLength} sentences in Russian, then ${responseLength} sentences in RR, then ${responseLength} in ${origLanguage}.`;
        } else if (toLanguage === "Arabic") {
        prompt = `
            Return a reenactment in Arabic, Arabizi, and ${origLanguage} on ${userPrompt}.
            In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
            The completion should be ${responseLength * 3} sentences long: ${responseLength} sentences in Arabic, then ${responseLength} sentences in Arabizi, then ${responseLength} in ${origLanguage}.`;
        } else if (toLanguage === "Hindi") {
        prompt = `
            Return a reenactment in Hindi, Romanagari, and ${origLanguage} on ${userPrompt}.
            In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
            The completion should be ${responseLength * 3} sentences long: ${responseLength} sentences in Hindi, then ${responseLength} sentences in Romanagari, then ${responseLength} in ${origLanguage}.`;
        } else if (toLanguage === "Japanese") {
        prompt = `
            Return a reenactment in Japanese, Romaji, and ${origLanguage} on ${userPrompt}.
            In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
            The completion should be ${responseLength * 3} sentences long: ${responseLength} sentences in Japanese, then ${responseLength} sentences in Romaji, then ${responseLength} in ${origLanguage}.`;
        }
      else if (selectedLanguage.value === fromLanguage.value) {
        prompt = `
            Return a reenactment in ${toLanguage} on ${userPrompt}.
            In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
            The completion should have the following structure: ${responseLength} sentences in ${toLanguage}.`;
        }
      else {
        prompt = `
          Return a reenactment in ${toLanguage} and ${origLanguage} on ${userPrompt}.
          In your response, make the sentences fluid and humanlike. Avoid using overly complex grammar patterns and semicolons.
          The completion should have the following structure: ${responseLength} sentences in ${toLanguage}, then ${responseLength} sentences in ${origLanguage}.`;
      }

      console.log("prompt", prompt)
  
      return prompt;
    };
  
    // Generate the prompt
    const prompt = generatePrompt();

    console.log("prompt", prompt)
  
    // You can either return the prompt directly or use it in your component logic
    return prompt;
  };
  
  export default GeneratePrompt;
  