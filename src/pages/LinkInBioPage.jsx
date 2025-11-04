import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Mail } from 'lucide-react';
import Seo from "@/components/Seo";

const LinkInBioPage = () => {
  const handleWhatsAppClick = () => {
    toast({
      title: "Bientôt disponible !",
      description: "Le lien WhatsApp sera ajouté prochainement.",
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Merci pour votre inscription !",
      description: "Vous recevrez bientôt de nos nouvelles.",
    });
    e.target.reset();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Seo
        title="Liens & communauté"
        description="Tous les liens importants de Mil’aura."
        canonical="https://milaura.fr/liens"
        noindex={true}
      />
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center p-4 font-sans">
        <motion.div
          className="w-full max-w-md mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <img
              src="https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/4c8236f98c735500e5c2e4ece4a2172c.png"
              alt="Logo Mil'Aura"
              className="w-24 h-24 mx-auto rounded-full mb-4 shadow-lg"
            />
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-800 mb-2"
            variants={itemVariants}
          >
            @MilAura
          </motion.h1>
          <motion.p
            className="text-gray-600 mb-8"
            variants={itemVariants}
          >
            Chaque pierre raconte une histoire.
          </motion.p>

          <motion.div className="space-y-4" variants={itemVariants}>
            <Link to="/bougie-emotionnelle" className="block">
              <Button className="w-full h-14 text-md bg-gradient-to-r from-[#BFA57C] to-[#A48B65] text-white mystical-glow">
                💌 Découvre Ta Pierre (Quiz Émotionnel)
              </Button>
            </Link>

            <Link to="/boutique" className="block">
              <Button variant="outline" className="w-full h-14 text-md border-gray-300 hover:bg-gray-100">
                ✨ Voir nos Collections
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full h-14 text-md border-gray-300 hover:bg-gray-100"
              onClick={handleWhatsAppClick}
            >
              💬 Poser une question (WhatsApp)
            </Button>
          </motion.div>

          <motion.div className="mt-10" variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Rejoignez notre cercle</h2>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  required
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#BFA57C] focus:outline-none transition"
                />
              </div>
              <Button type="submit" className="h-12 rounded-full bg-black text-white">
                S'inscrire
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LinkInBioPage;