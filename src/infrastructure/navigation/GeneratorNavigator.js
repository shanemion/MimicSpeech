import React, {useContext} from "react";
import ChineseResponseGenerator from "../../components/generators/ChineseResponseGenerator";
import SpanishResponseGenerator from "../../components/generators/JapaneseResponseGenerator";
import BurmeseResponseGenerator from "../../components/generators/BurmeseResponseGenerator";
import JapaneseResponseGenerator from "../../components/generators/JapaneseResponseGenerator";
import VietnameseResponseGenerator from "../../components/generators/VietnameseResponseGenerator";

import LanguageContext from "../../services/language/LanguageContext";


export const Navigator = () => {
    const { selectedLanguage } = useContext(LanguageContext);

    if (!selectedLanguage) {
        return null; // or return a loading spinner
    }
    const language = selectedLanguage.value;

    return (
        <>
            {(language === "Chinese" || language === null) && <ChineseResponseGenerator />}
            {language === "Spanish" && <SpanishResponseGenerator />}
            {language === "Burmese" && <BurmeseResponseGenerator />}
            {language === "Japanese" && <JapaneseResponseGenerator />}
            {language === "Vietnamese" && <VietnameseResponseGenerator />}
        </>
    )
}
