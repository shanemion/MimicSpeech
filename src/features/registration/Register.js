import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import useWindowSize from "../../utils/WindowSize";
import { usePricing } from "../../services/pricing/PricingContext";

const Register = () => {
  const {
    register,
    signInWithGoogle,
    googleSignInPending,
    setGoogleSignInPending,
    doc,
    setDoc,
    getDoc,
    currentUser,
    db
  } = useAuth();

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { width } = useWindowSize();
  const location = useLocation();
  const { pricingState, setPricingState } = usePricing();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const additionalData = {
        username,
        firstName,
        lastName,
      };
  
      // Register the user and get the user object
      const user = await register(email, password, additionalData);
  
      // Assuming that the user object contains a UID
      const userDoc = doc(db, "users", user.uid);
  
      // Set additional data to Firestore
      await setDoc(userDoc, {
        firstName,
        lastName,
        username,
        plan: "free" // Set default plan as free
      }, { merge: true });
  
      if (pricingState && pricingState.fromPricingPage) {
        navigate("/dashboard");
        setPricingState({ fromPricingPage: false }); // Reset the state
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error);
    }
  };
  
  const canProceed = () => {
    if (step === 1) return email !== "";
    if (step === 2)
      return username !== "" && password !== "" && confirmPassword !== "";
    if (step === 3) return firstName !== "" && lastName !== "";
    return false;
  };

  return (
    <div className="container">
      {width > 768 && (
        <div className="promo-section">
          <h1>Welcome to MimicSpeech!</h1>
          <p>Unlock the world with our extensive language library.</p>
          <p>
            Customize your language learning journey with our AI-powered
            application.
          </p>
          {/* Add more promotional content here */}
        </div>
      )}
      <div className="login-section">
        <h1>Register</h1>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>

        <form onSubmit={handleSubmit}>
          {googleSignInPending ? (
            // Intermediate step for Google Sign-In
            <>
              <h2>Almost there! Please complete your profile.</h2>
              <label>
                First Name
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label>
                Last Name
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label>
                Username
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={async () => {
                  try {
                    // Update the Firestore document with the additional information
                    const userDoc = doc(db, "users", currentUser.uid); // Assuming currentUser is your authenticated user
                    const userDocData = await getDoc(userDoc);

                    if (userDocData.exists()) {
                      await setDoc(
                        userDoc,
                        {
                          firstName,
                          lastName,
                          username,
                          plan: "free"
                        },
                        { merge: true }
                      ); // Using merge: true to only update these fields
                    }

                    // Navigate to the next page (e.g., Dashboard)
                    navigate("/dashboard");
                  } catch (error) {
                    console.error("Error updating Firestore document:", error);
                  }
                }}
              >
                Continue
              </button>
            </>
          ) : (
            <>
              {step === 1 && (
                <>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      placeholder="ex: email@address.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceed()}
                  >
                    Next
                  </button>
                  <div className="or">
                    <p>or</p>
                  </div>
                  <button
                    type="button"
                    className="google-signin-button"
                    onClick={signInWithGoogle}
                  >
                    Sign Up with Google
                  </button>
                  {/* <div style={{ height: "20px" }}></div> */}
                  {/* <button
                type="button"
                className="github-signin-button"
                onClick={signInWithGitHub}
              >
                Sign Up with GitHub
              </button> */}
                </>
              )}
              {step === 2 && (
                <>
                  <label>
                    Username
                    <input
                      name="username"
                      type="text"
                      placeholder="Username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                  <div style={{ height: "20px" }}></div>
                  <label>
                    Password
                    <input
                      name="password"
                      type="password"
                      placeholder="Password (min. 6 characters)"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <label>
                    Confirm Password
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceed()}
                  >
                    Next
                  </button>
                </>
              )}
              {step === 3 && (
                <>
                  <label>
                    First Name
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                  <button type="submit" disabled={!canProceed()}>
                    Create Account
                  </button>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
