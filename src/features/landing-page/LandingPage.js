import React, { useRef, useEffect } from "react";
import "./LandingPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntersectionObserver } from "./utils/Intersection";
import Faq from "./components/faq/Faq";
import Language from "./components/language/Language";
import useWindowSize from "../../../src/utils/WindowSize";
import LandingHeader from "./components/header/LandingHeader";
import Wave from "./WaveAnimation";
import PricingPage from "./components/pricing/PricingPage";

const LandingPage = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const featureRef = useRef(null);
  const pricingRef = useRef(null);
  const promptsRef = useRef(null);
  const ttsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const progressRef = useRef(null);
  const practiceRef = useRef(null);
  const faqRef = useRef(null);
  const languageRef = useRef(null);
  const contactRef = useRef(null);
  const wordRef = useRef(null);

  const isFeatureVisible = useIntersectionObserver(featureRef);
  const isPricingVisible = useIntersectionObserver(pricingRef);
  const isTestimonialsVisible = useIntersectionObserver(testimonialsRef);
  const isPromptsVisible = useIntersectionObserver(promptsRef);
  const isTTSVisible = useIntersectionObserver(ttsRef);
  const isProgressVisible = useIntersectionObserver(progressRef);
  const isPracticeVisible = useIntersectionObserver(practiceRef);
  const isFaqVisible = useIntersectionObserver(faqRef);
  const isLanguageVisible = useIntersectionObserver(languageRef);
  const isWordVisible = useIntersectionObserver(wordRef);

  const heroRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToHome = () => {
    const offset = -140;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = heroRef.current.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const scrollToFeature = () => {
    const offset = -140;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = featureRef.current.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const scrollToPricing = () => {
    const offset = -140;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = pricingRef.current.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const scrollToFAQ = () => {
    // const offset = -140;
    navigate("/");
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = faqRef.current.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      {/* Header Section */}
      <LandingHeader
        scrollToHome={scrollToHome}
        scrollToFeature={scrollToFeature}
        scrollToPricing={scrollToPricing}
        scrollToFAQ={scrollToFAQ}
        scrollToContact={scrollToContact}
      />

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        {" "}
        <div className="video-container">
          <Wave heroRef={heroRef} />{" "}
          <div className="hero-content">
            <h1>Find Your Voice, </h1>
            <h1>Perfect Your Accent.</h1>
            <p>
              Make language learning as unique as you with our AI-powered
              application.
            </p>
            <button className="cta-button" onClick={() => navigate("/signup")}>
              Start Learning Now
            </button>
            <p>No credit card required.</p>
            <div style={{ height: 250 }}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`features ${isFeatureVisible ? "fadeIn" : ""}`}
        ref={featureRef}
      >
        <div className="features-content">
          <div style={{ height: 0 }}></div>

          <div
            className={`feature ${isLanguageVisible ? "fadeIn" : ""}`}
            ref={languageRef}
          >
            <h2>Learn Languages From...</h2>
            <p>
              Unlock the world with our extensive language library. Whether
              you're learning for travel, work, or personal enrichment, we've
              got you covered.
            </p>
            <Language />
          </div>
          <div style={{ height: 70 }}></div>
          <div
            className={`feature ${isPromptsVisible ? "fadeIn" : ""}`}
            ref={promptsRef}
          >
            <div className="feature-content">
              <div>
                <h2>Custom Prompts</h2>
                <p>Create your own prompts to focus on what matters to you.</p>
              </div>
              <div style={{ width: "50px" }}></div>
              {/* <div> */}
              <img
                src="/images/Interface.png"
                alt="Custom Prompts"
                className="sixty-image"
              />
              {/* </div> */}
            </div>
          </div>
          <div style={{ height: 70 }}></div>

          <div
            className={`feature ${isTTSVisible ? "fadeIn" : ""}`}
            ref={ttsRef}
          >
            <div className="feature-content">
              {width > 1000 && (
                <img
                  src="/images/TTS.png"
                  alt="Natural Text-to-Speech"
                  className="sixty-image"
                />
              )}
              <div style={{ width: "50px" }}></div>

              <div>
                <h2>Natural Text-to-Speech</h2>
                <p>Listen to natural voice playback to perfect your accent.</p>
              </div>

              {width < 1000 && (
                <img
                  src="/images/TTS.png"
                  alt="Natural Text-to-Speech"
                  className="sixty-image"
                />
              )}
            </div>
          </div>
          <div style={{ height: 70 }}></div>

          <div
            className={`feature ${isProgressVisible ? "fadeIn" : ""}`}
            ref={progressRef}
          >
            <div className="feature-content">
              <div>
                <h2>Analyze Your Progress</h2>
                <p>Track your pitch and pronunciation over time.</p>
              </div>
              <div style={{ width: "50px" }}></div>

              {/* <div> */}
              <img
                src="/images/v0AnalyzeProgress.png"
                alt="Analyze Your Progress"
                className="sixty-image"
              />
              {/* </div> */}
            </div>
          </div>
          <div style={{ height: 70 }}></div>

          <div
            className={`feature ${isPracticeVisible ? "fadeIn" : ""}`}
            ref={practiceRef}
          >
                      <div style={{ height: 70 }}></div>

            <div className="feature-content">
              {width > 1000 && (
                // <div>
                <img
                  src="/images/v0PracticeMode.png"
                  alt="Practice Mode"
                  className="sixty-image"
                />
                // </div>
              )}
              <div style={{ width: "50px" }}></div>

              <div>
                <h2>Go Sentence by Sentence</h2>
                <p>Isolate difficult sentences with Practice Mode.</p>
              </div>
              {width < 1000 && (
                <div>
                  <img
                    src="/images/v0PracticeMode.png"
                    alt="Practice Mode"
                    className="sixty-image"
                  />
                </div>
              )}
            </div>
          </div>
          <div style={{ height: 100 }}></div>

          <div
            className={`feature ${isWordVisible ? "fadeIn" : ""}`}
            ref={wordRef}
          >
            <div className="feature-content">
              {/* {width > 1000 && (
                // <div>
                <img
                  src="/images/Words.png"
                  alt="Isolate Words"
                  className="sixty-image"
                />
                // </div>
              )} */}
              <div style={{ width: "50px" }}></div>

              <div>
                <h2>Study New Words</h2>
                <p>Increase your vocabularly by clicking on new words.</p>
              </div>
              {/* {width < 1000 && ( */}
              <div>
                <img
                  src="/images/Words.png"
                  alt="Practice Mode"
                  className="sixty-image"
                />
              </div>
              {/* )} */}
            </div>
          </div>
          <div style={{ height: 100 }}></div>
        </div>
      </section>

      <section
        className={`pricing ${isPricingVisible ? "fadeIn" : ""}`}
        ref={pricingRef}
      >
        <PricingPage />
      </section>

      {/* Testimonials Section */}
      <section
        className={`testimonials ${isTestimonialsVisible ? "fadeIn" : ""}`}
        ref={testimonialsRef}
      >
        {/* Add your testimonials here */}
      </section>

      {/* FAQ Section */}
      <section className={`faq ${isFaqVisible ? "fadeIn" : ""}`} ref={faqRef}>
        <div className="pricing-content">
          <div className="feature">
            <h2>FAQ</h2>
          </div>
        </div>
        <Faq />
      </section>

      {/* Footer Section */}
      <footer className="landing-footer" ref={contactRef}>
        <img src="/images/logov00.png" alt="Logo" className="logo" />
        <div className="footer-links">
          <a
            href="https://github.com/shanemion/MimicSpeech/tree/main"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check it out on GitHub
          </a>
          <p>
          <a
            href="https://www.linkedin.com/in/shanemion/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Me on LinkedIn
          </a>
          </p>
          <p className="landing-footer-text">
            For inquiries or questions contact smion@stanford.edu
          </p>
          <p className="landing-footer-text">Made from Create React App</p>

          <p className="landing-footer-text">© 2023 MimicSpeech</p>
        </div>
        <div className="social-media">
          {/* Add your social media icons here */}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
