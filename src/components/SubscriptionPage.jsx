import React from 'react';
import { motion } from 'framer-motion';
import { X, Gift, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SubscriptionPage = ({ onClose }) => {
  const handleSubscribe = () => {
    toast({
      title: "🎁 Abonnement Rituel Émotionnel",
      description: "Félicitations ! Votre voyage commence le mois prochain.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-28 pb-12 px-4 bg-[#FBF9F4]"
    >
      <div className="container mx-auto max-w-5xl relative">
        <div className="absolute top-0 right-0">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient mb-4 shine-effect">L'Abonnement Émotionnel</h1>
          <p className="text-xl text-gray-700">Votre rituel mensuel de bien-être, livré chez vous.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img alt="Boîte d'abonnement Milaura avec bougie et pierre" className="rounded-2xl shadow-xl w-full" src="https://images.unsplash.com/photo-1693517254723-f36fdd9265bd" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">Le concept</h2>
            <p className="text-lg text-gray-700 mb-6">
              Recevez chaque mois une box contenant un rituel personnalisé pour vous connecter à vos émotions. Chaque box est une surprise conçue autour d'une intention et d'une pierre.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><Gift className="w-6 h-6 text-gradient flex-shrink-0 mt-1" /><span>Une bougie artisanale unique</span></li>
              <li className="flex items-start gap-3"><Heart className="w-6 h-6 text-gradient flex-shrink-0 mt-1" /><span>Une pierre naturelle sélectionnée pour son énergie</span></li>
              <li className="flex items-start gap-3"><Star className="w-6 h-6 text-gradient flex-shrink-0 mt-1" /><span>Une carte rituel et des surprises exclusives</span></li>
            </ul>
          </motion.div>
        </div>

        <div className="glass-effect p-8 rounded-3xl text-center mb-16 golden-frame">
          <div className="bg-[#FBF9F4] rounded-2xl p-4">
            <h2 className="text-3xl font-bold mb-4">Ce qu'elles en disent</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="italic">"Un vrai moment pour moi, j'attends ma box avec impatience chaque mois !"</p>
                <p className="font-bold mt-2">- Claire D.</p>
              </div>
              <div className="text-center">
                <p className="italic">"Les pierres sont magnifiques et les rituels très inspirants. Je recommande !"</p>
                <p className="font-bold mt-2">- Sophie L.</p>
              </div>
              <div className="text-center">
                <p className="italic">"La meilleure idée cadeau que j'ai eue. Mon amie est ravie."</p>
                <p className="font-bold mt-2">- Marc A.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Prête à commencer votre voyage ?</h2>
          <p className="text-lg text-gray-700 mb-8">Sans engagement. Annulez à tout moment.</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleSubscribe}
              size="lg"
              className="bg-black text-white px-12 py-8 text-xl rounded-full hover:bg-gray-800 transition-all mystical-glow"
            >
              Je m'abonne pour 29,90€/mois
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionPage;