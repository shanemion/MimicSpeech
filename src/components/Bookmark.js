import React, { useState, useEffect, useRef, useContext } from "react";
import { useAuth } from "../services/firebase/FirebaseAuth";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useSavedResponse } from "../services/saved/SavedContext";
import LanguageContext from "../services/language/LanguageContext";
import "../styles.css";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
const Bookmark = ({
  typeResponse,
  typedResponse,
  generatedResponse,
  language,
  userPrompt,
  responseLength,
}) => {
  const { currentUser, saveResponse, deleteSavedResponse } =
    useAuth();
  const { isSaved, setIsSaved } = useSavedResponse(); // Get isSaved and setIsSaved from context

  const { fromLanguage, selectedLanguage } = useContext(LanguageContext);

  const [showMessage, setShowMessage] = useState(false); // To control showing of pop-up message


  // Reset isSaved and responseId when currentUser changes (when the user logs out)
  useEffect(() => {
    if (!currentUser) {
      setIsSaved(false);
      localStorage.removeItem("responseId");
    }
  }, [currentUser]);

  // useEffect(() => {
  //   const checkSavedResponse = async () => {
  //     if (currentUser && responseId) {
  //       const response = await getResponseById(
  //         currentUser.uid,
  //         initialResponseId
  //       );
  //       if (response) {
  //         setIsSaved(true);
  //       } else {
  //         setIsSaved(false);
  //       }
  //     }
  //   };
  //   checkSavedResponse();
  // }, [currentUser, initialResponseId, getResponseById, setIsSaved]);

  const handleClick = async () => {
    // console.log("isSaved:", isSaved, "setIsSaved:", setIsSaved);
    let currResponse = localStorage.getItem("responseId")
    console.log("Before handleClick: ", { isSaved, currResponse });

    if (currentUser) {
      if (isSaved) {
        if (currResponse !== null) {
          console.log("DelresponseId:", currResponse);
          await deleteSavedResponse(currentUser.uid, currResponse);
          console.log("delted responseId:", currResponse);
          setIsSaved(false);
          localStorage.removeItem("responseId");
          console.log("isSaved After handleClick: ", { isSaved, currResponse });
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
        localStorage.setItem("responseId", responseId);
        setIsSaved(true);
      }
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Message will disappear after 3 seconds
    }
  };

  return (
    <div className="bookmark-container">
      <button
        className={isSaved ? "button-saved" : "button-not-saved"}
        onClick={handleClick}
      >
        <BsBookmarkFill />
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
