import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/firebase/FirebaseAuth";
import "../styles.css";

export default function SavedAuthButtons() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();  

  return (
    <div className="auth-buttons">
      {currentUser ? (
        <>
          <button className="authButton" onClick={() => navigate("/dashboard")}>Dash</button>
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
