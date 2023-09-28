import React, { useState } from "react";
import "./Faq.css";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "What is MimicSpeech?",
      answer:
        "MimicSpeech is an AI-powered application that helps you learn languages. It provides real-time feedback on your pronunciation and grammar, and helps you practice speaking in a foreign language, on any topic of your choosing. It's designed to be fun and easy to use, so you can learn a new language without feeling overwhelmed. Improve your speaking skills today by creating a free account!",
    },
    {
      question: "How does it work?",
      answer:
        "MimicSpeech uses advanced algorithms to analyze your speech and provide real-time feedback. Check out our features on our home page for a visual understanding of what tools we offer! Learn more at https://mimicspeech.com/how-to-use.",
    },
    {
      question: "Is it free?",
      answer:
        "We offer both free, pro, and unlimited plans. You can choose the one that best suits your needs.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply register for an account and you'll be guided through the setup process. From there, select a language you want to study and start practicing!",
    },
    {
      question: "What type of topics can I practice?",
      answer:
        "You can practice any topic you want! You can start with topics that interest you, such as hobbies, sports, or food. You can also practice topics that you need to know for school or work.",
    },
    {
      question: "What are some example prompts?",
      answer:
        "Typically, prompts are about four to ten words long. For example, 'Traveling to Alaska for the summer,' or 'Cuddling a cute puppy,' or 'Going to the beach with friends.' Or even something on the odd side, like 'A husky watching anime,' or 'A cat playing the piano,' or 'A man climbing the empire state building.' Any of these are great, use your imagination!",
    },
    {
      question: "How do credits work?",
      answer:
        "Each group of sentences is worth 1 credit! So a 3 sentence response is 3 credits, the translated sentences do not use credits.",
    },
    {
      question: "The generated response is not being formatted correctly, what should I do?",
      answer:
        "Despite our best efforts to make sure the generated response is formatted correctly, sometimes it may not be. If this happens, try slightly changing the prompt and generating a new response. If the problem persists and you are unhappy with the product, please contact us at smion@stanford.edu to be appropriately refunded.",
    },
    {
      question: "How do I upgrade my plan?",
      answer:
        "You can upgrade your plan at any time by going to your account settings.",
    },
    {
      question: "How do I cancel my subscription?",
      answer: 
        "You can cancel your subscription at any time by going to your account settings.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact us at smion@stanford.edu.",
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
