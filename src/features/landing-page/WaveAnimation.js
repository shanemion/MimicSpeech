// import React, { useEffect, useRef } from "react";
// import p5 from "p5";

// const Wave = ({ heroRef }) => {
//   const myRef = useRef();

//   useEffect(() => {
//     let myP5 = new p5(sketch, myRef.current);
//   }, []);

//   const sketch = (p) => {
//     let wave1, wave2;
//     let time = 0; // Time variable for smooth fluctuation

//     p.setup = () => {
//       const heroSection = heroRef.current;
//       if (heroSection) {
//         // Check if heroSection is not null
//         const canvas = p.createCanvas(
//           heroSection.offsetWidth,
//           heroSection.offsetHeight
//         );
//         canvas.position(0, 0); // Position it at the top-left corner
//         // canvas.style("z-index", "-1"); // Place it behind the content

//         wave1 = new Wave(0.02, p.height / 1.5, p.color(0, 191, 179));
//         wave2 = new Wave(0.03, p.height / 1.5, p.color(58, 80, 107));
//       }
//     };

//     p.draw = () => {
//     //   drawGradient();
//     p.clear();  // Make background transparent

//       wave1.update(p.mouseY); // Pass mouseY as an argument
//       wave1.display();
//       wave2.update(p.mouseY); // Pass mouseY as an argument
//       wave2.display();
//       time += 0.01; // Increment time for smooth fluctuation
//     };

//     p.windowResized = () => {
//       const heroSection = heroRef.current;
//       if (heroSection) {
//         // Check if heroSection is not null
//         p.resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
//       }
//     };

//     class Wave {
//       constructor(frequency, offset, col) {
//         this.angle = 0;
//         this.amplitude = 100;
//         this.frequency = frequency;
//         this.offset = offset;
//         this.col = col;
//       }

//       update(mouseY) {
//         this.angle += this.frequency;
//         const centerY = this.offset; // The vertical center of the wave is now updated
//         const distanceFromCenter = Math.abs(mouseY - centerY); // Absolute distance from center

//         // Smooth fluctuation using a phase-shifted and scaled sine function
//         const minAmplitude = 40;
//         const maxAmplitude = 100;
//         const amplitudeRange = maxAmplitude - minAmplitude;

//         // Use a sine function that has been phase-shifted and scaled to make the transition smoother
//         const smoothFluctuation =
//           minAmplitude +
//           (amplitudeRange / 2) * (Math.sin(time - Math.PI / 2) + 1);

//         // Check if the mouse is too far from the center
//         if (distanceFromCenter > 400) {
//           this.amplitude = smoothFluctuation; // Ignore the mouse's position
//         } else {
//           const mouseEffect = 1 + (1 - distanceFromCenter / 400); // Scaling factor based on distance from center
//           this.amplitude = smoothFluctuation * mouseEffect; // Combine both effects
//         }

//         // Remove the constraint to allow the amplitude to go beyond the natural fluctuation
//         this.amplitude = Math.max(this.amplitude, minAmplitude);
//       }

//       display() {
//         p.stroke(this.col);
//         p.strokeWeight(4.5); // Increase the thickness
//         p.noFill();
//         p.beginShape();
//         for (let x = 0; x <= p.width; x += 5) {
//           let y =
//             p.sin(x * this.frequency + this.angle) * this.amplitude +
//             this.offset;
//           p.vertex(x, y);
//         }
//         p.endShape();
//       }
//     }
//   };
//   return <div ref={myRef} className="background-animation"></div>;
// };

// export default Wave;
import React, { useEffect, useRef } from "react";
import p5 from "p5";

const Wave = ({ heroRef }) => {
  const myRef = useRef();

  useEffect(() => {
    let myP5 = new p5(sketch, myRef.current);
  }, []);

  const sketch = (p) => {
    let wave1, wave2;
    let time = 0; // Time variable for smooth fluctuation

    p.setup = () => {
      const heroSection = heroRef.current;
      if (heroSection) {
        const canvas = p.createCanvas(
          heroSection.offsetWidth,
          heroSection.offsetHeight
        );
        canvas.position(0, 0);
        wave1 = new Wave(0.02, p.height / 1.5, p.color(0, 191, 179));
        wave2 = new Wave(0.03, p.height / 1.5, p.color(58, 80, 107));
      }
    };

    p.draw = () => {
      p.clear();
      wave1.update();
      wave1.display();
      wave2.update();
      wave2.display();
      time += 0.01;
    };

    p.windowResized = () => {
      const heroSection = heroRef.current;
      if (heroSection) {
        p.resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
      }
    };

    class Wave {
      constructor(frequency, offset, col) {
        this.angle = 0;
        this.amplitude = 100;
        this.frequency = frequency;
        this.offset = offset;
        this.col = col;
      }

      update() {
        this.angle += this.frequency;

        // Smooth fluctuation using a phase-shifted and scaled sine function
        const minAmplitude = 40;
        const maxAmplitude = 100;
        const amplitudeRange = maxAmplitude - minAmplitude;

        this.amplitude = 
          minAmplitude +
          (amplitudeRange / 2) * (Math.sin(time - Math.PI / 2) + 1);
      }

      display() {
        p.stroke(this.col);
        p.strokeWeight(4.5);
        p.noFill();
        p.beginShape();
        for (let x = 0; x <= p.width; x += 5) {
          let y =
            p.sin(x * this.frequency + this.angle) * this.amplitude +
            this.offset;
          p.vertex(x, y);
        }
        p.endShape();
      }
    }
  };

  return <div ref={myRef} className="background-animation"></div>;
};

export default Wave;
