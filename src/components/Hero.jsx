import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="flex justify-center items-center overflow-hidden"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={`${letter}-${index}`}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};


const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonText = "Découvrir ma bougie";

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 px-4 relative overflow-hidden bg-[#FBF9F4]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90" style={{ backgroundImage: "url('https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/e472933ce7a3880aed19f334470b9214.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9F4] via-[#FBF9F4]/50 to-transparent"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-transparent via-purple-200/10 to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        />
        {/* Subtle glow animation on the flower */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25vw] h-[25vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(224, 192, 255, 0.3) 0%, rgba(224, 192, 255, 0) 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-[#BFA57C]/30 to-[#A48B65]/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: 1 }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut", delay: 0.3 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-script font-bold mb-6 text-gradient-gold-warm leading-tight">
            Chaque pierre raconte une histoire
          </h1>

          <p className="text-lg md:text-xl text-gray-700/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Découvrez votre bougie émotionnelle, faites notre quizz émotionnel et laissez-vous guider par la magie Mil'Aura.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "backOut" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Link to="/bougie-emotionnelle">
              <Button
                size="lg"
                className="btn-golden-animated !px-12 !py-8 !text-xl"
              >
                <AnimatePresence mode="wait">
                  {isHovered ? (
                    <AnimatedButtonText text={buttonText} />
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {buttonText}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;