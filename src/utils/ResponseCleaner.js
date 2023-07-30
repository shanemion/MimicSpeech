export const ResponseCleaner = (response, numSentences) => {
  response = response.trim();
  response = response.replace(/。/g, ".");
  response = response.replace(/!/g, ".");
  response = response.replace(/\?/g, ".");
  response = response.replace(/？/g, ".");
  response = response.replace(/!/g, ".");
  response = response.replace(/！/g, ".");
  response = response.replace(/！/g, ".");


  let lines = response.split('\n');
  let partial = "";

  for (let line of lines) {
    let colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      let titleEnd = line.indexOf(' ', colonIndex);  // find end of the title after colon
      if (titleEnd === -1) { // if there is no space after the colon
        titleEnd = line.length;
      }
      partial += line.substring(titleEnd).trim() + "\n";  // add the rest of the line, without title
    } else {
      partial += line + "\n";  // if there is no colon in the line, just add the whole line
    }
  }

  // remove trailing newline
  partial = partial.trim();

  // Replace newline characters with periods to join sentences properly
  partial = partial.replace(/\n/g, ".");

  // Remove leading numbers from lines using a regular expression
  let real = partial.replace(/\d+\./g, "");

  const sentences = real.split(/[.]/);

  // Remove empty strings (resulting from consecutive periods) and trim each sentence
  const cleanedSentences = sentences
    .filter((sentence) => sentence.trim() !== "")
    .map((sentence) => sentence.trim());

  // Add a normal period at the end of each sentence
  const sentencesWithPeriod = cleanedSentences.map(
    (sentence) => sentence + "."
  );

  console.log("sentencez", sentencesWithPeriod);

  let chineseSentences = sentencesWithPeriod.slice(0, numSentences);
  let pinyinSentences = sentencesWithPeriod.slice(
    numSentences,
    2 * numSentences
  );
  let englishSentences = sentencesWithPeriod.slice(2 * numSentences);

  console.log("chineseSentences", chineseSentences);
  console.log("pinyinSentences", pinyinSentences);
  console.log("englishSentences", englishSentences);

  // Switch back the Chinese periods
  const chineseWithChinesePeriod = chineseSentences.map((sentence) =>
    sentence.replace(/\./g, "。")
  );

  // Return the sentences for each language as an array
  return [chineseWithChinesePeriod, pinyinSentences, englishSentences];
};
