import React, { useState, useEffect, useRef } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/firebase/FirebaseAuth";
import "../styles.css";
import { rgb } from "d3";

export const Burger = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Create a ref

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
      right: "24px",
      top: "32px",
    },
    bmBurgerBars: {
      background: "#373a47",
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
      opacity: "0.9",
    },
    bmMenu: {
      background: rgb(220, 220, 220),
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmMorphShape: {
      fill: "#373a47",
    },
    bmItemList: {
      color: "#b8b7ad",
      padding: "0.8em",
    },
    bmItem: {
      display: "block",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
      top: 0,
      bottom: 0,
      left: 200,
    },
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await logout();
      navigate("/");
      setIsOpen(false); // Close the menu
    } catch (error) {
      console.error(error);
    }
  };

  const linkStyle = {
    display: "block",
    padding: "6px",
    textDecoration: "underline",
    cursor: "pointer",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: "16px",
  }; // Inline style for Links

  const closeMenu = () => setIsOpen(false); // This function will close the menu
  const handleStateChange = (state) => setIsOpen(state.isOpen);

  return (
    <Menu
      ref={menuRef}
      isOpen={isOpen}
      onStateChange={handleStateChange}
      styles={styles}
      right
    >
      {!currentUser && (
        <>
          <Link
            id="login"
            className="menu-item"
            to="/login"
            onClick={closeMenu}
            style={linkStyle}
          >
            Login
          </Link>
          <Link
            id="signup"
            className="menu-item"
            to="/signup"
            onClick={closeMenu}
            style={linkStyle}
          >
            Sign Up
          </Link>
        </>
      )}
      {currentUser && (
        <Link
          id="dashboard"
          className="menu-item"
          to="/dashboard"
          onClick={closeMenu}
          style={linkStyle}
        >
          Dashboard
        </Link>
      )}
      <Link
        id="pricing"
        className="menu-item"
        to="/pricing"
        onClick={closeMenu}
        style={linkStyle}
      >
        Pricing Plans
      </Link>
      <div styles={{ height: "100px" }}></div>
      {currentUser && (
        <>
          <Link
            id="saved"
            className="menu-item"
            to="/saved"
            onClick={closeMenu}
            style={linkStyle}
          >
            Saved Responses
          </Link>
          <Link
            id="logout"
            className="menu-item"
            onClick={handleLogout}
            style={linkStyle}
          >
            Logout
          </Link>
        </>
      
      )}
    </Menu>
  );
};
