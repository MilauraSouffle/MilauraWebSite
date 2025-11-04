import React from 'react';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';
import Seo from '@/components/Seo';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.6 } },
  out: { opacity: 0, transition: { duration: 0.4 } },
};

// ID de la collection "Calendrier de l'Avent"
const CALENDRIER_ID = 'pcol_01K88QSKEZQ9032VE7PBEWG0GH';

export default function AdventCategoryPage() {
  return (
    <>
      <Seo
        title="La Magie de l’Avent – Mil’aura"
        description="24 jours, 24 trésors minéraux. Un rituel quotidien de découvertes et de bien-être."
        canonical="https://milaura.fr/collections/calendrier-de-lavent"
      />
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="bg-[#FBF9F4]">
        {/* HERO sans neige (page liste) */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg,#cfe2f3 0%,#e7f0fb 35%,#fbf9f4 100%)' }}
            aria-hidden
          />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10 md:pb-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="font-script text-4xl md:text-5xl text-gradient-gold-warm drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
            >
              La Magie de l’Avent
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
              className="max-w-4xl mx-auto mt-3 text-[17px] md:text-lg text-black/70"
            >
              Chaque jour une nouvelle porte, chaque porte un nouveau trésor. Plongez dans un rituel de 24 jours de
              découvertes énergétiques et laissez la magie des pierres illuminer votre mois de décembre.
            </motion.p>
          </div>
        </section>

        {/* Liste des produits */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <ProductsList collectionId={CALENDRIER_ID} />
        </section>
      </motion.div>
    </>
  );
}