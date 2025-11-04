import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SmartPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkSubscription = async () => {
      const subscribed = localStorage.getItem('milaura_subscribed');
      if (subscribed) {
        setIsSubscribed(true);
        return;
      }

      const hasVisited = localStorage.getItem('milaura_popup_shown');
      if (!hasVisited) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem('milaura_popup_shown', 'true');
        }, 8000);
        return () => clearTimeout(timer);
      }
    };

    checkSubscription();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Déjà inscrit !",
          description: "Cette adresse e-mail fait déjà partie de notre cercle.",
        });
        localStorage.setItem('milaura_subscribed', 'true');
        setIsSubscribed(true);
        setIsOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Oh non !",
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      }
    } else {
      localStorage.setItem('milaura_subscribed', 'true');
      setIsSubscribed(true);
      setIsOpen(false);
      toast({
        title: "✨ Bienvenue dans le cercle !",
        description: "Votre code de -10% vous attend dans votre boîte mail. Merci de nous rejoindre !",
        duration: 5000,
      });
    }
  };

  if (isSubscribed || user) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative w-full max-w-4xl bg-gradient-to-br from-[#FBF9F4] to-[#e9e5dd] rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-500 hover:bg-black/10 rounded-full z-10"
              onClick={handleClose}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="grid md:grid-cols-2">
              <div className="p-10 flex flex-col justify-center text-center md:text-left">
                <Gift className="w-12 h-12 text-gradient-gold-warm mx-auto md:mx-0 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Rejoignez notre cercle privé.</h2>
                <p className="text-gray-600 mb-6">
                  Recevez <span className="font-bold text-gradient-gold-warm">-10% sur votre première commande</span>, et accédez en avant-première à nos rituels, astuces et collections limitées.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Votre adresse email"
                      required
                      className="w-full h-14 pl-12 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#BFA57C] focus:outline-none transition bg-white/50"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 rounded-full bg-black text-white text-base font-semibold hover:bg-gray-800 transition-all">
                    Recevoir mon cadeau
                  </Button>
                </form>
                <p className="text-xs text-gray-400 mt-4">En vous inscrivant, vous acceptez de recevoir nos inspirations. Vous pouvez vous désinscrire à tout moment.</p>
              </div>
              <div className="hidden md:block relative">
                <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent"></div>
                <img class="h-full w-full object-cover" alt="Ambiance sereine avec des cristaux et des bougies" src="https://images.unsplash.com/photo-1537876706859-d04c765fe68c" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartPopup;