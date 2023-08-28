import React, { useMemo } from "react";
import FlagSlideshow from './FlagSlideshow';
import "./Language.css";

const languages = [
    { name: "English", text: "Learn English", isRoman: true },
    { name: "Simplified Mandarin Chinese", text: "学习中文", isRoman: false },
    { name: "Spanish", text: "Aprende Español", isRoman: true },
    { name: "Arabic", text: "تعلم العربية", isRoman: false },
    { name: "French", text: "Apprenez le Français", isRoman: true },
    { name: "German", text: "Lerne Deutsch", isRoman: true },
    { name: "Italian", text: "Impara l'Italiano", isRoman: true },
    { name: "Korean", text: "한국어 배우기", isRoman: false },
    { name: "Hindi", text: "हिंदी सीखें", isRoman: false },
    { name: "Japanese", text: "日本語を学ぶ", isRoman: false },
    { name: "Vietnamese", text: "Học Tiếng Việt", isRoman: true },
    { name: "Tagalog", text: "Matutong Magtagalog", isRoman: true },
  ];

const generatePositions = () => {
  const newPositions = [];
  let lastPosition = 0;

  for (let i = 0; i < languages.length; i++) {
    let newPosition = Math.random() * 100;
    while (Math.abs(newPosition - lastPosition) < 15) {
      newPosition = Math.random() * 100;
    }
    newPositions.push(newPosition);
    lastPosition = newPosition;
  }

  return newPositions;
};

const Language = () => {
  const positions = useMemo(generatePositions, []);

  return (
    <div className="language-container">
      <FlagSlideshow />
      {languages.map((language, index) => (
        <span
          className={`language-text ${language.isRoman ? "italic" : ""}`}
          style={{ '--top': `${positions[index]}%`, '--delay': `${index}s`, '--left': `-${50 + index * 10}%` }}
          key={index}
        >
          {language.text}
        </span>
      ))}
    </div>
  );
};

export default Language;
