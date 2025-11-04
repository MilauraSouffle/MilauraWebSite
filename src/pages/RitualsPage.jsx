import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { articles } from '@/data/articles';
import QuoteCarousel from '@/components/QuoteCarousel';

const AnimatedButtonText = ({ text }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.04 * i
      }
    })
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  return (
    <motion.div className="flex justify-center items-center overflow-hidden" variants={container} initial="hidden" animate="visible">
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const pageTransition = {
  duration: 0.8,
  ease: 'easeInOut'
};

const RitualsPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonText = "S'inscrire";

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Merci pour votre inscription !",
      description: "Vous recevrez bientôt nos nouveaux articles."
    });
    e.target.reset();
  };

  return (
    <>
      <Helmet>
        <title>Rituels & Astuces | Milaura</title>
        <meta name="description" content="Le blog de Milaura. Découvrez nos articles sur la lithothérapie, les rituels de bien-être et des astuces pour intégrer la magie des pierres dans votre vie." />
        <meta name="keywords" content="blog lithothérapie, rituels pierres, purifier pierres, recharger pierres, citrine, tourmaline noire, quartz rose, bien-être spirituel" />
      </Helmet>

      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <header className="text-center py-16 px-4 bg-white">
          <div className="container mx-auto">
            <motion.h1
              className="text-6xl font-script font-bold text-gradient-gold-warm mb-4 shine-effect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Rituels & Astuces
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Le journal de bord de votre voyage spirituel. Trouvez l'inspiration pour créer vos propres rituels et approfondir votre connexion avec les minéraux.
            </motion.p>
          </div>
        </header>

        <QuoteCarousel />

        <main className="py-20 px-4 bg-[#FBF9F4]">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {articles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <Link to={`/rituel/${article.slug}`} className="block group mb-4">
                    <div className="overflow-hidden rounded-2xl shadow-lg">
                      <img
                        alt={article.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        src={article.image || 'https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=1600&auto=format&fit=crop'}
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col flex-grow">
                    <span className="text-sm font-semibold text-gradient-gold-warm mb-2">
                      {article.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 flex-grow">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <Button asChild variant="link" className="p-0 h-auto text-black font-bold self-start">
                      <Link to={`/rituel/${article.slug}`}>Lire la suite →</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-gradient-gold-warm mb-4">Ne manquez aucune astuce</h2>
            <p className="text-lg text-gray-700 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos nouveaux articles et des offres exclusives directement dans votre boîte mail.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 max-w-lg mx-auto">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  required
                  className="w-full h-14 pl-12 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#BFA57C] focus:outline-none transition"
                />
              </div>
              <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <Button type="submit" className="btn-golden-animated !h-14 !text-base !px-6">
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
              </div>
            </form>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default RitualsPage;