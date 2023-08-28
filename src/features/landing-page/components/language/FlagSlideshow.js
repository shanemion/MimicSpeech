import React, { useState } from "react";
import china from "./flags/china.png";
import usa from "./flags/unitedstates.png";
import mexico from "./flags/mexico.png";
import lebanon from "./flags/lebanon.png";
import france from "./flags/france.png";
import germany from "./flags/germany.png";
import italy from "./flags/italy.png";
import southkorea from "./flags/south-korea.png";
import india from "./flags/india.png";
import japan from "./flags/japan.png";
import vietnam from "./flags/vietnam.png";
import philippines from "./flags/philippines.png";

import "./FlagSlideshow.css";

const FlagSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const languages = [
    { name: "English", flagUrl: usa, country: "the United States" },
    { name: "Simplified Mandarin Chinese", flagUrl: china, country: "China" },
    { name: "Spanish", flagUrl: mexico, country: "Mexico" },
    { name: "Arabic", flagUrl: lebanon, country: "Lebanon" },
    { name: "French", flagUrl: france, country: "France" },
    { name: "German", flagUrl: germany, country: "Germany" },
    { name: "Italian", flagUrl: italy, country: "Italy" },
    { name: "Korean", flagUrl: southkorea, country: "South Korea" },
    { name: "Hindi", flagUrl: india, country: "India" },
    { name: "Japanese", flagUrl: japan, country: "Japan" },
    { name: "Vietnamese", flagUrl: vietnam, country: "Vietnam" },
    { name: "Tagalog", flagUrl: philippines, country: "Philippines" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % languages.length);
    setIsFlipped(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + languages.length) % languages.length
    );
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="outside-slideshow">
      <div className="slideshow-container">
        {languages.map((language, index) => (
          <div
            className={`slide ${currentSlide === index ? "active" : ""}`}
            key={index}
            onClick={flipCard}
          >
            <div className={`card ${isFlipped ? "flipped" : ""}`}>
              <div className="card-front">
                <img src={language.flagUrl} alt={`${language.name} flag`} />
              </div>
              <div className="card-back">
                <p>{`The predominant language in ${language.country} is ${language.name}.`}</p>
                <button onClick={() => (window.location.href = "/login")}>
                  Start Studying {language.name}
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default FlagSlideshow;
