// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Image de fond (ImageKit)
const HERO_IMG_SRC =
  'https://ik.imagekit.io/bupjuxqi6/photo%20slide%20principal%20Milaura%20.png?updatedAt=1762444544560';

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      // plein écran moins la hauteur du header
      style={{ minHeight: 'calc(100vh - var(--header-offset))' }}
      aria-label="Présentation Mil’Aura"
    >
      {/* IMAGE DE FOND + traitements */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMG_SRC}
          alt="Univers Mil’Aura"
          className={`
            h-full w-full object-cover opacity-60
            /* recadrage : décale légèrement à gauche pour centrer la fleur */
            object-[31%_41%] md:object-[30%_41%]
          `}
          loading="eager"
          fetchpriority="high"
        />

        {/* assombrissement progressif en bas pour la lisibilité */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[48vh] bg-gradient-to-t from-black/40 via-black/18 to-transparent"
        />
        {/* fondu doux vers la couleur de la section suivante */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] bg-gradient-to-b from-transparent to-[#FBF9F4]"
        />
      </div>

      {/* CONTENU fixé en bas */}
      <div
        className="
          absolute inset-x-0 bottom-0 z-10
          container mx-auto px-4
          pb-8 md:pb-12 lg:pb-14
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Titre bas, noir + liseré doré (tient sur l’assombrissement) */}
          <h1
            className="font-script text-[clamp(2.6rem,7.5vw,4.8rem)] leading-tight mb-3 md:mb-4"
            style={{
              color: '#111111',
              WebkitTextStroke: '1px #C3A46D',
              textShadow:
                '0 2px 10px rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.25)',
            }}
          >
            Chaque pierre raconte une histoire
          </h1>

          {/* Sous-titre juste au-dessus du CTA */}
          <p
            className="mx-auto max-w-3xl text-[clamp(1.05rem,2.1vw,1.2rem)] leading-relaxed mb-6 md:mb-8"
            style={{
              color: '#0f172a',
              textShadow: '0 2px 8px rgba(255,255,255,0.25)',
            }}
          >
            Découvrez votre bougie émotionnelle, faites notre quizz émotionnel
            et laissez-vous guider par la magie Mil’Aura.
          </p>

          {/* CTA collé visuellement au bas */}
          <Link to="/bougie-emotionnelle" aria-label="Découvrir ma pierre">
            <Button
              size="lg"
              className="
                btn-golden-animated
                px-8 py-6 md:px-10
                text-[clamp(1rem,1.6vw,1.1rem)]
                font-semibold
                rounded-[20px]
                shadow-[0_10px_25px_rgba(0,0,0,0.35)]
              "
            >
              Découvrir ma pierre
            </Button>
          </Link>

          {/* Petite ligne info sous le CTA */}
          <div className="mt-4 md:mt-5 flex items-center justify-center gap-2 text-sm md:text-base text-white/90">
            <span aria-hidden>🇫🇷</span>
            <span className="backdrop-blur-[1px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
              Pierres certifiées • Préparé avec soin en France
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}