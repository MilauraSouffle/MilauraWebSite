import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "La plus grande découverte que vous puissiez faire est votre propre potentiel.",
  "Chaque pierre est un univers, chaque cristal une étoile.",
  "L'énergie que vous dégagez est l'énergie que vous attirez.",
  "Faites confiance au timing de votre vie.",
  "Le bien-être commence par un moment pour soi."
];

const QuoteCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-20 flex items-center justify-center overflow-hidden my-8">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="text-center text-xl italic text-gray-600 font-serif"
        >
          "{quotes[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default QuoteCarousel;