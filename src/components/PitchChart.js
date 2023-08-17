import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const PitchChart = ({ synthesizedData, recordedData }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        // Filter out non-numeric values
        const filteredSynthesizedData = synthesizedData.filter(value => typeof value === 'number');
        const filteredRecordedData = recordedData.map(data => data.filter(value => typeof value === 'number'));

        console.log(filteredSynthesizedData);
        console.log(filteredRecordedData);

        const datasets = [
            {
                label: 'Synthesized Pitch',
                data: filteredSynthesizedData,
                borderColor: 'black',
                borderWidth: 1,
                fill: false
            },
            ...filteredRecordedData.map((data, index) => ({
                label: `Recorded Pitch ${index + 1}`,
                data: data,
                borderColor: 'red',
                borderWidth: 1,
                fill: false
            }))
        ];

        // Calculate the maximum value from both synthesized and recorded data
        const maxSynthesizedValue = Math.max(...filteredSynthesizedData);
        const maxRecordedValue = Math.max(...filteredRecordedData.flat());
        const maxYValue = Math.max(maxSynthesizedValue, maxRecordedValue);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filteredSynthesizedData.map((_, index) => index),
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: maxYValue
                    }
                }
            }
        });
        return () => chart.destroy();
    }, [synthesizedData, recordedData]);

    return <canvas ref={canvasRef} width="400" height="200"></canvas>;
};

export default PitchChart;
