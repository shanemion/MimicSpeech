import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import DashboardToLanguage from "./components/DashboardToLanguage";
import DashboardFromLanguage from "./components/DashboardFromLanguage";

import PricingModal from "./pricing/PricingModal";
import PricingContext from "../../services/pricing/PricingContext";
import "./Dashboard.css";
import PopupMenu from "./components/popup-menu/PopupMenu";
import useWindowSize from "../../utils/WindowSize";
import { DashBurger } from "./components/DashBurger";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, fetchCredits, fetchFirstName, fetchLastName } =
    useAuth();
  const { pricingState, setPricingState } = useContext(PricingContext);
  const [credits, setCredits] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { width } = useWindowSize();

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
  }, [currentUser, fetchCredits, fetchFirstName, fetchLastName]);

  const closePricingModal = () => {
    setPricingState(false);
  };

  const openPricing = () => {
    setPricingState(true);
  };

  return (
    <div className="dashboard">
      {pricingState && <PricingModal onClose={closePricingModal} />}
      <div className="sidebar-wrapper">
        <div className="sidebar">
          <h2>
            {firstName} {lastName}
          </h2>
          <span>{credits} Credits</span>
          <button onClick={() => navigate("/generator")}>
            AI Prompt Generator
          </button>
          <button onClick={() => navigate("/translator")}>
            Sentence Translator
          </button>
          <button onClick={() => navigate("/text-input")}>
            Input Custom Text
          </button>
          <button onClick={() => navigate("/prompt-history")}>
            View Prompt History
          </button>
          <button onClick={() => navigate("/saved-responses")}>
            Saved Responses
          </button>
          </div>
          <div className="sidebar-footer">
            <h3>Current Plan: {/* {currentUser.plan} */}</h3>
            <span className="plan-credits">{credits} Credits Remaining</span>
            <button className="dashboard-footer-button" onClick={openPricing}>
              Manage Plan
            </button>
          </div>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          {width < 1000 && <DashBurger />}
          <div style={{ height: "1px" }}></div>
          <PopupMenu />
        </div>
        <div className="dashboard-body">
          <h1>Dashboard</h1>
          <div>
          <div className="dashboard-language-selector">
            <DashboardFromLanguage />
          </div>
          <div className="dashboard-language-selector">
            <DashboardToLanguage />
          </div>
          </div>

          <button
            className="ai-nav-button"
            onClick={() => navigate("/generator")}
          >
            Go to AI Prompt Generator
          </button>
          <div className="dashboard-body-buttons">
            <button
              className="dashboard-nav-button"
              onClick={() => navigate("/custom-translations")}
            >
              Go to Custom Text Text to Speech
            </button>
            <button
              className="dashboard-nav-button"
              onClick={() => navigate("/custom-translations")}
            >
              Go to Sentence Translator
            </button>
          </div>
          <div style={{ height: "1000px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
