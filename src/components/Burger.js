import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/firebase/FirebaseAuth";
import "../styles.css";

export const Burger = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "32px",
      height: "24px",
      right: "24px",
      top: "46px",
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
      height: "100%",
    },
    bmMenu: {
      background: "white",
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
    },
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await logout();
      navigate("/login");
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: "16px"
  }; // Inline style for Links

  const closeMenu = () => setIsOpen(false); // This function will close the menu
  const handleStateChange = (state) => setIsOpen(state.isOpen);

  return (
    <Menu isOpen={isOpen} onStateChange={handleStateChange} styles={styles} right>
      {currentUser ? (
        <>
          <Link
            id="logout"
            className="menu-item"
            onClick={handleLogout}
            style={linkStyle}
          >
            Logout
          </Link>
          <Link id="saved" className="menu-item" to="/saved" onClick={closeMenu}
style={linkStyle}>
            View Saved
          </Link>
        </>
      ) : (
        <>
          <Link id="login" className="menu-item" to="/login" onClick={closeMenu} style={linkStyle}>
            Login
          </Link>
          <Link
            id="register"
            className="menu-item"
            to="/register"
            onClick={closeMenu}
            style={linkStyle}
          >
            Register
          </Link>
        </>
      )}
    </Menu>
  );
};
