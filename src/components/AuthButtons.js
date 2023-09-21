import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/firebase/FirebaseAuth";
import "../styles.css";

export default function AuthButtons() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();  

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); 
    } catch (error) {
  
      console.error(error);
    }
  }

  return (
    <div className="auth-buttons">
      {currentUser ? (
        <>
          <button className="authButton" onClick={() => navigate("/saved")}>View Saved</button>
          {/* <button className="authButton" onClick={handleLogout}>Logout</button> */}
        </>
      ) : (
        <>
          <button className="authButton" onClick={() => navigate("/register")}>Sign Up!</button>
          <button className="authButton" onClick={() => navigate("/login")}>Login</button>

        </>
      )}
    </div>
  );
}
