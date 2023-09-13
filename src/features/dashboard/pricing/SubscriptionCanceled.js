// create a subscription update success page

import React from "react";
import { useAuth } from "../../../services/firebase/FirebaseAuth";
import { useLocation, useNavigate } from "react-router-dom";
import "./SubscriptionCanceled.css";

const SubscriptionCanceled = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get("plan");
  const navigate = useNavigate();

  return (
    <div className="subscription-updated-container">
      <h1 className="success-title">Your Subscription Has Been Canceled.</h1>
      <p className="success-message">
        You have successfully updated changed your subscription to the{" "}
        <span className="plan-name">{plan}</span> plan.
      </p>
      <p className="success-message">
        Your subscription will remain active until the end of your current
        billing cycle. You will not be charged again. Upon the end of your
        current billing cycle, your subscription will be canceled and your
        credits will reset to 0.
      </p>
      <p className="success-message">
        You can reactivate your subscription at any time by going to the{" "}
        <a href="/manage-plan">Manage Plan </a>page.
      </p>
      <button
        className="dashboard-button"
        onClick={() => navigate("/dashboard")}
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default SubscriptionCanceled;
