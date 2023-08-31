import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Pricing.css";
import checkmark from "./icons8-checkmark-48.png"; // adjust the filename if needed
import { useAuth } from "../../../services/firebase/FirebaseAuth";

const useStripe = () => {
  useEffect(() => {
    // Only add the script if it doesn't already exist in the document
    if (!window.Stripe) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
};

const Pricing = () => {
  useStripe();
  const navigate = useNavigate();
  // actual
  // const stripe_pk = "pk_live_51NkFpwK0jBG5BpilI2pUBCSMePDdEE0ms7LlJjtMjpqHp4w36FcdvJhX1Wl4fZLMeIFkXnnlTHU4CMPkyzQUVxXG00bf7ixAir"

  // test
  const stripe_pk =
    "pk_test_51NkFpwK0jBG5BpilGRgnZGO0Ps2T6lQuUFbY98sOET2vW3vUyLxR52ZVAtHFhOA2ztsu5hsGeQTllGYXI60p9azX00zkyfFtYW";

  const { currentUser } = useAuth(); // Get current user from Firebase

  const handleCheckout = async (plan) => {
    console.log("Sending user_id:", currentUser.uid); // Debug line
    const response = await fetch(
      "http://127.0.0.1:4242/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, user_id: currentUser.uid }), // Include user ID
      }
    );
    const session = await response.json();
    // Redirect to Stripe Checkout
    const stripe = window.Stripe(stripe_pk);
    stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div>
      <div className="pricing-container">
        <div className="inside-pricing-container">
          {/* Free Plan */}
          <div className="free-box">
            <h3>Free</h3>
            <div className="price">
              <span>$0</span>
              <span className="billing">Billed Monthly</span>
            </div>
            <div style={{ height: "20px" }}></div>

            <ul>
              <li>
                <img src={checkmark} alt="check" />5 free credits
              </li>
              <li>
                <img src={checkmark} alt="check" />
                GPT-3.5 access
              </li>
              <li>
                <img src={checkmark} alt="check" />
                Natural sounding Text to Speech
              </li>
              <li>
                <img src={checkmark} alt="check" />
                Option to save responses
              </li>
              <li>
                <img src={checkmark} alt="check" />3 sentence responses
              </li>
            </ul>
            <button className="free-button" disabled onClick={() => navigate("/signup")}>
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-box">
            <h3>Pro</h3>
            <div className="price">
              <span>$4.99</span>
              <span className="billing">Billed Monthly</span>
            </div>
            <div style={{ height: "20px" }}></div>

            <ul>
              <li>
                <img src={checkmark} alt="check" />
                15 credits a month
              </li>
              <li>
                <img src={checkmark} alt="check" />
                GPT-4 access
              </li>
              <li>
                <img src={checkmark} alt="check" />
                Natural sounding Text to Speech
              </li>
              <li>
                <img src={checkmark} alt="check" />
                Option to save responses
              </li>
              <li>
                <img src={checkmark} alt="check" />
                Up to 8 sentence responses
              </li>
            </ul>
            <button
              className="buy-button"
              onClick={() => handleCheckout("Pro")}
            >
              Buy this plan
            </button>
          </div>

          {/* Unlimited Plan */}
          <div className="pricing-box">
            <h3>Unlimited</h3>
            <div className="price">
              <span>$9.99</span>
              <span className="billing">Billed Monthly</span>
            </div>
            <div style={{ height: "20px" }}></div>
            <ul>
              <li>
                <img src={checkmark} alt="check" />
                Unlimited credits
              </li>
              <li>
                <img src={checkmark} alt="check" />
                GPT-4 access
              </li>
              <li>
                <img src={checkmark} alt="check" />
                Natural sounding Text to Speech
              </li>
              <li>
                <img src={checkmark} alt="check" />
                Option to save responses
              </li>
              <li>
                <img src={checkmark} alt="check" />
                10 sentence responses
              </li>
            </ul>
            <button
              className="buy-button"
              onClick={() => handleCheckout("Unlimited")}
            >
              Buy this plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
