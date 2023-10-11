import React, { useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navigator } from "./infrastructure/navigation/GeneratorNavigator";
import LanguageProvider from "./services/language/LanguageProvider";
import LoaderIcon from "react-loader-icon";
import { AuthProvider } from "./services/firebase/FirebaseAuth";
import { SavedResponseProvider } from "./services/saved/SavedContext";
import { SavedAudioProvider } from "./services/saved/SavedAudioContext";
import LandingPage from "./features/landing-page/LandingPage";
import { PricingProvider } from "./services/pricing/PricingContext";
import { TypedResponseProvider } from "./services/type-response/TypedResponseContext";

// Lazy loaded components
const Login = lazy(() => import("./features/registration/Login"));
const Register = lazy(() => import("./features/registration/Register"));
const SavedResponses = lazy(() =>
  import("./features/saved-responses/SavedResponses")
);
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const PaymentSuccessPage = lazy(() =>
  import("./features/landing-page/components/pricing/PaymentSuccessPage")
);
const EditAccount = lazy(() =>
  import("./features/dashboard/components/EditAccount")
);
const ManagePlan = lazy(() =>
  import("./features/dashboard/pricing/ManagePlan")
);
const SubscriptionCanceled = lazy(() =>
  import("./features/dashboard/pricing/SubscriptionCanceled")
);
const HowToUse = lazy(() => import("./features/dashboard/components/HowToUse"));

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
                        <Suspense
                          fallback={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100vh",
                              }}
                            >
                              <LoaderIcon type={"spin"} />
                            </div>
                          }
                        >
                          <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Register />} />
                            <Route
                              path="/dashboard"
                              element={
                                <Dashboard
                                  userPrompt={userPrompt}
                                  setUserPrompt={setUserPrompt}
                                  responseLength={responseLength}
                                  setResponseLength={setResponseLength}
                                />
                              }
                            />
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
                            <Route
                              path="/manage-plan"
                              element={<ManagePlan />}
                            />
                            <Route
                              path="/subscription-canceled"
                              element={<SubscriptionCanceled />}
                            />
                            <Route path="/how-to-use" element={<HowToUse />} />
                          </Routes>
                        </Suspense>
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
