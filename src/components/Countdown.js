import React, { useEffect } from "react";
import "../styles.css"

const Countdown = ({ seconds, setSeconds }) => {
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);

      // Cleanup function to clear the timer when the component unmounts or the seconds change.
      return () => clearTimeout(timer);
    }
    if (seconds === 0) {
      setSeconds(3  );
    }
  }, [seconds, setSeconds]); 

  return (
    <div className="countdown">
      <h1>{seconds}</h1>
    </div>
  );
};

export default Countdown;
