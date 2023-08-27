import React, { useRef, useEffect } from "react";
import "./LandingPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Burger } from "../../components/Burger";
import { useIntersectionObserver } from "./Intersection";
import Pricing from "./components/Pricing";
import useWindowSize from "../../../src/utils/WindowSize";
import p5 from "p5";

const LandingPage = () => {
  const navigate = useNavigate();
  const myRef = useRef();
  const location = useLocation();
  const { width } = useWindowSize();
  const featureRef = useRef(null);
  const pricingRef = useRef(null);
  const testimonialsRef = useRef(null);
  const promptsRef = useRef(null);
  const ttsRef = useRef(null);
  const progressRef = useRef(null);
  const practiceRef = useRef(null);

  const isFeatureVisible = useIntersectionObserver(featureRef);
  const isPricingVisible = useIntersectionObserver(pricingRef);
  const isTestimonialsVisible = useIntersectionObserver(testimonialsRef);
  const isPromptsVisible = useIntersectionObserver(promptsRef);
  const isTTSVisible = useIntersectionObserver(ttsRef);
  const isProgressVisible = useIntersectionObserver(progressRef);
  const isPracticeVisible = useIntersectionObserver(practiceRef);

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

        wave1 = new Wave(0.02, p.height / 1.5, p.color(255, 0, 0, 50));
        wave2 = new Wave(0.03, p.height / 1.5, p.color(0, 0, 255, 50));
      }
    };

    p.draw = () => {
      p.background(220);
      wave1.update(p.mouseY); // Pass mouseY as an argument
      wave1.display();
      wave2.update(p.mouseY); // Pass mouseY as an argument
      wave2.display();
      time += 0.01; // Increment time for smooth fluctuation
    };

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
        p.strokeWeight(3.5); // Increase the thickness
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
  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <h2 onClick={() => navigate("/")}>MimicSpeech</h2>
        </div>
        <nav>
          <ul className="nav-links">
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/features")}>Features</li>
            <li onClick={() => navigate("/pricing")}>Pricing</li>
            <li onClick={() => navigate("/testimonials")}>Testimonials</li>
            <li onClick={() => navigate("/contact")}>Contact Us</li>
          </ul>
        </nav>
        <div>
          <button
            className="log-in-button"
            style={{ marginRight: 4 }}
            onClick={() => navigate("/login")}
          >
            LOG IN
          </button>
          <button
            className="sign-up-button"
            style={{ marginRight: 20 }}
            onClick={() => navigate("/register")}
          >
            Sign up - It's free
          </button>
        </div>
        {width < 920 && <Burger />}
      </header>
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
            <button
              className="cta-button"
              onClick={() => navigate("/register")}
            >
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
          <div style={{ height: 170 }}></div>
        </div>
      </section>

      {/* Pricing Section */}
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
      </section>

      {/* Testimonials Section */}
      <section
        className={`testimonials ${isTestimonialsVisible ? "fadeIn" : ""}`}
        ref={testimonialsRef}
      >
        {/* Add your testimonials here */}
      </section>

      {/* FAQ Section */}
      <section className="faq">{/* Add your FAQ here */}</section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">About Us</a>
        </div>
        <div className="social-media">
          {/* Add your social media icons here */}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
