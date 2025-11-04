// src/pages/NouveautesPage.jsx
import React from "react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import ProductsList from "@/components/ProductsList";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1, ease: "easeOut", duration: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

export default function NouveautesPage() {
  const title = "Nos Nouveautés";
  const description =
    "Plongez dans nos dernières inspirations. Chaque pièce est une invitation à un nouveau voyage sensoriel et énergétique.";

  // ID confirmé de la collection “Nouveautés”
  const NOUVEAUTES_COLLECTION_ID = "pcol_01K88QTNEX9KSGG3X576K0KPEJ";

  return (
    <>
      <Seo title={`${title} – Mil’aura`} description={description} />

      <motion.div
        className="bg-[#FBF9F4] min-h-screen"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-16 pb-8">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-script text-gradient-gold-warm text-center mb-5"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-3xl mx-auto text-center text-gray-600 mb-10 md:mb-12"
          >
            {description}
          </motion.p>

          <motion.div variants={itemVariants} className="pb-12">
            {/* On s’aligne sur la page Collections : même grille, même cartes */}
            <ProductsList collectionId={NOUVEAUTES_COLLECTION_ID} />
          </motion.div>
        </section>
      </motion.div>
    </>
  );
}