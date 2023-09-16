import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/firebase/FirebaseAuth";
import PricingContext from "../services/pricing/PricingContext";
import LanguageContext from "../services/language/LanguageContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);

  const [credits, setCredits] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [plan, setPlan] = useState("");
  const {
    currentUser,
    fetchCredits,
    fetchFirstName,
    fetchLastName,
    fetchPlan,
  } = useAuth();

  const { pricingState, setPricingState } = useContext(PricingContext);

  const openPricing = () => {
    setPricingState(true);
  };



  useEffect(() => {
    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();

    const fetchUserFirstName = async () => {
      const userFirstName = await fetchFirstName(currentUser.uid);
      setFirstName(userFirstName);
    };

    fetchUserFirstName();

    const fetchUserLastName = async () => {
      const userLastName = await fetchLastName(currentUser.uid);
      setLastName(userLastName);
    };

    fetchUserLastName();

    const fetchUserPlan = async () => {
      const userPlan = await fetchPlan(currentUser.uid);
      setPlan(userPlan);
    };

    fetchUserPlan();
  }, [currentUser, fetchCredits, fetchFirstName, fetchLastName, fetchPlan]);

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar">
        <h2>
          {firstName} {lastName}
        </h2>
        <span>{credits} Credits</span>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>

        <button
          onClick={
            selectedLanguage && fromLanguage
              ? () => navigate("/generator")
              : () => {
                  navigate("/dashboard");
                  alert("Please select languages to practice!");
                }
          }
        >
          AI Prompt Generator
        </button>
        <button onClick={() => navigate("/saved")}>Saved Responses</button>
        <button onClick={() => navigate("/how-to-use")}>How to Use</button>
        {/* <button onClick={() => navigate("/translator")}>
    Sentence Translator
  </button>
  <button onClick={() => navigate("/text-input")}>
    Input Custom Text
  </button> */}
        {/* <button onClick={() => navigate("/words")}>Saved Words</button> */}
      </div>
      <div className="sidebar-footer">
        <h3>Current Plan: {plan}</h3>
        <span className="plan-credits">{credits} Credits Remaining</span>
        <button className="dashboard-footer-button" onClick={openPricing}>
          Manage Plan
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
