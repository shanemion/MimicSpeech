import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigator } from "./infrastructure/navigation/GeneratorNavigator";
import LanguageProvider from "./services/language/LanguageProvider";
import Login from "./features/registration/Login";
import Register from "./features/registration/Register";
import { AuthProvider } from "./services/firebase/FirebaseAuth";
import SavedResponses from "./components/SavedResponses";
import { Footer } from "./components/Footer";
import { SavedResponseProvider } from "./services/saved/SavedContext";
import { SavedAudioProvider } from "./services/saved/SavedAudioContext";
import LandingPage from "./features/landing-page/LandingPage";

function App() {
  const [typeResponse, setTypeResponse] = useState(false);

  return (
    <Router>
      <div className="page-container">
        <AuthProvider>
          <SavedResponseProvider>
            <SavedAudioProvider>
              <LanguageProvider>
                <div className="App">
                  <div className="content">
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Register />} />
                      <Route
                        path="/generator"
                        element={
                          <div>
                            <Navigator
                              typeResponse={typeResponse}
                              setTypeResponse={setTypeResponse}
                            />
                          </div>
                        }
                      />
                      <Route path="/saved" element={<SavedResponses />} />
                    </Routes>
                  </div>
                  {/* <Footer /> */}
                </div>
              </LanguageProvider>
            </SavedAudioProvider>
          </SavedResponseProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
