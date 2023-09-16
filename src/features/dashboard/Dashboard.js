import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import DashboardToLanguage from "./components/DashboardToLanguage";
import DashboardFromLanguage from "./components/DashboardFromLanguage";
import LanguageContext from "../../services/language/LanguageContext";

import PricingModal from "./pricing/PricingModal";
import PricingContext from "../../services/pricing/PricingContext";
import "./Dashboard.css";
import PopupMenu from "./components/popup-menu/PopupMenu";
import useWindowSize from "../../utils/WindowSize";
import { DashBurger } from "./components/DashBurger";
import DashSavedPrompts from "./components/DashSavedPrompts";
import DashFeaturedPrompts from "./components/DashFeaturedPrompts";
import AiImageButton from "./components/ai-button-100.1.png";
import Sidebar from "../../components/Sidebar";

const Dashboard = ({
  userPrompt,
  setUserPrompt,
  responseLength,
  setResponseLength,
}) => {
  const navigate = useNavigate();
  const {
    currentUser,
    fetchCredits,
    fetchFirstName,
    fetchLastName,
    fetchPlan,
  } = useAuth();
  const { pricingState, setPricingState } = useContext(PricingContext);
  const [credits, setCredits] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [plan, setPlan] = useState("");
  const { width } = useWindowSize();
  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);
  const [buttonClicked, setButtonClicked] = useState(false);


  const closePricingModal = () => {
    setPricingState(false);
  };

  const openPricing = () => {
    setPricingState(true);
  };

  return (
    <div className="dashboard">
      {pricingState && <PricingModal onClose={closePricingModal} />}
 
        <Sidebar openPricing={openPricing} />
      <div className="main-content">
        <div className="dashboard-header">
          {width < 1000 && <DashBurger />}
          <div style={{ height: "1px" }}></div>
          <div className="dashboard-popup">
            <PopupMenu />
          </div>
        </div>
        <div className="dashboard-body">
          <h1>Dashboard</h1>
          <div className="dashboard-selectors">
            <div className="dashboard-language-selector">
              <DashboardFromLanguage />
            </div>
            <div className="dashboard-language-selector">
              <DashboardToLanguage />
            </div>
          </div>
          <button
            // className={`ai-nav-button ${buttonClicked ? "clicked" : ""}`}
            className="ai-nav-button"
            onClick={
              selectedLanguage && fromLanguage
                ? () => {
                    setButtonClicked(true);
                    // setTimeout(() => {
                    navigate("/generator");
                    // }, 750); // This delay should match the length of your CSS animation
                  }
                : () => {
                    navigate("/dashboard");
                    alert("Please select languages to practice!");
                  }
            }
          >
            <div className="ai-nav-button-inner">
              <button
                className="inner-button how-to-button"
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  navigate("/how-to-use"); // Navigate to How to Use page
                }}
              >
                How to Use
              </button>
              <button className="inner-button start-button">
                Start Learning!
              </button>
            </div>
            <img src={AiImageButton} alt="AI Button" />
          </button>

          <div className="dashboard-body-buttons">
            <button
              className="dashboard-nav-button"
              onClick={() => navigate("/custom-translations")}
              disabled={true}
            >
              COMING SOON: Custom Text Text to Speech
            </button>
            <button
              className="dashboard-nav-button"
              onClick={() => navigate("/custom-translations")}
              disabled={true}
            >
              COMING SOON: Sentence Translator
            </button>
          </div>
          <div style={{ height: "20px" }}></div>

          <DashSavedPrompts
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            responseLength={responseLength}
            setResponseLength={setResponseLength}
          />
          <DashFeaturedPrompts />

          <div style={{ height: "200px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
