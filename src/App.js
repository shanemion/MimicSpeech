import React from "react";
import { LangAndGenderSelector } from "./components/LangAndGenderSelector";
import { Navigator } from "./infrastructure/navigation/GeneratorNavigator";

import LanguageProvider from "./services/language/LanguageProvider";

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <LangAndGenderSelector />
        <Navigator />
      </LanguageProvider>
    </div>
  );
}

export default App;
