const isChinese = (str) => {
  const re = /^[\u4e00-\u9fa5。.，:.]+$/; // Added the English period (.) and colon (:)
  return re.test(str);
};

export const ResponseCleaner = (response, numSentences) => {
  response = response.trim();
  response = response.replace(/。/g, ".");
  response = response.replace(/!/g, ".");
  response = response.replace(/\?/g, ".");
  response = response.replace(/？/g, ".");
  response = response.replace(/!/g, ".");
  response = response.replace(/！/g, ".");
  response = response.replace(/！/g, ".");
  response = response.replace(/！/g, ".");
  response = response.replace(/；/g, ".");
  response = response.replace(/;/g, ".");
  response = response.replace(/：/g, ":");

  let lines = response.split("\n");
  let partial = "";

  for (let line of lines) {
    let colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      let titleEnd = line.indexOf(" ", colonIndex); // find end of the title after colon
      if (titleEnd === -1) {
        // if there is no space after the colon
        titleEnd = line.length;
      }
      partial += line.substring(titleEnd).trim() + "\n"; // add the rest of the line, without title
    } else {
      partial += line + "\n"; // if there is no colon in the line, just add the whole line
    }
  }
  // remove trailing newline
  partial = partial.trim();
  // // Replace newline characters with periods to join sentences properly
  partial = partial.replace(/\n/g, ".");
  // Remove leading numbers from lines using a regular expression
  let real = partial.replace(/\d+\./g, "");
  const sentences = real.split(/[.]/);
  // Remove empty strings (resulting from consecutive periods) and trim each sentence
  const cleanedSentences = sentences
    .filter((sentence) => sentence.trim() !== "")
    .map((sentence) => sentence.trim());
  // Add a normal period at the end of each sentence
  let sentencesWithPeriod = cleanedSentences.map((sentence) => sentence + ".");
  sentencesWithPeriod = sentencesWithPeriod.slice(0, numSentences * 3);
  // console.log("sentencez", sentencesWithPeriod);
  const allChinese = sentencesWithPeriod
    .slice(0, numSentences)
    .every(isChinese);

  if (allChinese) {
    // Variant format
    const chineseSentences = sentencesWithPeriod.slice(0, numSentences);
    const pinyinSentences = sentencesWithPeriod.slice(
      numSentences,
      2 * numSentences
    );
    const englishSentences = sentencesWithPeriod.slice(
      2 * numSentences,
      3 * numSentences
    );
    return [chineseSentences, pinyinSentences, englishSentences];
  } else {
    // Expected format
    const groupedSentences = [];
    for (let i = 0; i < sentencesWithPeriod.length; i += 3) {
      groupedSentences.push([
        sentencesWithPeriod[i],
        sentencesWithPeriod[i + 1],
        sentencesWithPeriod[i + 2],
      ]);
    }
    const chineseSentences = groupedSentences.map((group) => group[0]);
    const pinyinSentences = groupedSentences.map((group) => group[1]);
    const englishSentences = groupedSentences.map((group) => group[2]);
    return [chineseSentences, pinyinSentences, englishSentences];
  }
};
