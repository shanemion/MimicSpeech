import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigator } from "./infrastructure/navigation/GeneratorNavigator";
import LanguageProvider from "./services/language/LanguageProvider";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthButtons from "./components/ButtonsRenderer";
import { AuthProvider } from "./services/firebase/FirebaseAuth";
import SavedResponses from "./components/SavedResponses";
import { Title } from "./components/Title";
import useWindowSize from "./utils/WindowSize";
import { Burger } from "./components/Burger";
import { Selectors } from "./components/Selectors";
import { Footer } from "./components/Footer";
import { SavedResponseProvider } from "./services/saved/SavedContext";
import { Save } from "@mui/icons-material";
import { SavedAudioProvider } from "./services/saved/SavedAudioContext";

function App() {
  const { width } = useWindowSize();
  const [typeResponse, setTypeResponse] = useState(false);

  return (
    <Router>
      <div className="page-container">
        <AuthProvider>
          <SavedResponseProvider>
            <SavedAudioProvider>
              <LanguageProvider>
                <div className="App">
                  <div className="titleContainer">
                    <div className="subTitleContainer">
                      <Title />
                      <div>
                        <Selectors
                          className="selectors"
                          typeResponse={typeResponse}
                          setTypeResponse={setTypeResponse}
                        />
                      </div>
                    </div>
                    {width > 1300 ? <AuthButtons /> : <Burger />}
                  </div>
                  <div className="content">
                    <Routes>
                      <Route
                        path="/*"
                        element={
                          <div>
                            <Navigator
                              typeResponse={typeResponse}
                              setTypeResponse={setTypeResponse}
                            />
                          </div>
                        }
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
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
