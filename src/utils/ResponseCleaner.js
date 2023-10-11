const isChinese = (str) => {
  const re = /^[\u4e00-\u9fa5.,:;!?'"“”()。、，・！？：；「」『』（）《》0-9·]+$/;

  let matchingChars = 0;
  
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }

  // Calculate percentage of matching characters
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};


const isEnglish = (str) => {
  const re = /^[a-zA-Z .,:;!?'"()0-9\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }

  // Calculate percentage of matching characters
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};


// Spanish
const isSpanish = (str) => {
  const re = /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ .,:;!?'"()¿¡\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }

  // Calculate percentage of matching characters
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};


// Japanese
const isJapanese = (str) => {
  const re = /^[\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF .,:;!?'"()。、，《》0-9・！？：；「」『』（）·\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }

  // Calculate percentage of matching characters
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};


// Vietnamese
const isVietnamese = (str) => {
  const re = /^[a-zA-ZàảãáạăằẳẵắặâầẩẫấậđèéẻẽẹêềểễếệìíỉĩịòóỏõọôồốổỗộơờởỡớợùúủũụưừứửữựỳýỷỹỵÁÀẢÃẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈÉẺẼẸÊỀỂỄẾỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỞỠỚỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ.,;:?!'\"()“”。，《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }

  // Calculate percentage of matching characters
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};


// Korean
const isKorean = (str) => {
  const re = /^[\uAC00-\uD7A3 .,:;!?'"()、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }

  // Calculate percentage of matching characters
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};

// French
const isFrench = (str) => {
  const re = /^[a-zA-Zàâçéèêëîïôûùüÿœæ .,:;!?'"()«»、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;
  
  let matchingChars = 0;
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};

// German
const isGerman = (str) => {
  const re = /^[a-zA-Zäöüß .,:;!?'"()„“、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;
  
  let matchingChars = 0;
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};

// Italian
const isItalian = (str) => {
  const re = /^[a-zA-Zàèéìíòóùú .,:;!?'"()、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;
  
  let matchingChars = 0;
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};


// Russian
const isRussian = (str) => {
  const re = /^[а-яА-ЯёЁ .,:;!?'"()、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};

// Arabic
const isArabic = (str) => {
  const re = /^[\u0600-\u06FF .,:;!?'"()،؛؟、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};

// Hindi
const isHindi = (str) => {
  const re = /^[\u0900-\u097F .,:;!?'"()।॥、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};

// Portuguese
const isPortuguese = (str) => {
  const re = /^[a-zA-Záâãàçéêíóôõóúü .,:;!?'"()、。《》0-9·\-_@#$%^&*+=[\]{}|<>\\/]+$/;

  let matchingChars = 0;
  for (let char of str) {
    if (re.test(char)) {
      matchingChars++;
    }
  }
  const percentage = (matchingChars / str.length) * 100;
  return percentage >= 90;
};


export const ResponseCleaner = (
  response,
  numSentences,
  numLanguages,
  selectedLanguage,
  fromLanguage
) => {
  let toLanguage = selectedLanguage.value;
  let origLanguage = fromLanguage.value;

  response = response.trim();
  response = response.replace(
    /中文：|拼音：|English:|Japanese: |Romaji: |第一句：|第二句：|第三句：/g,
    ""
  );
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
  // console.log("cleaned", cleanedSentences);
  let sentencesWithPeriod = cleanedSentences.map((sentence) => sentence + ".");
  // let realLength = 0;
  // for (let i = 0; i < sentencesWithPeriod.length; i++) {
  //   if (sentencesWithPeriod[i] === ".") {
  //     realLength += 1;
  //   }
  // }

  let realLength = cleanedSentences.length;


  // console.log("real", realLength);

  sentencesWithPeriod = sentencesWithPeriod.slice(0, realLength);
  console.log("realLength", realLength);
  console.log("sentencez", sentencesWithPeriod);
  const allChinese = sentencesWithPeriod
    .slice(0, realLength / 3)
    .every(isChinese);
    console.log("allChinese", allChinese);

  const allEnglish = sentencesWithPeriod
  .slice(0, realLength / 3)
  .every(isEnglish);

  const allJapanese = sentencesWithPeriod
  .slice(0, realLength / 3)
  .every(isJapanese);

  const allKorean = sentencesWithPeriod.slice(0, realLength / 3).every(isKorean);

  const allRussian = sentencesWithPeriod
    .slice(0, numSentences)
    .every(isRussian);

  const allArabic = sentencesWithPeriod.slice(0, realLength / 3).every(isArabic);

  const allHindi = sentencesWithPeriod.slice(0, realLength / 3).every(isHindi);

  const allPortuguese = sentencesWithPeriod
    .slice(0, realLength / 3)
    .every(isPortuguese);

  const allFrench = sentencesWithPeriod.slice(0, realLength / 3).every(isFrench);

  const allGerman = sentencesWithPeriod.slice(0, realLength / 3).every(isGerman);

  const allItalian = sentencesWithPeriod
    .slice(0, realLength / 3)
    .every(isItalian);

  const allSpanish = sentencesWithPeriod
    .slice(0, realLength / 3)
    .every(isSpanish);

  const allVietnamese = sentencesWithPeriod
    .slice(0, realLength / 3)
    .every(isVietnamese);

  const removeCommas = (sentence) => {
    const replacedStr = sentence.replace(/[，،,]/g, ".");
    const splitSentences = replacedStr.split(".").filter(Boolean); // filter(Boolean) removes empty strings
    const sentencesWithPeriods = splitSentences.map((s) => s.trim() + "."); // Add period back to each sentence
    return sentencesWithPeriods;
  };

  if (numSentences === 1 && sentencesWithPeriod.length <= 1) {
    // console.log("sentenceswithperiod", sentencesWithPeriod);
    sentencesWithPeriod = removeCommas(sentencesWithPeriod[0]);
    // console.log("sentenceswithoutcommas", sentencesWithPeriod);
  }

  if (
    sentencesWithPeriod.length === numSentences / 3 ||
    sentencesWithPeriod.length === numSentences / 2
  ) {
    // Applying removeCommas on each sentence and flattening the array
    sentencesWithPeriod = sentencesWithPeriod.flatMap((sentence) =>
      removeCommas(sentence)
    );
  }

  // console.log(sentencesWithPeriod.length);  // Should log the length of the array, expected to be 9 for your example

  if (allChinese) {
    // Variant format
    const primarySentences = sentencesWithPeriod.slice(0, realLength / 3);
    const secondarySentences = sentencesWithPeriod.slice(
      realLength / 3,
      (2 * realLength) / 3
    );
    const thirdSentences = sentencesWithPeriod.slice(
      (2 * realLength) / 3,
    );
    let sentences = [primarySentences, secondarySentences, thirdSentences];
    // console.log("sentencesChineseFilter", sentences);
    return sentences;
  } else if (
    allEnglish ||
    allJapanese ||
    allKorean ||
    allRussian ||
    allArabic ||
    allHindi ||
    allPortuguese ||
    allFrench ||
    allGerman ||
    allItalian ||
    allSpanish ||
    allVietnamese
  ) {
    // Expected format
    // const groupedSentences = [];

    if (
      toLanguage === "Chinese" ||
      toLanguage === "Japanese" ||
      toLanguage === "Korean" ||
      toLanguage === "Russian" ||
      toLanguage === "Arabic" ||
      toLanguage === "Hindi"
    ) {
      const primarySentences = sentencesWithPeriod.slice(0, realLength / 3);
      const secondarySentences = sentencesWithPeriod.slice(
        realLength / 3,
        (2 * realLength) / 3
      );
      const thirdSentences = sentencesWithPeriod.slice(
        (2 * realLength) / 3,
      );
      let sentences = [primarySentences, secondarySentences, thirdSentences];
      // console.log("sentencesChineseFilter", sentences);
      return sentences;
    } else if (toLanguage === origLanguage) {
      const primarySentences = sentencesWithPeriod.slice(0, realLength);

      let sentences = [primarySentences];
      // console.log("sentencesChineseFilter", sentences);
      return sentences;
    } else {
      const primarySentences = sentencesWithPeriod.slice(0, realLength / 2);
      const secondarySentences = sentencesWithPeriod.slice(
        realLength / 2,
      );

      let sentences = [primarySentences, secondarySentences];
      // console.log("sentencesChineseFilter", sentences);
      return sentences;
    }
  } else {
    const groupedSentences = [];

    if (
      toLanguage === "Chinese" ||
      toLanguage === "Japanese" ||
      toLanguage === "Korean" ||
      toLanguage === "Russian" ||
      toLanguage === "Arabic" ||
      toLanguage === "Hindi"
    ) {
      for (let i = 0; i < sentencesWithPeriod.length; i += 3) {
        groupedSentences.push([
          sentencesWithPeriod[i],
          sentencesWithPeriod[i + 1],
          sentencesWithPeriod[i + 2],
        ]);
      }
      const primarySentences = groupedSentences.map((group) => group[0]);
      const secondarySentences = groupedSentences.map((group) => group[1]);
      const thirdSentences = groupedSentences.map((group) => group[2]);

      let sentences = [primarySentences, secondarySentences, thirdSentences];

      // console.log("sentencesChineseThreeL", sentences);
      return sentences;
    } else if (toLanguage === origLanguage) {
      for (let i = 0; i < sentencesWithPeriod.length; i += 3) {
        groupedSentences.push([sentencesWithPeriod[i]]);
      }
      const primarySentences = groupedSentences.map((group) => group[0]);
      let sentences = [primarySentences];

      // console.log("sentencesEqual", sentences);

      return sentences;
    } else {
      for (let i = 0; i < sentencesWithPeriod.length; i += 3) {
        groupedSentences.push([
          sentencesWithPeriod[i],
          sentencesWithPeriod[i + 1],
        ]);
      }
      const primarySentences = groupedSentences.map((group) => group[0]);
      const secondarySentences = groupedSentences.map((group) => group[1]);
      let sentences = [primarySentences, secondarySentences];

      // console.log("sentencesTwoL", sentences);
      return sentences;
    }
  }
};
