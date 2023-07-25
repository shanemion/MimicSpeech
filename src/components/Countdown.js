import React, { useEffect } from "react";

const Countdown = ({ seconds, setSeconds }) => {
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);

      // Cleanup function to clear the timer when the component unmounts or the seconds change.
      return () => clearTimeout(timer);
    }
  }, [seconds, setSeconds]); 

  return (
    <div>
      <h1>{seconds}</h1>
    </div>
  );
};

export default Countdown;
