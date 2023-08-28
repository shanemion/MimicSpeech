import React, { useState } from "react";
import "./Faq.css";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "What is MimicSpeech?",
      answer:
        "MimicSpeech is an AI-powered application that helps you learn languages.",
    },
    {
      question: "How does it work?",
      answer:
        "MimicSpeech uses advanced algorithms to analyze your speech and provide real-time feedback.",
    },
    {
      question: "Is it free?",
      answer:
        "We offer both free and premium plans. You can choose the one that best suits your needs.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply register for an account and you'll be guided through the setup process.",
    },
  ];

  const toggleAnswer = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="outside-faq-container">
      <div className="faq-container">
        {questions.map((item, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              <span className="arrow">{activeIndex === index ? "▲" : "▼"}</span>
              {item.question}
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
