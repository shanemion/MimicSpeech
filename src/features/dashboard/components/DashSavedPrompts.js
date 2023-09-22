import React, { useState, useContext, useEffect, useRef } from "react";
import "./DashSavedPrompts.css";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../../services/language/LanguageContext";
import { useSavedResponse } from "../../../services/saved/SavedContext";
import { useAuth } from "../../../services/firebase/FirebaseAuth";
import { BiExpandAlt, BiCollapseAlt } from "react-icons/bi";

const DashSavedPrompts = ({
  userPrompt,
  setUserPrompt,
  responseLength,
  setResponseLength,
}) => {
  const { currentUser, deleteSavedResponse } = useAuth();
  const { isSaved, setIsSaved } = useSavedResponse();
  const [savedResponses, setSavedResponses] = useState([]);
  const { ref, storage, deleteObject } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const [filterLanguage, setFilterLanguage] = useState("");
  const [isCollapsing, setIsCollapsing] = useState(null);

  const navigate = useNavigate();
  const {
    fromLanguage,
    setFromLanguage,
    selectedLanguage,
    setSelectedLanguage,
  } = useContext(LanguageContext);

  useEffect(() => {
    fetchResponses();
  }, [currentUser]);

  const fetchResponses = async () => {
    const db = getFirestore();
    const q = query(collection(db, "users", currentUser.uid, "responses"));
    const querySnapshot = await getDocs(q);
    const responses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSavedResponses(responses);
  };

  const handleUseResponse = (response) => {
    localStorage.setItem("responseId", response.id);
    localStorage.setItem("generatedResponse", response.text);
    localStorage.setItem("responseLanguage", response.language);
    localStorage.setItem("numSentences", response.numSentences);
    setFromLanguage(response.fromLanguage);
    setSelectedLanguage(response.selectedLanguage);
    setUserPrompt(response.userPrompt);
    setResponseLength(response.responseLength);
    navigate("/generator");
    window.scrollTo(0, 0);

    setIsSaved(true);
  };

  const boxRefs = useRef({});

  const toggleExpand = (id) => {
    if (expandedId !== null && boxRefs.current[expandedId]) {
      boxRefs.current[expandedId].scrollTop = 0;
    }
    if (expandedId === id) {
      setIsCollapsing(true);
      setTimeout(() => {
        setExpandedId(null);
        setIsCollapsing(false);
      }, 500); // 500ms to sync with CSS animation duration
    } else {
      setExpandedId(id);
    }
  };

  const captureFirstTwoSentences = (str) => {
    // This regular expression matches up to two sentences
    const re =
      /(.+?[.。!?!？¡।॥،؛„“«»„“‘’“”]+)\s*(.*?[.。!?!？¡।॥،؛„“«»„“‘’“”]+)?/;
    const match = str.match(re);

    if (match) {
      let result = match[1];

      // Add the second sentence if it exists
      if (match[2]) {
        result += " " + match[2];
      }

      return result;
    }

    return "";
  };

  const filteredResponses = filterLanguage
    ? savedResponses.filter((r) => r.selectedLanguage.value === filterLanguage)
    : savedResponses;

  return (
    <div className="dash-container">
      <h1>Your Saved Topics</h1>
      <h3>Select "Use Response" to practice your saved sentences!</h3>
      <div className="dash-filter-container">
        <div style={{ height: "6px" }}></div>

        <label className="dash-filter-label">Filter by Language: </label>
        <div className="dash-filter-wrapper">
          <select
            className="dash-filter-select"
            onChange={(e) => setFilterLanguage(e.target.value)}
          >
            <option value="">All</option>
            <option value="Chinese">Chinese</option>
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Russian">Russian</option>
            <option value="Spanish">Spanish</option>
            <option value="Vietnamese">Vietnamese</option>
          </select>
        </div>
      </div>
      <div style={{ height: "20px" }}></div>
      {filteredResponses.length === 0 ? (
        <div className="dash-empty-message">
          Nothing here yet, start learning now!
        </div>
      ) : (
        <div className="dash-columns">
          {Array.from({ length: 4 }, (_, colIndex) => (
            <div className="dash-column" key={colIndex}>
              {filteredResponses
                .filter((_, index) => index % 4 === colIndex)
                .map((response, index) => {
                  let heightClass;
                  if (colIndex % 2 === 0) {
                    heightClass = index % 2 === 0 ? "height-220" : "height-200";
                  } else {
                    heightClass = index % 2 === 0 ? "height-200" : "height-220";
                  }
                  const uniqueIndex = colIndex + index * 4;
                  let additionalClass =
                    expandedId === uniqueIndex ? "expanded" : "";
                  if (isCollapsing && expandedId === uniqueIndex) {
                    additionalClass += " collapsed";
                  }
                  return (
                    <div
                      ref={(el) => {
                        boxRefs.current[uniqueIndex] = el;
                      }} // Add this line
                      key={uniqueIndex}
                      className={`dash-box ${heightClass} ${additionalClass}`}
                      style={{ zIndex: expandedId === uniqueIndex ? 2 : 1 }} // Add this line
                    >
                      <h2 className="dash-prompt">
                        {response.userPrompt || "Unnamed Response"}
                      </h2>
                      <p className="dash-language">
                        {response.selectedLanguage.value}
                      </p>
                      <p className="dash-sentence">
                        {captureFirstTwoSentences(response.text) || ""}
                      </p>
                      {expandedId === uniqueIndex && (
                        <p className="dash-response">{response.text}</p>
                      )}
                      <button
                        className={`dash-toggle ${
                          expandedId === uniqueIndex ? "expanded" : ""
                        }`}
                        onClick={() => toggleExpand(uniqueIndex)}
                      >
                        {expandedId === uniqueIndex ? (
                          <BiCollapseAlt />
                        ) : (
                          <BiExpandAlt />
                        )}
                      </button>
                      <button
                        className="dash-use"
                        onClick={() => handleUseResponse(response)}
                      >
                        Use Response
                      </button>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashSavedPrompts;
