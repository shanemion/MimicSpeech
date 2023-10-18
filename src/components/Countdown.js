// import React, { useEffect } from "react";
// import "../styles.css"

// const Countdown = ({ seconds, setSeconds }) => {
//   useEffect(() => {
//     if (seconds > 0) {
//       const timer = setTimeout(() => setSeconds(seconds - 1), 1000);

//       // Cleanup function to clear the timer when the component unmounts or the seconds change.
//       return () => clearTimeout(timer);
//     }
//     if (seconds === 0) {
//       setSeconds(3);
//     }
//   }, [seconds, setSeconds]); 

//   return (
//     <div className="countdown">
//       <h1>{seconds}</h1>
//     </div>
//   );
// };

// export default Countdown;
import React, { useState, useEffect } from "react";
import "../styles.css";

const Countdown = ({ duration }) => {
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    const endTime = Date.now() + secondsLeft * 1000;

    const tick = () => {
      const timeLeft = Math.round((endTime - Date.now()) / 1000);

      if (timeLeft > 0) {
        setSecondsLeft(timeLeft);
      } else {
        setSecondsLeft(0);
        // Clear the interval when the countdown finishes
        clearInterval(interval);
      }
    };

    // Call tick immediately to prevent a 1-second delay before the first update
    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [duration]); 

  return (
    <div className="countdown">
      <h1>{secondsLeft}</h1>
    </div>
  );
};

export default React.memo(Countdown);
