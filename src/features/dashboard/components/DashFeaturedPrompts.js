import React, { useEffect, useState, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { query, updateDoc, setDoc, doc, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../../services/firebase/FirebaseAuth";
import { useNavigate } from "react-router-dom";
import { BiExpandAlt, BiCollapseAlt } from "react-icons/bi";
import "./DashFeaturedPrompts.css";

const DashFeaturedPrompts = ({ userPrompt, setUserPrompt }) => {
  const { currentUser, db } = useAuth();
  const [featuredPrompts, setFeaturedPrompts] = useState([]);
  const navigate = useNavigate();
  const [promptType, setPromptType] = useState("mostPopular");
  const [popularity, setPopularity] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [isCollapsing, setIsCollapsing] = useState(null);

  useEffect(() => {
    fetchPrompts();
}, [currentUser, promptType]);


  const fetchPrompts = async () => {
    // const db = getFirestore();
    let q;

    if (promptType === "mostPopular") {
        q = query(collection(db, "prompts"), orderBy("popularity", "desc"), limit(16));
    } else {
        q = query(collection(db, "prompts"));
    }
    
    const querySnapshot = await getDocs(q);
    const responses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    setFeaturedPrompts(responses);
};


  const handleUsePrompt = (response) => {
    console.log("Response", response)
    console.log("Response Popularity", response.popularity)
    const newPopularity = response.popularity + 1;
    console.log("New Popularity", newPopularity)
    setUserPrompt(response.prompt);
    navigate("/generator");
    setPopularity(newPopularity);
    window.scrollTo(0, 0);
    handleUpdate(response.id, newPopularity);
  };

  const handleUpdate = async (promptId, newPopularity) => {
    const promptRef = doc(db, "prompts", promptId);
    console.log("PromptRef", promptRef);
    try {
        await updateDoc(promptRef, { popularity: newPopularity });
    } catch (error) {
        console.log("Error updating document:", error.message);
    }
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


  let filteredPrompts = featuredPrompts;
  if (promptType && promptType !== "mostPopular") {
      filteredPrompts = featuredPrompts.filter((r) => r.type === promptType);
  }
  

  return (
    <div className="dash-container">
      <h1>Featured Prompts</h1>
      <div className="dash-filter-container">
        <h3>Feel free to use or edit these prompts as inspiration to create your own!</h3>
        <label className="dash-filter-label">Filter by Genre: </label>
        <div className="dash-filter-wrapper">

        <select
          className="dash-filter-select"
          onChange={(e) => setPromptType(e.target.value)}
        >
          <option value="mostPopular">Most Popular</option>
          <option value="">All</option>
          <option value="Stories">Stories</option>
          <option value="Greetings">Greetings</option>
          <option value="Daily Life">Daily Life</option>
          <option value="Science">Science</option>
          <option value="Funny">Funny</option>
          <option value="Educational">Educational</option>
          <option value="Business">Business</option>
          <option value="Emotional">Emotional</option>
          <option value="Historical">Historical</option>
          <option value="Nature">Nature</option>
        </select>
        </div>
      </div>
      <div style={{ height: "20px" }}></div>
      {filteredPrompts.length === 0 ? (
        <div className="dash-empty-message">
          Error fetching featured prompts, check in later!
        </div>
      ) : (
        <div className="dash-columns">
          {Array.from({ length: 4 }, (_, colIndex) => (
            <div className="dash-column" key={colIndex}>
              {filteredPrompts
                .filter((_, index) => index % 4 === colIndex)
                .map((response, index) => {
                  let heightClass;
                  if (colIndex % 2 === 0) {
                    heightClass = index % 2 === 0 ? "height-120" : "height-100";
                  } else {
                    heightClass = index % 2 === 0 ? "height-100" : "height-120";
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
                      className={`prompt-dash-box ${heightClass} ${additionalClass}`}
                      style={{ zIndex: expandedId === uniqueIndex ? 2 : 1 }} // Add this line
                    >
                      <h2 className="dash-prompt">
                        {response.prompt || "Unnamed Response"}
                      </h2>
                      {/* <p className="dash-language">
                        {response.type}
                      </p> */}
                      {expandedId === uniqueIndex && (
                        <div> 
                            <p className="dash-response">Genre: {response.type}</p>
                        </div> 
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
                        onClick={() => handleUsePrompt(response)}
                      >
                        Use Prompt
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

export default DashFeaturedPrompts;
