import React, { useState } from 'react';
import analyzeAudio from '../utils/AnalyzeAudio';
import PitchChart from './PitchChart';

const AnalyzeButton = () => {
    const [synthesizedPitchData, setSynthesizedPitchData] = useState([]);
    const [recordedPitchData, setRecordedPitchData] = useState([]);

    const handleAnalyzeAudio = async () => {
        const data = await analyzeAudio();
        if (data) {

            
            setSynthesizedPitchData(data.synthesized_pitch_data);
            setRecordedPitchData(prevData => [...prevData, data.recorded_pitch_data]);

            console.log("Synthesized Pitch z:", data.synthesized_pitch_data);
            console.log("Recorded Pitch z:", data.recorded_pitch_data);
        }

    };

    return (
        
        <div>
            <button onClick={handleAnalyzeAudio}>Analyze Audio</button>
            <PitchChart synthesizedData={synthesizedPitchData} recordedData={recordedPitchData} />
        </div>
    );
};

export default AnalyzeButton;
