import React, { useState, useEffect, useRef, useContext } from "react";
import { useAuth } from "../services/firebase/FirebaseAuth";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useSavedResponse } from "../services/saved/SavedContext";
import LanguageContext from "../services/language/LanguageContext";
import "../styles.css";

const Bookmark = ({ typeResponse, typedResponse, generatedResponse, language, userPrompt, responseLength }) => {
  const { currentUser, saveResponse, deleteSavedResponse, getResponseById } =
    useAuth();
    const { isSaved, setIsSaved } = useSavedResponse(); // Get isSaved and setIsSaved from context

  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);

  const initialResponseId = localStorage.getItem("responseId");

  // isSaved is initially false if currentUser is null

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
          setIsSaved(false);
        }
      }
    };

    checkSavedResponse();
  }, [currentUser, initialResponseId, getResponseById]);

  const handleClick = async () => {
    // console.log("isSaved:", isSaved, "setIsSaved:", setIsSaved);

    if (currentUser) {
      if (isSaved) {
        if (responseId) {
          await deleteSavedResponse(currentUser.uid, responseId);
          setIsSaved(false);
        }
      } else {
        const responseId = await saveResponse(
          currentUser.uid,
          { text: generatedResponse },
          language,
          fromLanguage,
          selectedLanguage,
          userPrompt,
          responseLength
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
