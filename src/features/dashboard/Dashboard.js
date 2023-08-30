import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import DashboardLanguage from "./DashboardLanguage";
import PricingModal from "./PricingModal";
import PricingContext from "../../services/pricing/PricingContext";
import "./Dashboard.css";

const Dashboard = (selectedLanguage, setSelectedLanguage) => {
  const navigate = useNavigate();
  const { currentUser, logout, fetchCredits } = useAuth();
  const { pricingState, setPricingState } = useContext(PricingContext);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();
  }, [currentUser, fetchCredits]);

  const closePricingModal = () => {
    setPricingState(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setPricingState(false);
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleEditAccount = () => {
    navigate("/edit-account");
  };

  const handleManagePlan = () => {
    navigate("/manage-plan");
  };

  const handleUpdatePlan = () => {
    navigate("/update-plan");
  };


  return (
    <div className="dashboard">
      {pricingState && <PricingModal onClose={closePricingModal} />}

      <div className="sidebar">
        <h2>
          {/* {currentUser.firstName} {currentUser.lastName} */}
        </h2>
        <p>{credits} Credits</p>
        <button onClick={() => navigate("/prompt-history")}>
          View Prompt History
        </button>
        <button onClick={() => navigate("/saved-responses")}>
          Saved Responses
        </button>
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Dashboard</h1>
          <div className="profile-icon">
            {/* onClick={/* Open Popup Menu */}
            {/* Profile Icon Here */}
          </div>
          <div className="popup-menu">
            <button onClick={handleEditAccount}>Edit Account</button>
            <button onClick={handleManagePlan}>Manage Plan</button>
            <button onClick={handleUpdatePlan}>Update Plan</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="language-selector">
          <DashboardLanguage
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
        <button onClick={() => navigate("/custom-translations")}>
          Type Custom Translations
        </button>
        <button onClick={() => navigate("/generator")}>
          Generate AI Sentences
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
