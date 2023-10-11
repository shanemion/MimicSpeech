import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../../services/firebase/FirebaseAuth";
import { useNavigate } from "react-router-dom";

import PricingContext from "../../../services/pricing/PricingContext";
import PopupMenu from "../components/popup-menu/PopupMenu";
import { DashBurger } from "../components/DashBurger";
import PricingModal from "./PricingModal";
import useWindowSize from "../../../utils/WindowSize";
import { getDoc, doc } from "firebase/firestore";
import Sidebar from "../../../components/Sidebar";
import LoaderIcon from "react-loader-icon";
import { getAuth, getIdToken } from "firebase/auth";
import "./ManagePlan.css";

const ManagePlan = () => {
  const {
    currentUser,
    fetchPlan,
    fetchSubscriptionId,
    fetchCredits,
    db,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Fetch existing data from Firestore when the component mounts
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currentUser, db]);

  const closePricingModal = () => {
    setPricingState(false);
  };

  const openPricing = () => {
    setPricingState(true);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [plan, setPlan] = useState("");
  const [credits, setCredits] = useState(0);
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
  const { pricingState, setPricingState } = useContext(PricingContext);
  const navigate = useNavigate();

  const { width } = useWindowSize();

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
      const auth = getAuth();
      const idToken = await getIdToken(auth.currentUser, true);
      const response = await fetch("http://127.0.0.1:5001/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId,
          user_id: currentUser.uid,
        }),
      });
      

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

  if (isLoading) {
    return <div style={{marginTop: "40vh"}}> 
        <LoaderIcon type="bubbles" color="#000000" />
    </div>;
  }

  return (
    <>
      <div className="account-main-container">
        <div className="account-dashboard-header">
          {width < 1000 && <DashBurger />}
        </div>
        {pricingState && <PricingModal onClose={closePricingModal} />}
        {width > 1000 && (
          <Sidebar />
        )}
        <div className="manage-container">
          <h1 className="manage-title">Manage Your Plan</h1>
          <p className="manage-plan-detail">
            Current Plan: {plan ? plan : "Loading..."}
          </p>
          {(plan === "free" || plan === "Pro") && (
            <button
              className="manage-button"
              onClick={() => {
                // navigate("/dashboard");
                setPricingState(true);
              }}
            >
              Upgrade Plan!
            </button>
          )}
          {(plan === "Unlimited") && (
            <button
              className="manage-button"
              onClick={() => {
                navigate("/dashboard");
                setPricingState(true);
              }}
            >
              Change Plan
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
