import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Seo from "@/components/Seo";

const SuccessPage = () => {
  return (
    <>
      <Seo
        title="Merci pour votre commande"
        description="Confirmation de commande Mil’aura."
        canonical="https://milaura.fr/confirmation"
        noindex={true}
      />
      <main className="min-h-screen flex items-center justify-center bg-[#FBF9F4] px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500" />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Merci pour votre commande !</h1>
          <p className="text-lg text-gray-600 mb-8">
            Votre commande a été passée avec succès. Nous préparons votre colis avec soin et amour. Vous recevrez bientôt un email de confirmation avec les détails de suivi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/collections">
              <Button size="lg" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 rounded-full">
                Continuer mes achats
              </Button>
            </Link>
            <Link to="/profil">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-black text-black hover:bg-gray-100 rounded-full">
                <Gift className="mr-2 h-5 w-5" />
                Voir mon profil
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default SuccessPage;