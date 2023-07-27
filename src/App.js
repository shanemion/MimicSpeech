import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LangAndGenderSelector } from "./components/LangAndGenderSelector";
import { Navigator } from "./infrastructure/navigation/GeneratorNavigator";
import LanguageProvider from "./services/language/LanguageProvider";
import Login from "./components/Login";
import Register from './components/Register';
import AuthButtons from './components/ButtonsRenderer';
import { AuthProvider } from './services/firebase/FirebaseAuth';
import SavedResponses from './components/SavedResponses'; 

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <AuthButtons />
          <Routes>
          <Route path="/*" element={
              <LanguageProvider>
                <LangAndGenderSelector />
                <Navigator />
              </LanguageProvider>
            }/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/saved" element={<SavedResponses />} />
            
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
