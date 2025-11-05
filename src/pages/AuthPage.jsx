import React from 'react';
import { motion } from 'framer-motion';
import AuthForm from '@/components/AuthForm';
import Seo from '@/components/Seo';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6,
};

const AuthPage = () => {
  return (
    <>
      <Seo
        title="Accès Membre | Mil’aura"
        description="Connectez-vous ou créez votre compte pour accéder à votre espace personnel et suivre votre parcours émotionnel."
        canonical="https://milaura.fr/connexion"
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-[70vh] flex items-center justify-center bg-[#FBF9F4] py-12"
      >
        <div className="container mx-auto px-4 flex justify-center">
            <div className="w-full max-w-md">
                 <motion.div
                    className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <AuthForm />
                </motion.div>
            </div>
        </div>
      </motion.div>
    </>
  );
};

export default AuthPage;