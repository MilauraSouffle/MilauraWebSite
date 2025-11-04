import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const NewsletterPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Champ requis',
        description: 'Veuillez entrer votre adresse e-mail.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setStatus('error');
          toast({
            title: 'Déjà inscrit !',
            description: 'Cette adresse e-mail est déjà dans notre liste de diffusion.',
            variant: 'default',
          });
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setEmail('');
        toast({
          title: 'Inscription réussie !',
          description: 'Merci de vous être abonné(e) à notre newsletter.',
        });
      }
    } catch (error) {
      setStatus('error');
      toast({
        title: 'Une erreur est survenue',
        description: 'Impossible de vous inscrire pour le moment. Veuillez réessayer plus tard.',
        variant: 'destructive',
      });
      console.error('Error signing up for newsletter:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Newsletter | Rejoignez le Cercle Mil'Aura</title>
        <meta name="description" content="Inscrivez-vous à la newsletter Mil’Aura pour recevoir nos nouveautés, offres exclusives et conseils en lithothérapie en avant-première." />
        <meta name="keywords" content="newsletter, lithothérapie, bien-être, offres exclusives, nouveautés, Mil'Aura" />
        <meta property="og:title" content="Newsletter | Restez Connecté à l'Univers Mil’Aura" />
        <meta property="og:description" content="Recevez nos inspirations, nouveautés et offres exclusives directement dans votre boîte mail." />
        <meta property="og:url" content="https://milaura.fr/newsletter" />
        <meta property="og:type" content="website" />
      </Helmet>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-[60vh] flex items-center justify-center py-12 px-4"
      >
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative p-8 md:p-12 bg-white/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-amber-200/30 border border-amber-200/50"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-full shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-script font-bold text-gradient-gold-warm mt-8 mb-4">
              Rejoignez le cercle Mil'Aura
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Soyez le premier informé de nos nouveautés, de nos offres exclusives et recevez une dose d'inspiration directement dans votre boîte mail.
            </p>

            {status !== 'success' ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Votre adresse e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="h-14 text-lg rounded-full focus:ring-2 focus:ring-amber-400"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="h-14 rounded-full btn-golden-animated !px-8 !text-lg"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-green-50/50 rounded-2xl border-2 border-green-200"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800">Vous êtes inscrit !</h3>
                <p className="text-green-700 mt-2">Merci ! Surveillez votre boîte de réception pour nos prochaines nouvelles magiques.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default NewsletterPage;