import React, { useContext, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import PricingModal from "../pricing/PricingModal";
import PricingContext from "../../../services/pricing/PricingContext";
import PopupMenu from "./popup-menu/PopupMenu";
import { DashBurger } from "./DashBurger";
import useWindowSize from "../../../utils/WindowSize";
import "./HowToUse.css";
import { useAuth } from "../../../services/firebase/FirebaseAuth";

const HowToUse = () => {
  const { pricingState, setPricingState } = useContext(PricingContext);
  const { width } = useWindowSize();
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const closePricingModal = () => {
    setPricingState(false);
  };
  return (
    <>
      {pricingState && <PricingModal onClose={closePricingModal} />}
      {width < 1000 && <DashBurger />}

      <div className="how-to-use-main">
        {currentUser && <Sidebar />}
        {currentUser && (
          <div className="account-popup">
            <PopupMenu />
          </div>
        )}

        <div>
          <h1 style={{ marginTop: "100px" }}>
            How to use the AI Scenario Generator
          </h1>
          <h3>Overview</h3>
          <p>
            The AI Scenario Generator is a tool that helps you practice speaking
            in a foreign language.
          </p>
          <p>
            It uses AI to generate a conversation scenario based on a topic of
            your choice.
          </p>
          <p>
            You can then practice speaking by recording your voice and comparing
            it to the AI text to speech.
          </p>
          <p>Record yourself speaking alongside the text to speech, or separately!</p>
          <p>
            The AI Scenario Generator will then give you feedback on your
            pronunciation and pitch with a graph visualization and an accuracy
            percentage.
          </p>
          <p>
            We recommend using headphones and a microphone for the best user experience.
          </p>
          <h3>Dashboard</h3>
       
          <p>
            1. Select the languages you want to practice from the dropdown menus
            in your Dashboard.
          </p>
          <p>
            2. Scroll down to see your saved prompts and featured prompts. You can click on a prompt to practice it, or use it as inspiration to create your own!
          </p>
          <p>
            3. Click the "Start Learning" button to navigate to our generator.
          </p>
          <h3>AI Scenario Generator</h3>
          <img
                src="/images/Interface.png"
                alt="Custom Prompts"
                className="sixty-image"
              />          

          <p>4. Type a topic of your choice to create a scene with.</p>
          <p>5. Select the desired length of your response.</p>
          <p>6. Click the "Generate Scenario" button to see your scenario brought to life!</p>
          <h3>Tools</h3>

          <img
                  src="/images/TTS.png"
                  alt="Natural Text-to-Speech"
                  className="sixty-image"
                />
          <p>
            7. Press the "Play" button to hear your sentences read out loud!
          </p>
          <p>8. Select the voice that best matches yours.</p>
       
          
          <p>
            9. Click on any word / character to hear its pronunciation and to
            learn more about it!
          </p>
          <p>
            10. Press the "Record alongside TTS!" button to record your voice
            alongside the AI text to speech!
          </p>
          <p>11. Press the "Record" button to begin recording your voice!</p>
          <p>12. Press the "Stop" button to stop recording!</p>
          <p>13. Press the "Playback" button to hear your recording!</p>
          <p>
            14. Press the "Save and Compare" button to see a visualization and
            accuracy score of your spoken pitch!
          </p>
          <h3>Practice Mode</h3>
          <img
                  src="/images/v0PracticeMode.png"
                  alt="Practice Mode"
                  className="sixty-image"
                />
          <p>
            15. Click the book icon to isolate and practice a specific sentence in our Practice Mode! Our practice mode gives you specific feedback on your pronunciation and pitch for your selected sentence.
          </p>
          <h3>View Your Results</h3>
          <img
                src="/images/v0AnalyzeProgress.png"
                alt="Analyze Your Progress"
                className="sixty-image"
              />
      
          <p>
            16. Scroll under the Generator interface to view your Pitch Graphs and to listen to your saved audios in the "Recorded Audios Section"
            under your graph.
          </p>
          <h3>Favorites</h3>
          <p>17. Click the Bookmark to save the response to your account.</p>
          <p>
            18. Click the "View Saved Responses" button to view your saved
            responses.
          </p>
          <p>
            19. Select "Use this response" from the saved responses page to use
            a saved response.
          </p>
          <h3>Manage Plans</h3>
          <p>
            20. Click the "Manage Plans" button to view our pricing plans and to choose the one best for you. Happy learning!
          </p>
          <div style={{ height: "100px" }}></div>
        </div>
      </div>
    </>
  );
};

export default HowToUse;
