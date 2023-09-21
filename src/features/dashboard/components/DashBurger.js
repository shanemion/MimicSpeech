import React, { useState, useEffect, useRef, useContext } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/firebase/FirebaseAuth";
import PricingContext from "../../../services/pricing/PricingContext";
import PricingModal from "../pricing/PricingModal";
import LanguageContext from "../../../services/language/LanguageContext";
import "../Dashboard.css";
import "./DashBurger.css";

export const DashBurger = () => {
  const navigate = useNavigate();
  const { currentUser, fetchCredits, fetchFirstName, fetchLastName } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Create a ref
  const { pricingState, setPricingState } = useContext(PricingContext);
  const [credits, setCredits] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);

  useEffect(() => {
    const fetchUserCredits = async () => {
      const userCredits = await fetchCredits(currentUser.uid);
      setCredits(userCredits);
    };

    fetchUserCredits();

    const fetchUserFirstName = async () => {
      const userFirstName = await fetchFirstName(currentUser.uid);
      setFirstName(userFirstName);
    };

    fetchUserFirstName();

    const fetchUserLastName = async () => {
      const userLastName = await fetchLastName(currentUser.uid);
      setLastName(userLastName);
    };

    fetchUserLastName();
  }, [currentUser, fetchCredits, fetchFirstName, fetchLastName]);

  const closePricingModal = () => {
    setPricingState(false);
  };

  const openPricing = () => {
    setPricingState(true);
  };

  useEffect(() => {
    // Add click event listener to the overlay
    const overlay = document.querySelector(".bm-overlay");
    overlay.addEventListener("click", () => {
      if (menuRef.current) {
        setIsOpen(false); // Close the menu
      }
    });

    // Cleanup
    return () => {
      overlay.removeEventListener("click", () => {
        if (menuRef.current) {
          setIsOpen(false); // Close the menu
        }
      });
    };
  }, []);

  const styles = {
    bmBurgerButton: {
      position: "absolute",
      width: "32px",
      height: "24px",
      left: "24px",
      top: "32px",
    },
    bmBurgerBars: {
      background: "black",
    },
    bmCrossButton: {
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: "#bdc3c7",
    },
    bmMenuWrap: {
      position: "fixed",
      top: 0,
      bottom: 0,
      zIndex: "20000",
      opacity: ".99",
      width: "350px",
    },
    bmMenu: {
      // background: "rgba(220, 220, 220, 1)",
      background: "#00766E",
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmMorphShape: {
      fill: "#373a47",
    },
    bmItemList: {
      color: "white",
      padding: "0.8em",
    },

    bmItem: {
      display: "block",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.5)",
      top: 0,
      bottom: 0,
      left: 0,
      // marginRight: "900px",
    },
  };

  const linkStyle = {
    display: "block",
    padding: "10px 6px 6px 0",
    textDecoration: "underline",
    cursor: "pointer",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: "16px",
    color: "white",
  };

  const closeMenu = () => setIsOpen(false); // This function will close the menu
  const handleStateChange = (state) => setIsOpen(state.isOpen);

  const handleNavigation = (route) => {
    navigate(route);
    closeMenu();
  };

  return (
    <Menu
      ref={menuRef}
      isOpen={isOpen}
      onStateChange={handleStateChange}
      styles={styles}
      left
    >
      <h2>
        {firstName} {lastName}
      </h2>
      <span>{credits} Credits</span>

      <Link
        to={selectedLanguage && fromLanguage ? "/generator" : "/dashboard"}
        className="link"
        onClick={
          selectedLanguage && fromLanguage
            ? () => navigate("/generator")
            : () => {
                navigate("/dashboard");
                alert("Please select languages to practice!");
              }
        }
      >
        AI Prompt Generator
      </Link>

      <Link to="/dashboard" className="link" onClick={closeMenu}>
        Dashboard
      </Link>
      <Link to="/saved" className="link" onClick={closeMenu}>
        Saved Responses
      </Link>
      <Link to="/how-to-use" className="link" onClick={closeMenu}>
        How to Use
      </Link>
      {/* <Link to="/translator" onClick={closeMenu}>
        Sentence Translator
      </Link>
      <Link to="/text-input" onClick={closeMenu}>
        Input Custom Text
      </Link> */}
      {/* <Link to="/words" onClick={closeMenu}>
        Saved Words
      </Link> */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="sidebar-footer">
          <h3>Current Plan: {/* {currentUser.plan} */}</h3>
          <span className="plan-credits">{credits} Credits Remaining</span>
          <button
            className="dashboard-footer-button"
            onClick={() => {
              openPricing();
              closeMenu();
            }}
          >
            Manage Plan
          </button>
        </div>
      </div>
    </Menu>
  );
};
