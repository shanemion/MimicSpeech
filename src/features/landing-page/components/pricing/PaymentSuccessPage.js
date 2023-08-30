// PaymentSuccessPage.js

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../services/firebase/FirebaseAuth";
import { useLocation, useNavigate } from "react-router-dom";

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
  }, [currentUser, fetchCredits]);

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
        <p>
            You have successfully purchased the {plan} plan. You now have {credits} credits.
        </p>
      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </div>
  );
};

export default PaymentSuccessPage;
