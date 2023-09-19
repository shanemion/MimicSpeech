import React, { useEffect, useState } from "react";
import Pricing from "../../../dashboard/pricing/Pricing";
import { useAuth } from "../../../../services/firebase/FirebaseAuth";
import LandingHeader from "../header/LandingHeader";
import { useNavigate } from "react-router-dom";
import { usePricing } from "../../../../services/pricing/PricingContext";
import checkmark from './icons8-checkmark-501.png'
import "./PricingPage.css";

const PricingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setPricingState } = usePricing();

  const handleButtonClick = (plan) => {
    console.log("Navigating with state: ", {
      fromPricingPage: true,
      selectedPlan: plan,
    });

    if (currentUser) {
      // User is logged in, navigate to dashboard
      setPricingState({ fromPricingPage: true, selectedPlan: plan });
      navigate("/dashboard");
    } else {
      // User is not logged in, navigate to login/signup
      setPricingState({ fromPricingPage: true });
      navigate("/signup");
    }
  };

  return (
    <div>
      {/* <LandingHeader /> */}
      <div className="pricing-page">
        <h1 className="pricing-title">Pricing Plans</h1>
        <div className="pricing-plans">
          <div className="pricing-plan free">
            <h3>Free</h3>
            <p>$0</p>
            <p>Billed Monthly</p>
            <ul>
              <li><img src={checkmark} alt="check" className="checkmark"/>5 free credits</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>GPT-3.5 access</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>Natural sounding Text to Speech</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>Option to save responses</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>3 sentence responses</li>
            </ul>
            <button
              className="pricing-button"
              onClick={() => handleButtonClick("Free")}
            >
              Sign Up for Free!
            </button>
          </div>
          <div className="pricing-plan pro">
            <h3>Pro</h3>
            <p>$4.99</p>
            <p>Billed Monthly</p>
            <ul>
              <li><img src={checkmark} alt="check" className="checkmark"/>15 credits a month</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>GPT-4 access</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>Natural sounding Text to Speech</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>Option to save responses</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>Up to 8 sentence responses</li>
            </ul>
            <button
              className="pricing-button"
              onClick={() => handleButtonClick("Pro")}
            >
              Buy Pro
            </button>
          </div>
          <div className="pricing-plan unlimited">
            <h3>Unlimited</h3>
            <p>$9.99</p>
            <p>Billed Monthly</p>
            <ul>
              <li><img src={checkmark} alt="check" className="checkmark"/>Unlimited credits</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>GPT-4 access</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>Natural sounding Text to Speech</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>Option to save responses</li>
              <li><img src={checkmark} alt="check" className="checkmark"/>10 sentence responses</li>
            </ul>
            <button
              className="pricing-button"
              onClick={() => handleButtonClick("Unlimited")}
            >
              Buy Unlimited
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
