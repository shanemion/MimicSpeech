import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useWindowSize from "../../utils/WindowSize";
import "./registration.css"; // Import the CSS
import { usePricing } from "../../services/pricing/PricingContext";

import { useAuth } from "../../services/firebase/FirebaseAuth";

const Login = () => {
  const { login, signInWithGoogle, signInWithGitHub } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { width } = useWindowSize();
  const location = useLocation();
  const { pricingState, setPricingState } = usePricing();


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      if (pricingState && pricingState.fromPricingPage) {
        navigate("/dashboard");
        setPricingState({ fromPricingPage: false });  // Reset the state
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error);
    }
  };

  const closeMenu = () => setIsOpen(false);
  const handleStateChange = (state) => setIsOpen(state.isOpen);

  const canProceed = email !== "" && password !== "";

  return (
    <div className="container">
      {width > 768 && (
        <div className="promo-section">
          <h1>Welcome Back!</h1>
          <p>Unlock the world with our extensive language library.</p>
          <p>
            Customize your language learning journey with our AI-powered
            application.
          </p>
          {/* Add more promotional content here */}
        </div>
      )}
      <div className="login-section">
        <h1>Login</h1>
        <p>
          Don't have an account? <Link to="/signup">Sign Up for free</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" onClick={closeMenu} disabled={!canProceed}>
            Login
          </button>
          <div className="or">
            <p>or</p>
          </div>
          <button
            type="button"
            className="google-signin-button"
            onClick={signInWithGoogle}
          >
            Sign In with Google
          </button>
          {/* <button
            type="button"
            className="github-signin-button"
            onClick={signInWithGitHub}
          >
            Sign In with GitHub
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
