import React from "react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../../../utils/WindowSize";
import "../../LandingPage.css";
import { Burger } from "../../../../components/Burger";
import { usePricing } from "../../../../services/pricing/PricingContext"; // Import the custom hook
import { useAuth } from "../../../../services/firebase/FirebaseAuth"; // Import your Auth hook

const LandingHeader = ({
  scrollToHome,
  scrollToFeature,
  scrollToPricing,
  scrollToFAQ,
  scrollToContact,
}) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { currentUser } = useAuth(); // Get current user from Firebase
  const { setPricingState } = usePricing(); // Use the custom hook

  const handleLoginClick = () => {
    if (currentUser) {
      // If user is already logged in, go to dashboard
      navigate("/dashboard");
    } else {
      // If user is not logged in, go to login page
      setPricingState({ fromPricingPage: false }); // Reset the state
      navigate("/login");
    }
  };
  return (
    <header className="header">
      <div className="logo">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img
            src="/images/logov00.png"
            alt="Logo"
            style={{ width: 90, height: "auto", marginRight: 10 }}
            ß
          />
          <h2 onClick={scrollToHome}>MimicSpeech</h2>
        </div>
      </div>
      <nav>
        <ul className="nav-links">
          <li onClick={scrollToFeature}>Features</li>
          <li onClick={scrollToPricing}>Pricing</li>
          <li onClick={scrollToFAQ}>FAQs</li>
          <li
            onClick={() => {
              scrollToContact();
            }}
          >
            Contact Us
          </li>
        </ul>
      </nav>
      <div>
        <button
          className="log-in-button"
          style={{ marginRight: 4 }}
          onClick={handleLoginClick}
        >
          LOG IN
        </button>
        <button
          className="sign-up-button"
          style={{ marginRight: 20 }}
          onClick={() => navigate("/signup")}
        >
          Sign up - It's free
        </button>
      </div>
      {width < 920 && <Burger />}
    </header>
  );
};

export default LandingHeader;
