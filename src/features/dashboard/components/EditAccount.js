import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../../services/firebase/FirebaseAuth"; // Add updatePassword here
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import "./EditAccount.css";
import PricingModal from "../pricing/PricingModal";
import PopupMenu from "./popup-menu/PopupMenu";
import { DashBurger } from "./DashBurger";
import useWindowSize from "../../../utils/WindowSize";

const EditAccount = () => {
  const { currentUser, db, fetchPlan, fetchCredits } = useAuth(); // Assuming useAuth hook provides currentUser and Firestore database instance
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [plan, setPlan] = useState("");
  const [credits, setCredits] = useState("");
  const [pricingState, setPricingState] = useState(false);

  const [isVerified, setIsVerified] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { width } = useWindowSize();

  const closePricingModal = () => {
    setPricingState(false);
  };

  const openPricing = () => {
    setPricingState(true);
  };

  // New function to verify current password
  const handleVerifyPassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      setIsVerified(true);
      alert("Password verified. You can now update your account.");
    } catch (error) {
      alert("Failed to verify password. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUserPlan = async () => {
      const userPlan = await fetchPlan(currentUser.uid);
      setPlan(userPlan);
    };

    fetchUserPlan();

    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();
  }, [currentUser, fetchPlan, fetchCredits]);

  useEffect(() => {
    // Fetch existing data from Firestore when the component mounts
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setUsername(userData.username);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currentUser, db]);

  const handleUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      console.log("Current User:", currentUser);

      // Update Firestore logic
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          firstName,
          lastName,
          username,
        },
        { merge: true }
      );

      // Re-authenticate user before updating email or password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update email if needed
      if (newEmail) {
        await updateEmail(currentUser, newEmail);

        // Send verification email for the updated email
        await sendEmailVerification(currentUser);
        alert("Email updated and verification email sent!");
      }

      // Update password if needed
      if (newPassword) {
        await updatePassword(currentUser, newPassword); // Using the modular function
      } else {
        console.log("New password is empty. Not updating password.");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating account:", error);

      // Custom error messages based on error code
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("The new email address is already in use by another account.");
          break;
        case "auth/invalid-email":
          alert("Please enter a valid email address.");
          break;
        default:
          alert(
            "Failed to update account. Please check the console for more details."
          );
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      try {
        // Re-authenticate user before deleting the account
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);

        await deleteUser(currentUser);
        alert("Account deleted.");
        navigate("/"); // Redirect to home page or login
      } catch (error) {
        console.error("Error deleting account:", error);

        // Custom error messages based on error code
        switch (error.code) {
          case "auth/requires-recent-login":
            alert("Please re-login and try deleting your account again.");
            break;
          default:
            alert(
              "Failed to delete account. Please check the console for more details."
            );
        }
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="account-main-container">
        {pricingState && <PricingModal onClose={closePricingModal} />}
        {width > 1000 && (
          <div className="account-sidebar-wrapper">
            <div className="sidebar">
              <h2>
                {firstName} {lastName}
              </h2>
              <span>{credits} Credits</span>
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button onClick={() => navigate("/saved")}>
                Saved Responses
              </button>
              {/* <button onClick={() => navigate("/translator")}>
            Sentence Translator
          </button>
          <button onClick={() => navigate("/text-input")}>
            Input Custom Text
          </button> */}
              {/* <button onClick={() => navigate("/words")}>Saved Words</button> */}
              <div style={{ height: "40vh" }}></div>
              <div className="sidebar-footer">
                <h3>Current Plan: {plan}</h3>
                <span className="plan-credits">
                  {credits} Credits Remaining
                </span>
                <button
                  className="dashboard-footer-button"
                  onClick={openPricing}
                >
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="edit-account-container">
          <div style={{ height: "80px" }}></div>
          <h1 className="edit-account-title"> Your Information</h1>
          <p className="edit-account-label">Name:</p>
          <p className="edit-account-info">
            {firstName} {lastName}
          </p>

          <p className="edit-account-label">Username: </p>
          <p className="edit-account-info">{username}</p>

          <p className="edit-account-label">Email: </p>
          <p className="edit-account-info">{currentUser.email}</p>

          <div style={{ height: "30px" }}></div>

          <h1 className="edit-account-title">Your Plan</h1>

          <p className="edit-account-label">Plan: </p>
          <p className="edit-account-info">{plan}</p>

          <p className="edit-account-label">Credits:</p>
          <p className="edit-account-info">{credits}</p>

          <div style={{ height: "30px" }}></div>

          {/* <h1 className="edit-account-title">Edit Account</h1> */}
          <form className="edit-account-form">
            {!isVerified ? (
              <>
                <h2>Verify Current Password to Edit Account</h2>
                <label className="edit-account-label">
                  Current Password
                  <input
                    className="edit-account-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="verify-password"
                  onClick={handleVerifyPassword}
                >
                  Verify Password
                </button>
              </>
            ) : (
              <>
                <h2>Update Information</h2>
                <label className="edit-account-label">
                  First Name
                  <input
                    className="edit-account-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="edit-account-label">
                  Last Name
                  <input
                    className="edit-account-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <label className="edit-account-label">
                  Username
                  <input
                    className="edit-account-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
                <label className="edit-account-label">
                  New Email
                  <input
                    className="edit-account-input"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </label>
                <h2>Update Password</h2>
                <label className="edit-account-label">
                  Current Password (for verification)
                  <input
                    className="edit-account-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>
                <label className="edit-account-label">
                  New Password
                  <input
                    className="edit-account-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label className="edit-account-label">
                  Confirm New Password
                  <input
                    className="edit-account-input"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </label>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <button
                    className="edit-account-button"
                    type="button"
                    onClick={handleUpdate}
                  >
                    Update Account
                  </button>
                  <button
                    className="delete-account-button"
                    type="button"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </form>
          <Link className="edit-account-backlink" to="/dashboard">
            Go Back to Dashboard
          </Link>
        </div>
        <div className="account-dashboard-header">
          {width < 1000 && <DashBurger />}
        </div>
      </div>
      <div className="account-popup">
        <PopupMenu />
      </div>
    </>
  );
};

export default EditAccount;
