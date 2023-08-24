import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/firebase/FirebaseAuth';
import "../styles.css"

export default function AuthButtons() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();  // useAuth instead of useContext

  const handleLogout = async () => {
    // Here goes your logout logic.
    try {
      await logout();
      navigate("/login"); // After logout, you can redirect user to login page
    } catch (error) {
      // handle errors here
      console.error(error);
    }
  }

  return (
    <div className="auth-buttons">
      {currentUser ? (
        <>
          <button className="authButton" onClick={() => navigate("/saved")}>View Saved</button>
          <button className="authButton" onClick={handleLogout}>Logout</button>
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
