import * as React from 'react';
import Slider from '@mui/material/Slider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "../styles.css"

const theme = createTheme({
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: 'black',
          width: '400px',
        },
        markLabel: {
          color: 'black',
          fontWeight: 'bold',
        },
        rail: {
          color: 'black',
        },
        track: {
          color: 'grey',
        },
        thumb: {
          color: 'black',
        },
      },
    },
  },
});

const marks = [
  {
    value: 0,
    label: 'x-slow',
  },
  {
    value: 1,
    label: 'slow',
  },
  {
    value: 2,
    label: 'medium',
  },
  {
    value: 3,
    label: 'fast',
  },
  {
    value: 4,
    label: 'x-fast',
  },
];

const valuetext = (value) => {
  return `${marks[value].label}`;
};

const SpeedSlider = ({ speed, setSpeed }) => {
  const handleChange = (event, newValue) => {
    setSpeed(newValue);
  };

  return (
    <div className="speed-slider">
      <ThemeProvider theme={theme}>
        <Slider
          defaultValue={2}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={0}
          max={4}
          value={speed}
          onChange={handleChange}
        />
      </ThemeProvider>
    </div>
  );
};

export default SpeedSlider;
