import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/firebase/FirebaseAuth";

const ManagePlan = () => {
  const {
    currentUser,
    fetchPlan,
    deleteCredits,
    fetchSubscriptionId,
    fetchCredits,
  } = useAuth();

  const [plan, setPlan] = useState("");
  const [credits, setCredits] = useState(0);
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
      const userPlan = await fetchPlan(currentUser.uid);
      setPlan(userPlan);
    };

    fetchUserPlan();
    console.log("plan", plan)

    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();
    console.log("credits", credits)

    const fetchUserSubscriptionId = async () => {
      const subscriptionId = await fetchSubscriptionId(currentUser.uid);
      setCurrentSubscriptionId(subscriptionId);
    };

    fetchUserSubscriptionId();
    console.log("currentSubscriptionId", currentSubscriptionId)
  }, [currentUser, plan, credits, currentSubscriptionId]);

  const handleCancelSubscription = async () => {
    console.log("currentSubscriptionId1", currentSubscriptionId)

    const subscriptionId = currentSubscriptionId;

    console.log("subscriptionId", subscriptionId)

    try {
      // Call your backend to cancel the Stripe subscription
      const response = await fetch("http://127.0.0.1:4242//cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ subscription_id: subscriptionId, user_id: currentUser.uid }),
        body: JSON.stringify({ subscriptionId: subscriptionId, user_id: currentUser.uid })

      });

      const data = await response.json();
      if (data.message) {
        // Successfully cancelled

        // Update Firestore user document to reflect the change in subscription status
        await deleteCredits(currentUser.uid, 0); // Adjust as needed
      } else {
        // Handle error
        console.error(data.error);
      }
    } catch (error) {
      console.error("Failed to cancel subscription: ", error);
    }
  };

  return (
    <div>
      <h1>Manage Your Plan</h1>
      <p>Current Plan: {plan ? plan : "Loading..."}</p>
      <button onClick={handleCancelSubscription}>Cancel Subscription</button>
    </div>
  );
};

export default ManagePlan;
