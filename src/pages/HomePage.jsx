// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import AdventCalendar from '@/components/AdventCalendar';
import SocialWall from '@/components/SocialWall';
import ProductsList from '@/components/ProductsList';
import { Button } from '@/components/ui/button';
import Seo from '@/components/Seo';

/* -------------------- petit effet de texte sur les boutons -------------------- */
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

const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.8 };

/* ------------------------------ Section nouveautés ------------------------------ */
const NouveautesSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonText = 'Voir toutes les nouveautés';

  return (
    // marges normales pour bien s’enchaîner avec la section AdventCalendar
    <section className="pt-14 md:pt-16 pb-20 md:pb-24 bg-[#FBF9F4]">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-5xl font-script font-bold text-gradient-gold-warm mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Nos Nouveautés
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          Les dernières créations énergétiques, fraîchement imaginées pour vous.
        </motion.p>

        {/* on filtre par l’ID pour éviter les soucis de slug */}
        <ProductsList limit={3} collectionId="pcol_01K88QTNEX9KSGG3X576K0KPEJ" />

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link to="/nouveautes">
            <Button size="lg" className="btn-golden-animated !px-8 !py-6 !text-lg">
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
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------ Page ------------------------------------ */
const HomePage = () => {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mil’Aura',
    url: 'https://milaura.fr',
    logo: 'https://milaura.fr/assets/og-default.jpg',
    sameAs: [
      'https://www.instagram.com/milaura_souffle/',
      'https://www.facebook.com/milaura.creations',
    ],
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://milaura.fr',
    name: 'Mil’Aura',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://milaura.fr/recherche?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Seo
        title="Mil’aura – Bougies émotionnelles & lithothérapie"
        description="Créations artisanales pour le bien-être: bougies émotionnelles, bijoux et pierres naturelles."
        canonical="https://milaura.fr/"
        jsonLd={[org, website]}
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="bg-[#FBF9F4]"
      >
        <Hero />
        {/* section calendriers optimisée (fond parallax + pas de carré blanc) */}
        <AdventCalendar />
        {/* section nouveautés sans chevauchement */}
        <NouveautesSection />
        <SocialWall />
      </motion.div>
    </>
  );
};

export default HomePage;