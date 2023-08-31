import React, { useRef, useEffect, useContext } from "react";
import "./LandingPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Burger } from "../../components/Burger";
import { useIntersectionObserver } from "./utils/Intersection";
import Pricing from "../dashboard/pricing/Pricing";
import Faq from "./components/faq/Faq";
import Language from "./components/language/Language";
import useWindowSize from "../../../src/utils/WindowSize";
import LandingHeader from "./components/header/LandingHeader";
import p5 from "p5";

const LandingPage = () => {
  const navigate = useNavigate();
  const myRef = useRef();
  const location = useLocation();
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

  const isFeatureVisible = useIntersectionObserver(featureRef);
  const isPricingVisible = useIntersectionObserver(pricingRef);
  const isTestimonialsVisible = useIntersectionObserver(testimonialsRef);
  const isPromptsVisible = useIntersectionObserver(promptsRef);
  const isTTSVisible = useIntersectionObserver(ttsRef);
  const isProgressVisible = useIntersectionObserver(progressRef);
  const isPracticeVisible = useIntersectionObserver(practiceRef);
  const isFaqVisible = useIntersectionObserver(faqRef);
  const isLanguageVisible = useIntersectionObserver(languageRef);

  const heroRef = useRef();


  useEffect(() => {
    let myP5 = new p5(sketch, myRef.current);
  }, []);

  const sketch = (p) => {
    let wave1, wave2;
    let time = 0; // Time variable for smooth fluctuation

    p.setup = () => {
      const heroSection = heroRef.current;
      if (heroSection) {
        // Check if heroSection is not null
        const canvas = p.createCanvas(
          heroSection.offsetWidth,
          heroSection.offsetHeight
        );
        canvas.position(0, 0); // Position it at the top-left corner
        canvas.style("z-index", "-1"); // Place it behind the content

        wave1 = new Wave(0.02, p.height / 1.5, p.color(242, 84, 91));
        wave2 = new Wave(0.03, p.height / 1.5, p.color(108, 145, 191));
      }
    };

    p.draw = () => {
      drawGradient();
      wave1.update(p.mouseY); // Pass mouseY as an argument
      wave1.display();
      wave2.update(p.mouseY); // Pass mouseY as an argument
      wave2.display();
      time += 0.01; // Increment time for smooth fluctuation
    };

    function drawGradient() {
      let topColor = p.color(243, 247, 240);
      let middleColor = p.color(243, 247, 240);
      let bottomColor = p.color(255, 255, 255);


      // Draw the top-to-middle gradient
      for (let i = 0; i <= p.height / 2; i++) {
        let inter = p.map(i, 0, p.height / 2, 0, 1);
        let c = p.lerpColor(topColor, middleColor, inter);
        p.stroke(c);
        p.line(0, i, p.width, i);
      }

      // Draw the middle-to-bottom gradient
      for (let i = p.height / 2; i <= p.height; i++) {
        let inter = p.map(i, p.height / 2, p.height, 0, 1);
        let c = p.lerpColor(middleColor, bottomColor, inter);
        p.stroke(c);
        p.line(0, i, p.width, i);
      }
    }

    p.windowResized = () => {
      const heroSection = heroRef.current;
      if (heroSection) {
        // Check if heroSection is not null
        p.resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
      }
    };

    class Wave {
      constructor(frequency, offset, col) {
        this.angle = 0;
        this.amplitude = 100;
        this.frequency = frequency;
        this.offset = offset;
        this.col = col;
      }

      update(mouseY) {
        this.angle += this.frequency;
        const centerY = this.offset; // The vertical center of the wave is now updated
        const distanceFromCenter = Math.abs(mouseY - centerY); // Absolute distance from center

        // Smooth fluctuation using a phase-shifted and scaled sine function
        const minAmplitude = 40;
        const maxAmplitude = 100;
        const amplitudeRange = maxAmplitude - minAmplitude;

        // Use a sine function that has been phase-shifted and scaled to make the transition smoother
        const smoothFluctuation =
          minAmplitude +
          (amplitudeRange / 2) * (Math.sin(time - Math.PI / 2) + 1);

        // Check if the mouse is too far from the center
        if (distanceFromCenter > 400) {
          this.amplitude = smoothFluctuation; // Ignore the mouse's position
        } else {
          const mouseEffect = 1 + (1 - distanceFromCenter / 400); // Scaling factor based on distance from center
          this.amplitude = smoothFluctuation * mouseEffect; // Combine both effects
        }

        // Remove the constraint to allow the amplitude to go beyond the natural fluctuation
        this.amplitude = Math.max(this.amplitude, minAmplitude);
      }

      display() {
        p.stroke(this.col);
        p.strokeWeight(4.5); // Increase the thickness
        p.noFill();
        p.beginShape();
        for (let x = 0; x <= p.width; x += 5) {
          let y =
            p.sin(x * this.frequency + this.angle) * this.amplitude +
            this.offset;
          p.vertex(x, y);
        }
        p.endShape();
      }
    }
  };

  // const scrollToHome = () => {
  //   const offset = -140;
  //   const bodyRect = document.body.getBoundingClientRect().top;
  //   const elementRect = heroRef.current.getBoundingClientRect().top;
  //   const elementPosition = elementRect - bodyRect;
  //   const offsetPosition = elementPosition + offset;

  //   window.scrollTo({
  //     top: offsetPosition,
  //     behavior: "smooth",
  //   });
  // };

  // const scrollToFeature = () => {
  //   const offset = -140;
  //   const bodyRect = document.body.getBoundingClientRect().top;
  //   const elementRect = featureRef.current.getBoundingClientRect().top;
  //   const elementPosition = elementRect - bodyRect;
  //   const offsetPosition = elementPosition + offset;

  //   window.scrollTo({
  //     top: offsetPosition,
  //     behavior: "smooth",
  //   });
  // };

  // const scrollToPricing = () => {
  //   const offset = -140;
  //   const bodyRect = document.body.getBoundingClientRect().top;
  //   const elementRect = pricingRef.current.getBoundingClientRect().top;
  //   const elementPosition = elementRect - bodyRect;
  //   const offsetPosition = elementPosition + offset;

  //   window.scrollTo({
  //     top: offsetPosition,
  //     behavior: "smooth",
  //   });
  // };

  // const scrollToFAQ = () => {
  //   // const offset = -140;
  //   navigate("/");
  //   const bodyRect = document.body.getBoundingClientRect().top;
  //   const elementRect = faqRef.current.getBoundingClientRect().top;
  //   const elementPosition = elementRect - bodyRect;
  //   const offsetPosition = elementPosition;

  //   window.scrollTo({
  //     top: offsetPosition,
  //     behavior: "smooth",
  //   });
  // };

  // const scrollToContact = () => {
  //   contactRef.current.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <div className="landing-page">
      {/* Header Section */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        {" "}
        <div className="video-container">
          <div ref={myRef} className="background-animation"></div>{" "}
          <div className="hero-content">
            <h1>Find Your Voice, Perfect Your Accent:</h1>
            <h1>Make Language Learning as Unique as You.</h1>
            <p>
              Customize your language learning journey with our AI-powered
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
              got you covered. Choose from dozens of languages to start your
              journey.
            </p>
            <Language />
          </div>
          <div style={{ height: 70 }}></div>
          <div
            className={`feature ${isPromptsVisible ? "fadeIn" : ""}`}
            ref={promptsRef}
          >
            <h2>Custom Prompts</h2>
            <p>Create your own prompts to focus on what matters to you.</p>
            <img
              src="/images/v0customprompts.png"
              alt="Custom Prompts"
              className="sixty-image"
            />
          </div>
          <div style={{ height: 70 }}></div>

          <div
            className={`feature ${isTTSVisible ? "fadeIn" : ""}`}
            ref={ttsRef}
          >
            {" "}
            <h2>Natural Text-to-Speech</h2>
            <p>Listen to natural voice playback to perfect your accent.</p>
            <img
              src="/images/v0TTS.png"
              alt="Natural Text-to-Speech"
              className="scaled-image"
            />
          </div>
          <div style={{ height: 70 }}></div>

          <div
            className={`feature ${isProgressVisible ? "fadeIn" : ""}`}
            ref={progressRef}
          >
            {" "}
            <h2>Analyze Your Progress</h2>
            <p>Track your pitch and pronunciation over time.</p>
            <img
              src="/images/v0AnalyzeProgress.png"
              alt="Analyze Your Progress"
              className="sixty-image"
            />
          </div>
          <div style={{ height: 70 }}></div>

          <div
            className={`feature ${isPracticeVisible ? "fadeIn" : ""}`}
            ref={practiceRef}
          >
            {" "}
            <h2>Go Sentence by Sentence</h2>
            <p>Isolate difficult sentences with Practice Mode.</p>
            <img
              src="/images/v0PracticeMode.png"
              alt="Practice Mode"
              className="sixty-image"
            />
          </div>
          <div style={{ height: 100 }}></div>
        </div>
      </section>

      {/* Pricing Section
      <section
        className={`pricing ${isPricingVisible ? "fadeIn" : ""}`}
        ref={pricingRef}
      >
        <div className="pricing-content">
          <div className="feature">
            <h2>Choose a Plan that Works for You</h2>
          </div>
        </div>
        <Pricing />
      </section> */}

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
      <footer className="footer">
        <div className="footer-links">
          {/* <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">About Us</a> */}
        </div>
        <div className="social-media">
          {/* Add your social media icons here */}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
