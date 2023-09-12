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

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, fetchCredits, fetchFirstName, fetchLastName, fetchPlan } =
    useAuth();
  const { pricingState, setPricingState } = useContext(PricingContext);
  const [credits, setCredits] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
    const [plan, setPlan] = useState("");
  const { width } = useWindowSize();
  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);

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
        }

        fetchUserPlan();

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
          <button onClick={() => navigate("/saved")}>Saved Responses</button>
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

      <div className="main-content">
        <div className="dashboard-header">
          {width < 1000 && <DashBurger />}
          <div style={{ height: "1px" }}></div>
          <PopupMenu />
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
            className="ai-nav-button"
            onClick={
              selectedLanguage && fromLanguage
                ? () => navigate("/generator")
                : () => alert("Please select languages to practice!")
            }
          >
            Go to AI Prompt Generator
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
          <div styles={{ color: "black" }}>
            <h2>How to use the AI Prompt Generator</h2>
            <h3>Overview</h3>
            <p>
              1. Select the language you want to practice from the left dropdown
              menu.
            </p>
            <p>
              2. Select the language you want to practice to from the right
              dropdown menu.
            </p>
            <p>3. Click the "Go to AI Prompt Generator" button.</p>
            <p>4. Type a topic of your choice to create a scene with!</p>
            <p>5. Select the desired length of your response.</p>
            <p>6. Click the "Generate Response" button.</p>
            <h3>Tools</h3>
            <p>
              7. Press the "Play" button to hear your sentences read out loud!
            </p>
            <p>8. Select the voice that best matches yours :D</p>
            <p>
              9. Click the book icon to isolate and practice a specific
              sentence!
            </p>
            <p>
              10. Click on a word / character to hear its pronunciation and to
              learn more about it!
            </p>
            <p>
              11. Press the "Record alongside TTS!" button to record your voice
              alongside the AI text to speech!
            </p>
            <p>12. Press the "Record" button to begin recording your voice!</p>
            <p>13. Press the "Stop" button to stop recording!</p>
            <p>14. Press the "Playback" button to hear your recording!</p>
            <p>
              15. Press the "Save and Compare" button to see a visualization and
              accuracy score of your spoken pitch!
            </p>
            <p>
              16. Listen to your saved audios in the "Recorded Audios Section"
              under your graph.
            </p>
            <h3>Favorites</h3>
            <p>17. Click the Bookmark to save the response to your account.</p>
            <p>
              18. Click the "View Saved Responses" button to view your saved
              responses.
            </p>
            <p>
              19. Select "Use this response" from the saved responses page to
              use a saved response.
            </p>
            {/* <p>
              20. Click the "View Saved Words" button to view your saved words.
            </p> */}
          </div>
            <DashSavedPrompts />
            <DashFeaturedPrompts />


          <div style={{ height: "200px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
