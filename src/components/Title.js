import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/firebase/FirebaseAuth";

export const Title = () => {
  const { currentUser } = useAuth();

  return (
    <div className="title">
      {currentUser ? (
        <Link
          to="/dashboard"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h1>MimicSpeech</h1>
        </Link>
      ) : (
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>MimicSpeech</h1>
        </Link>
      )}
    </div>
  );
};
