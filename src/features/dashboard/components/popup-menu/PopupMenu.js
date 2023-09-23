import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../services/firebase/FirebaseAuth";
import PricingContext from "../../../../services/pricing/PricingContext";
import "./PopupMenu.css";
import { doc, getDoc } from "firebase/firestore";

const PopupMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null); // Create a ref
  const { db, logout, currentUser } = useAuth();
  const { setPricingState } = useContext(PricingContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [firstLetter, setFirstLetter] = useState("");

  useEffect(() => {
    // Fetch existing data from Firestore when the component mounts
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setFirstLetter(firstName[0].toUpperCase());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [currentUser, db, firstName, setFirstName, setFirstLetter, firstLetter]);

  useEffect(() => {
    // Function to check if clicked outside of menu
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add the click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this useEffect runs once when component mounts

  const handleEditAccount = () => navigate("/account");
  const handleManagePlan = () => navigate("/manage-plan");
  const handleUpdatePlan = () => navigate("/update-plan");
  const handleSavedResponses = () => navigate("/saved");
  const handleHowToUse = () => navigate("/how-to-use");
  const handleDashboard = () => navigate("/dashboard");
  const handleLogout = async () => {
    try {
      await logout();
      setPricingState(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="profile-container" ref={popupRef}>
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        <div style={{position: "relative", top: "0%", left: "0%", paddingBottom: "2px", margin: "none"}}>{firstLetter}</div>
      </div>
      {isOpen && (
        <div className="popup-menu">
          <button onClick={handleEditAccount}>Edit Account</button>
          <button onClick={handleManagePlan}>Manage Plan</button>

          <button onClick={handleDashboard}>Dashboard</button>
          <button onClick={handleHowToUse}>How to Use</button>
          <button onClick={handleSavedResponses}>Saved Responses</button>

          {/* <button onClick={handleUpdatePlan}>Update Plan</button> */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
