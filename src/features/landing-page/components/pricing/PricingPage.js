import React, { useEffect, useState } from "react";
import Pricing from "../../../dashboard/pricing/Pricing";
import { useAuth } from "../../../../services/firebase/FirebaseAuth";
import LandingHeader from "../header/LandingHeader";
import { useNavigate } from "react-router-dom";
import { usePricing } from "../../../../services/pricing/PricingContext";

const PricingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setPricingState } = usePricing();

  const handleButtonClick = (plan) => {
    console.log("Navigating with state: ", { fromPricingPage: true, selectedPlan: plan });

    if (currentUser) {
      // User is logged in, navigate to dashboard
      setPricingState({ fromPricingPage: true, selectedPlan: plan });
      navigate("/dashboard");
    } else {
      // User is not logged in, navigate to login/signup
      setPricingState({ fromPricingPage: true });
      navigate("/login");
    }
  };

  return (
    <div>
      <LandingHeader />
      <h1>Pricing Plans</h1>
      <div>
        <button onClick={() => handleButtonClick("Free")}>
          Sign up for Free
        </button>
        <button onClick={() => handleButtonClick("Pro")}>Buy Pro</button>
        <button onClick={() => handleButtonClick("Unlimited")}>
          Buy Unlimited
        </button>
      </div>
    </div>
  );
};

export default PricingPage;
