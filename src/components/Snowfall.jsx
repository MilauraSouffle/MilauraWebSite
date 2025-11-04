import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Snowfall = ({ density = 140 }) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    // accessibilité : pas d’animation, mais un léger décor fixe optionnel
    return <div className="absolute inset-0 pointer-events-none" />;
  }

  const flakes = Array.from({ length: density });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {flakes.map((_, i) => {
        const xStart = Math.random() * 100;
        const xEnd = xStart + (Math.random() * 20 - 10);
        const yDuration = 10 + Math.random() * 10; // 10–20s
        const delay = Math.random() * 12;
        const size = 2 + Math.random() * 3; // 2–5px

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/90 shadow-sm"
            style={{
              left: `${xStart}%`,
              top: "-8px",
              width: `${size}px`,
              height: `${size}px`,
              filter: "blur(0.5px)",
              opacity: 0.6 + Math.random() * 0.4, // 0.6–1
            }}
            animate={{
              y: "100vh",
              x: [`${xStart}vw`, `${xEnd}vw`],
            }}
            transition={{
              duration: yDuration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay,
            }}
          />
        );
      })}
    </div>
  );
};

export default Snowfall;