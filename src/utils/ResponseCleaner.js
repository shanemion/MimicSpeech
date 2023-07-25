export const ResponseCleaner = (response, numSentences) => {
  response = response.trim();
  response = response.replaceAll("。", ".");
  response = response.replaceAll("!", ".");
  response = response.replaceAll("?", ".");

  const sentences = response.split(/[.！?]/);

  // Remove empty strings (resulting from consecutive periods) and trim each sentence
  const cleanedSentences = sentences
    .filter((sentence) => sentence.trim() !== "")
    .map((sentence) => sentence.trim());

  // Add a normal period at the end of each sentence
  const sentencesWithPeriod = cleanedSentences.map((sentence) => sentence + ".");

  console.log("sentencez", sentencesWithPeriod);

  // Change the const keyword to let
  let chineseSentences = sentencesWithPeriod.slice(0, numSentences);
  let pinyinSentences = sentencesWithPeriod.slice(numSentences, 2 * numSentences);
  let englishSentences = sentencesWithPeriod.slice(2 * numSentences);

  const removeTitle = (sentence) => {
    const colonIndex = sentence.indexOf(":");
    if (colonIndex !== -1) {
      return sentence.slice(colonIndex + 1).trim();
    }
    return sentence.trim();
  };

  chineseSentences = chineseSentences.map(removeTitle);
  pinyinSentences = pinyinSentences.map(removeTitle);
  englishSentences = englishSentences.map(removeTitle);

  // Switch back the Chinese periods
  const chineseWithChinesePeriod = chineseSentences.map((sentence) =>
    sentence.replace(/\./g, "。")
  );

  // Return the sentences for each language as an array
  return [chineseWithChinesePeriod, pinyinSentences, englishSentences];
};
