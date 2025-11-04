import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Snowfall from '@/components/Snowfall';

const AnimatedButtonText = ({ text }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 10, transition: { type: 'spring', damping: 12, stiffness: 100 } },
  };
  return (
    <motion.div className="flex justify-center items-center overflow-hidden" variants={container} initial="hidden" animate="visible">
      {letters.map((letter, index) => (
        <motion.span variants={child} key={`${letter}-${index}`}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const AdventCalendar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonText = 'Découvrir nos calendriers ✨';
  const targetRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Parallax doux sur le fond
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const safeBgY = prefersReducedMotion ? 0 : bgY;

  // Dégradé bleu > crème, sans image “carré blanc”
  const gradient = 'linear-gradient(180deg,#cfe2f3 0%,#e7f0fb 35%,#fbf9f4 100%)';

  return (
    <section ref={targetRef} id="advent-calendar" className="relative flex items-center justify-center min-h-[82vh] md:min-h-[88vh] py-14 md:py-20 overflow-hidden">
      {/* Fond + parallax */}
      <motion.div
        aria-hidden
        className="absolute inset-0 will-change-transform"
        style={{ background: gradient, y: safeBgY }}
      />
      {/* Neige uniquement sur la home */}
      <div className="absolute inset-0">
        <Snowfall />
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Texte */}
          <div className="max-w-xl">
            <p className="text-base md:text-lg text-amber-700/80 mb-2">✨ L’avent devient un rituel</p>
            <h2 className="text-4xl md:text-5xl font-script text-gradient-gold-warm drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
              La Magie de l’Avent, Révélée
            </h2>
            <p className="text-base md:text-lg text-black/70 mt-4 mb-8">
              L'attente de Noël n'a jamais été aussi précieuse. Derrière chaque porte se cache un trésor de la Terre, une invitation à 24 jours de découvertes magiques.
            </p>

            <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <Link to="/collections/calendrier-de-lavent" aria-label="Découvrir nos calendriers de l'Avent" data-analytics="cta_click_advent_home">
                <Button size="lg" className="btn-golden-animated">
                  <AnimatePresence mode="wait">
                    {isHovered ? (
                      <AnimatedButtonText text={buttonText} />
                    ) : (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {buttonText}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>
            </div>
          </div>

          {/* Visuel, sans “carré blanc” */}
          <div className="hidden md:block">
            <img
              src="https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/dcaf1866d5d96b64407e02f0360ea810.png"
              alt="Calendrier de l'Avent minéral"
              className="w-full h-auto object-contain rounded-3xl shadow-2xl ring-1 ring-black/5"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdventCalendar;