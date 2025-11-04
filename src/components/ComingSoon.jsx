import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoon = ({ pageTitle }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-[#FBF9F4] px-4">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Leaf className="w-16 h-16 text-amber-500 mx-auto mb-6" />
        </motion.div>
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-4"
          variants={itemVariants}
        >
          🌿 {pageTitle} en cours de création
        </motion.h1>
        <motion.p
          className="text-2xl font-script text-gradient-gold-warm mb-6"
          variants={itemVariants}
        >
          Nos créations Mil’Aura arrivent bientôt ✨
        </motion.p>
        <motion.p
          className="text-gray-600 mb-8"
          variants={itemVariants}
        >
          En attendant, suivez notre univers et nos actualités sur nos réseaux sociaux :
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          <a href="https://www.facebook.com/milaura.creations" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors">
            <Facebook className="w-5 h-5" />
            <span className="font-semibold">Facebook – milaura.creations</span>
          </a>
          <a href="https://www.instagram.com/milaura_souffle/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors">
            <Instagram className="w-5 h-5" />
            <span className="font-semibold">Instagram – milaura_souffle</span>
          </a>
        </motion.div>
        <motion.p
          className="text-gray-600 mt-8"
          variants={itemVariants}
        >
          Ou contactez-nous via notre page dédiée juste <Link to="/contact" className="font-bold text-amber-600 hover:underline">ici</Link> 💌
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ComingSoon;