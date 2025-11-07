// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const HERO_IMG_SRC =
  "https://ik.imagekit.io/bupjuxqi6/photo%20slide%20principal%20Milaura%20.png?updatedAt=1762444544560";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden flex items-stretch"
      style={{ minHeight: 'calc(100vh - var(--header-offset))' }}
      aria-label="Présentation Mil’Aura"
    >
      {/* Fond */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMG_SRC}
          alt="Univers Mil’Aura"
          className="h-full w-full object-cover"
          loading="eager"
          fetchpriority="high"
          style={{ objectPosition: 'center' }}
        />
        {/* Assombrissement léger */}
        <div className="absolute inset-0 bg-black/25" />
        {/* Fondu vers la page */}
        <div className="absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-[#FBF9F4]" />
      </div>

      {/* Contenu global */}
      <div className="relative container mx-auto px-4 flex flex-col justify-between py-8 md:py-10 w-full">
        {/* Espace supérieur dynamique pour descendre le panneau sur desktop */}
        <div className="h-3 md:h-[12vh] lg:h-[14vh]" />

        {/* Panneau “or liquide” + shimmer */}
        <motion.div
          initial={{ opacity: -4, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="w-full"
        >
          <div
            className="
              relative mx-auto
              w-[92%] sm:w-[86%] md:w-[78%] lg:w-[68%]
              rounded-[26px] md:rounded-[30px]
              px-5 sm:px-7 md:px-9 py-5 sm:py-6 md:py-7
              ring-1 ring-black/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]
              backdrop-blur-[6px]
            "
          >
            {/* Fond or – 50% mobile / 78% desktop */}
            <div
              className="absolute inset-0 rounded-[inherit] md:hidden"
              style={{
                background:
                  'linear-gradient(135deg, rgba(233,204,138,0.50) 0%, rgba(195,164,109,0.50) 100%)',
              }}
            />
            <div
              className="absolute inset-0 rounded-[inherit] hidden md:block"
              style={{
                background:
                  'linear-gradient(135deg, rgba(233,204,138,0.78) 0%, rgba(195,164,109,0.78) 100%)',
              }}
            />

            {/* Shimmer argenté */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <span className="mil-shimmer absolute inset-y-0 -left-1/3 w-1/3" />
            </span>

            {/* Contenu */}
            <div className="relative z-[1]">
              <h1
                className="
                  font-script
                  text-[clamp(2.2rem,6.2vw,4.2rem)]
                  leading-tight mb-3 md:mb-4
                "
                style={{
                  color: '#0f0f0f',
                  WebkitTextStroke: '0.5px rgba(255,255,255,0.25)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.15)',
                }}
              >
                Chaque pierre raconte une histoire
              </h1>

              <p
                className="
                  text-[clamp(1rem,2.2vw,1.2rem)]
                  leading-relaxed
                  text-[#222]/90
                "
              >
                Découvrez votre bougie émotionnelle, faites notre quizz émotionnel et
                laissez-vous guider par la magie Mil’Aura.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA tout en bas du hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-6 md:mb-8 flex flex-col items-center gap-3"
        >
          <Link to="/bougie-emotionnelle" aria-label="Découvrir ma pierre">
            <Button
              size="lg"
              className="
                btn-golden-animated
                px-8 py-6 md:px-10
                text-[clamp(1rem,1.8vw,1.1rem)]
                font-semibold
                rounded-[20px]
                shadow-[0_10px_25px_rgba(0,0,0,0.35)]
              "
            >
              Découvrir ma pierre
            </Button>
          </Link>

          {/* Ruban garanties */}
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-700/90 bg-white/60 md:bg-white/50 backdrop-blur-sm rounded-full px-3 py-1.5 ring-1 ring-black/5">
            <span role="img" aria-label="France">🇫🇷</span>
            <span>Pierres certifiées • Préparé avec soin en France</span>
          </div>
        </motion.div>
      </div>

      {/* Styles locaux */}
      <style>{`
        @keyframes milaura-shimmer {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
        .mil-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.65) 50%,
            rgba(255,255,255,0) 100%
          );
          filter: blur(8px);
          animation: milaura-shimmer 3.6s linear infinite;
          mix-blend-mode: screen;
        }
        @media (max-width: 768px) {
          .mil-shimmer { filter: blur(6px); }
        }
      `}</style>
    </section>
  );
}