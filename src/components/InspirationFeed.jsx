import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { articles } from '@/data/articles';

// Sous-composant pour l'animation du texte
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
        <motion.span variants={child} key={index}>{letter === ' ' ? '\u00A0' : letter}</motion.span>
      ))}
    </motion.div>
  );
};


const InspirationFeed = () => {
  const featuredArticles = articles.slice(0, 3);
  const [isHovered, setIsHovered] = useState(false);
  const buttonText = "Voir tous nos rituels";

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-script font-bold text-gradient-gold-warm mb-4 shine-effect">
            Inspirations & Rituels
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Plongez dans notre univers et découvrez comment intégrer la magie des pierres dans votre quotidien.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {featuredArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link to={`/rituel/${article.slug}`} className="block group">
                <div className="overflow-hidden rounded-2xl shadow-lg golden-frame mb-6">
                  <div className="aspect-[4/3] bg-[#FBF9F4]">
                    <img 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={article.image || 'https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=1600&auto=format&fit=crop'} 
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gradient-gold-warm mb-2 block">{article.category}</span>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-gradient-gold-warm transition-colors">{article.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{article.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
          {/*
            CORRECTION : Le lien pointe maintenant directement vers la page des rituels.
            Le composant ScrollToTop s'occupera de remonter en haut de page.
            L'ancre '#articles' a été supprimée pour éviter le saut indésirable.
          */}
          <Link to="/rituels-astuces">
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

export default InspirationFeed;