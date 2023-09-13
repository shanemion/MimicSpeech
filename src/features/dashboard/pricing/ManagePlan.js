import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../../services/firebase/FirebaseAuth";
import { Link, useNavigate } from "react-router-dom";

import PricingContext from "../../../services/pricing/PricingContext";
import PopupMenu from "../components/popup-menu/PopupMenu";
import { DashBurger } from "../components/DashBurger";
import PricingModal from "./PricingModal";
import useWindowSize from "../../../utils/WindowSize";
import LanguageContext from "../../../services/language/LanguageContext";
import "./ManagePlan.css";

const ManagePlan = () => {
  const {
    currentUser,
    fetchPlan,
    deleteCredits,
    fetchSubscriptionId,
    fetchCredits,
    db,
  } = useAuth();

  const closePricingModal = () => {
    setPricingState(false);
  };

  const openPricing = () => {
    setPricingState(true);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [plan, setPlan] = useState("");
  const [credits, setCredits] = useState(0);
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
  const { pricingState, setPricingState } = useContext(PricingContext);
  const navigate = useNavigate();

  const { width } = useWindowSize();
  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);

  useEffect(() => {
    const fetchUserPlan = async () => {
      const userPlan = await fetchPlan(currentUser.uid);
      setPlan(userPlan);
    };

    fetchUserPlan();
    console.log("plan", plan);

    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();
    console.log("credits", credits);

    const fetchUserSubscriptionId = async () => {
      const subscriptionId = await fetchSubscriptionId(currentUser.uid);
      setCurrentSubscriptionId(subscriptionId);
    };

    fetchUserSubscriptionId();
    console.log("currentSubscriptionId", currentSubscriptionId);
  }, [currentUser, plan, credits, currentSubscriptionId]);

  const handleCancelSubscription = async () => {
    console.log("currentSubscriptionId1", currentSubscriptionId);

    const subscriptionId = currentSubscriptionId;

    console.log("subscriptionId", subscriptionId);

    try {
      // Call your backend to cancel the Stripe subscription
      const response = await fetch(
        "http://127.0.0.1:4242//cancel-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ subscription_id: subscriptionId, user_id: currentUser.uid }),
          body: JSON.stringify({
            subscriptionId: subscriptionId,
            user_id: currentUser.uid,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate("/subscription-canceled");
      } else {
        // Handle error
        console.error(data.error);
      }
    } catch (error) {
      alert(
        "Failed to cancel subscription: ",
        error,
        "Please try again or contact smion@stanford.edu for assistance."
      );
    }
  };

  return (
    <>
      <div className="account-main-container">
        <div className="account-dashboard-header">
          {width < 1000 && <DashBurger />}
        </div>
        {pricingState && <PricingModal onClose={closePricingModal} />}
        {width > 1000 && (
          <div className="account-sidebar-wrapper">
            <div className="sidebar">
              <h2>
                {firstName} {lastName}
              </h2>
              <span>{credits} Credits</span>
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
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button onClick={() => navigate("/saved")}>
                Saved Responses
              </button>
              {/* <button onClick={() => navigate("/translator")}>
          Sentence Translator
        </button>
        <button onClick={() => navigate("/text-input")}>
          Input Custom Text
        </button> */}
              {/* <button onClick={() => navigate("/words")}>Saved Words</button> */}
              <div style={{ height: "40vh" }}></div>
              <div className="sidebar-footer">
                <h3>Current Plan: {plan}</h3>
                <span className="plan-credits">
                  {credits} Credits Remaining
                </span>
                <button
                  className="dashboard-footer-button"
                  onClick={openPricing}
                >
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="manage-container">
          <h1 className="manage-title">Manage Your Plan</h1>
          <p className="manage-plan-detail">
            Current Plan: {plan ? plan : "Loading..."}
          </p>
          {(plan === "Free" || plan === "Pro") && (
            <button
              className="manage-button"
              onClick={() => {
                navigate("/dashboard");
                setPricingState(true);
              }}
            >
              Upgrade Plan!
            </button>
          )}
          {(plan === "Pro" || plan === "Unlimited") && (
            <button
              className="manage-cancel-button"
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
      <div className="account-popup">
        <PopupMenu />
      </div>
    </>
  );
};

export default ManagePlan;
