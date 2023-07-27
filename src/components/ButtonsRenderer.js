import React from "react";
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/firebase/FirebaseAuth';

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
          <Button variant="contained" onClick={handleLogout}>Logout</Button>
          <Button variant="contained" onClick={() => navigate("/saved")}>View Saved</Button>
        </>
      ) : (
        <>
          <Button variant="contained" onClick={() => navigate("/login")}>Login</Button>
          <Button variant="contained" onClick={() => navigate("/register")}>Register</Button>
        </>
      )}
    </div>
  );
}
