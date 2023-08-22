// import React, { useState, useEffect } from "react";

// const PitchAccuracy = ({ synthesizedData, recordedData }) => {
//   const [accuracy, setAccuracy] = useState(0);
//     console.log("pasd")
//     console.log(synthesizedData)
//     console.log("pard")

//     console.log(recordedData)
//   useEffect(() => {
//     const calculateAccuracy = () => {
//         const filteredSynthesizedData = synthesizedData.filter(
//             (value) => typeof value === "number" && Math.abs(value) > 0.01
//           );
//           const filteredRecordedData = Array.isArray(recordedData[0])
//         ? recordedData.map((data) =>
//             data.filter(
//               (value) => typeof value === "number" && Math.abs(value) > 0.01
//             )
//           )
//         : [];
      
//           console.log(filteredSynthesizedData);
//           console.log(filteredRecordedData);
    
//         // Adjusting the lengths of the arrays
//         while (recordedData.length < synthesizedData.length) {
//             recordedData.push(0.01);
//         }
//         if (recordedData.length > synthesizedData.length) {
//             recordedData = recordedData.slice(0, synthesizedData.length);
//         }
    
//         let totalChangeSynthesized = 0;
//         let totalDifferenceInChange = 0;
    
//         for (let i = 1; i < synthesizedData.length; i++) {
//             const changeSynthesized = synthesizedData[i] - synthesizedData[i - 1];
//             const changeRecorded = recordedData[i] - recordedData[i - 1];
    
//             totalChangeSynthesized += Math.abs(changeSynthesized);
//             totalDifferenceInChange += Math.abs(changeSynthesized - changeRecorded);
//         }
//         console.log(totalChangeSynthesized)
//         console.log(totalDifferenceInChange)
//         // Calculate accuracy based on the difference in change
//         const accuracy = totalChangeSynthesized === 0 ? 0 : 1 - (totalDifferenceInChange / totalChangeSynthesized);
//         console.log(accuracy)
//         return Math.max(0, accuracy * 100); // Convert to percentage and ensure it's non-negative
//     };
    

//     setAccuracy(calculateAccuracy());
//   }, [synthesizedData, recordedData]);

//   return <>{accuracy.toFixed(2)}%</>;
// };

// export default PitchAccuracy;
