import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../services/firebase/FirebaseAuth";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import "../styles.css";

const Bookmark = ({ generatedResponse, language }) => {
  const { currentUser, saveResponse, deleteSavedResponse, getResponseById } =
    useAuth();
  const initialResponseId = localStorage.getItem("responseId");

  // isSaved is initially false if currentUser is null
  const [isSaved, setIsSaved] = useState(
    currentUser ? localStorage.getItem("isSaved") === "true" : false
  );
  const [responseId, setResponseId] = useState(
    localStorage.getItem("responseId")
  ); // Store response ID
  const [showMessage, setShowMessage] = useState(false); // To control showing of pop-up message

  const lastGeneratedResponse = useRef(generatedResponse); // Use a ref to store the last generated response

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("isSaved", isSaved.toString());
    localStorage.setItem("responseId", responseId);
    localStorage.setItem("lastSavedResponse", generatedResponse);
  }, [isSaved, responseId, generatedResponse]);

  // Reset isSaved and responseId when generatedResponse changes and it's not equal to the last generated response
  useEffect(() => {
    if (generatedResponse !== lastGeneratedResponse.current) {
      setIsSaved(false);
      setResponseId(null);
    }
    lastGeneratedResponse.current = generatedResponse; // Update the last generated response
  }, [generatedResponse]);

  // Reset isSaved and responseId when currentUser changes (when the user logs out)
  useEffect(() => {
    if (!currentUser) {
      setIsSaved(false);
      setResponseId(null);
    }
  }, [currentUser]);

  useEffect(() => {
    // When the component mounts, check whether the saved response ID exists in the database
    const checkSavedResponse = async () => {
      if (currentUser && initialResponseId) {
        const response = await getResponseById(
          currentUser.uid,
          initialResponseId
        );
        if (response) {
          setIsSaved(true);
        } else {
          // If the saved response ID doesn't exist, reset it
          localStorage.removeItem("isSaved");
          localStorage.removeItem("responseId");
          setResponseId(null);
        }
      }
    };

    checkSavedResponse();
  }, [currentUser, initialResponseId, getResponseById]);

  const handleClick = async () => {
    if (currentUser) {
      if (isSaved) {
        if (responseId) {
          await deleteSavedResponse(currentUser.uid, responseId);
          setIsSaved(false);
        }
      } else {
        const responseId = await saveResponse(
          currentUser.uid,
          { text: generatedResponse, audioUrl: "fake.test/url" },
          language
        );
        setResponseId(responseId); // Save response ID
        setIsSaved(true);
      }
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Message will disappear after 3 seconds
    }
  };

  return (
    <div className="bookmark-container">
      <button onClick={handleClick}>
        {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
      </button>
      {showMessage && (
        <div className="login-message">
          Login or Register to save responses!
        </div>
      )}
    </div>
  );
};

export default Bookmark;
