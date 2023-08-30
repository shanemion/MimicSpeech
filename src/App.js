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
import SavedResponses from "./components/SavedResponses";
import { Footer } from "./components/Footer";
import { SavedResponseProvider } from "./services/saved/SavedContext";
import { SavedAudioProvider } from "./services/saved/SavedAudioContext";
import LandingPage from "./features/landing-page/LandingPage";
import PricingPage from "./features/landing-page/components/pricing/PricingPage";
import PaymentSuccessPage from "./features/landing-page/components/pricing/PaymentSuccessPage";
import { PricingProvider } from "./services/pricing/PricingContext";
import Dashboard from "./features/dashboard/Dashboard";

function App() {
  const [typeResponse, setTypeResponse] = useState(false);

  return (
    <Router>
      <div className="page-container">
        <PricingProvider>
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
        </PricingProvider>
      </div>
    </Router>
  );
}

export default App;
