import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { articles } from '@/data/articles';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Seo from "@/components/Seo";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.8,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const BlogPage = () => {
  return (
    <>
      <Seo
        title="Blog – Conseils & Énergie"
        description="Guides clairs sur pierres, rituels et bougies émotionnelles."
        canonical="https://milaura.fr/conseils-energie"
        ogImage="https://milaura.fr/assets/og-default.jpg"
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-script font-bold text-gradient-gold-warm mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Conseils & Énergie ✨
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Découvrez comment les pierres, les rituels et les bougies émotionnelles peuvent transformer votre quotidien. Chaque article vous aide à mieux comprendre votre énergie et à choisir les pierres qui vous accompagnent.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.slug}
              className="bg-white/50 rounded-2xl shadow-lg overflow-hidden group flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -5, shadow: 'xl' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="overflow-hidden">
                <img
                  class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={`Image pour l'article ${article.title}`}
                 src="https://images.unsplash.com/photo-1685737575066-4cd573d2e346" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm font-semibold text-amber-600 mb-2">{article.category}</span>
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex-grow">{article.title}</h2>
                <p className="text-gray-600 mb-6 text-sm">{article.excerpt}</p>
                <div className="mt-auto">
                  <Button asChild variant="link" className="p-0 text-amber-700 font-bold hover:text-amber-800">
                    <Link to={`/conseils-energie/${article.slug}`}>
                      Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default BlogPage;