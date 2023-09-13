import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navigator } from "./infrastructure/navigation/GeneratorNavigator";
import LanguageProvider from "./services/language/LanguageProvider";
import Login from "./features/registration/Login";
import Register from "./features/registration/Register";
import { AuthProvider } from "./services/firebase/FirebaseAuth";
import SavedResponses from "./features/saved-responses/SavedResponses";
import { SavedResponseProvider } from "./services/saved/SavedContext";
import { SavedAudioProvider } from "./services/saved/SavedAudioContext";
import LandingPage from "./features/landing-page/LandingPage";
import PricingPage from "./features/landing-page/components/pricing/PricingPage";
import PaymentSuccessPage from "./features/landing-page/components/pricing/PaymentSuccessPage";
import { PricingProvider } from "./services/pricing/PricingContext";
import Dashboard from "./features/dashboard/Dashboard";
import EditAccount from "./features/dashboard/components/EditAccount";
import ManagePlan from "./features/dashboard/pricing/ManagePlan";
import { TypedResponseProvider } from "./services/type-response/TypedResponseContext";

function App() {
  const [typeResponse, setTypeResponse] = useState(false);
  const [userPrompt, setUserPrompt] = useState(
    localStorage.getItem("userPrompt") || ""
  );
  const [responseLength, setResponseLength] = useState(
    parseInt(localStorage.getItem("numSentences"), 10) || 3
  );

  return (
    <Router>
      <div className="page-container">
        <PricingProvider>
          <AuthProvider>
            <SavedResponseProvider>
              <SavedAudioProvider>
                <LanguageProvider>
                  <TypedResponseProvider>
                    <div className="App">
                      <div className="content">
                        <Routes>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Register />} />
                          <Route path="/pricing" element={<PricingPage />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route
                            path="/payment-success"
                            element={<PaymentSuccessPage />}
                          />
                          <Route
                            path="/generator"
                            element={
                              <div>
                                <Navigator
                                  typeResponse={typeResponse}
                                  setTypeResponse={setTypeResponse}
                                  userPrompt={userPrompt}
                                  setUserPrompt={setUserPrompt}
                                  responseLength={responseLength}
                                  setResponseLength={setResponseLength}
                                />
                              </div>
                            }
                          />
                          <Route
                            path="/saved"
                            element={
                              <SavedResponses
                                userPrompt={userPrompt}
                                setUserPrompt={setUserPrompt}
                                responseLength={responseLength}
                                setResponseLength={setResponseLength}
                              />
                            }
                          />
                          <Route path="/account" element={<EditAccount />} />
                          <Route path="/manage-plan" element={<ManagePlan />} />
                        </Routes>
                      </div>
                    </div>
                  </TypedResponseProvider>
                </LanguageProvider>
              </SavedAudioProvider>
            </SavedResponseProvider>
          </AuthProvider>
        </PricingProvider>
      </div>
    </Router>
  );
}

export default App;
