import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../services/firebase/FirebaseAuth";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccessPage.css";

const PaymentSuccessPage = () => {
  const { currentUser, fetchCredits } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get("plan");
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();
  }, [currentUser, fetchCredits, plan]);

  return (
    <div className="payment-success-container">
      <h1 className="success-title">Thank You for Your Purchase!</h1>
      <p className="success-message">
        You have successfully purchased the <span className="plan-name">{plan}</span> plan. You now have <span className="credit-count">{credits}</span> credits.
      </p>
      <button className="dashboard-button" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </div>
  );
};

export default PaymentSuccessPage;
