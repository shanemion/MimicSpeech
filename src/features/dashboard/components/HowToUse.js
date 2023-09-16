import React, { useContext } from "react";
import Sidebar from "../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import PricingModal from "../pricing/PricingModal";
import PricingContext from "../../../services/pricing/PricingContext";
import PopupMenu from "./popup-menu/PopupMenu";
import { DashBurger } from "./DashBurger";
import useWindowSize from "../../../utils/WindowSize";
import "./HowToUse.css";

const HowToUse = () => {
  const { pricingState, setPricingState } = useContext(PricingContext);
  const { width } = useWindowSize();

  const closePricingModal = () => {
    setPricingState(false);
  };
  return (
    <>
      {pricingState && <PricingModal onClose={closePricingModal} />}
      {width < 1000 && <DashBurger />}

      <div className="how-to-use-main">
        <Sidebar />
        <div className="account-popup">
          <PopupMenu />
        </div>
        <div>
          <h1 style={{ marginTop: "120px" }}>
            How to use the AI Prompt Generator
          </h1>
          <h3>Overview</h3>
          <p>
            1. Select the language you want to practice from the left dropdown
            menu.
          </p>
          <p>
            2. Select the language you want to practice to from the right
            dropdown menu.
          </p>
          <p>3. Click the "Go to AI Prompt Generator" button.</p>
          <p>4. Type a topic of your choice to create a scene with!</p>
          <p>5. Select the desired length of your response.</p>
          <p>6. Click the "Generate Response" button.</p>
          <h3>Tools</h3>
          <p>
            7. Press the "Play" button to hear your sentences read out loud!
          </p>
          <p>8. Select the voice that best matches yours :D</p>
          <p>
            9. Click the book icon to isolate and practice a specific sentence!
          </p>
          <p>
            10. Click on a word / character to hear its pronunciation and to
            learn more about it!
          </p>
          <p>
            11. Press the "Record alongside TTS!" button to record your voice
            alongside the AI text to speech!
          </p>
          <p>12. Press the "Record" button to begin recording your voice!</p>
          <p>13. Press the "Stop" button to stop recording!</p>
          <p>14. Press the "Playback" button to hear your recording!</p>
          <p>
            15. Press the "Save and Compare" button to see a visualization and
            accuracy score of your spoken pitch!
          </p>
          <p>
            16. Listen to your saved audios in the "Recorded Audios Section"
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
          {/* <p>
          20. Click the "View Saved Words" button to view your saved words.
        </p> */}
        </div>
      </div>
    </>
  );
};

export default HowToUse;
