import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.6 14.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6s0-.3.1-.4c.1-.1.2-.2.4-.4.1-.1.2-.2.2-.4.1-.1.1-.3 0-.4-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.1 1.5 2.3 3.7 3.2.5.2.9.4 1.2.5.5.2 1 .1 1.3-.1.4-.2.6-.9.8-1.1.2-.2.2-.4.1-.5l-.5-.2zM12 2a10 10 0 100 20 10 10 0 000-20zm0 18.4c-4.6 0-8.4-3.8-8.4-8.4s3.8-8.4 8.4-8.4 8.4 3.8 8.4 8.4-3.8 8.4-8.4 8.4z" />
  </svg>
);

const ContactBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
        >
          <Button
            onClick={toggleOpen}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-2xl shadow-amber-500/30 hover:scale-110 transition-transform duration-300"
            aria-label="Ouvrir le menu de contact"
          >
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <X className="h-8 w-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <MessageSquare className="h-8 w-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4"
            onClick={toggleOpen}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0">
                <img
                  className="w-full h-full object-cover"
                  alt="Geode d'améthyste en fond"
                 src="https://images.unsplash.com/photo-1555158130-cd7ca837fe78" />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              <div className="relative p-8 text-center text-white">
                <h2 className="text-3xl font-bold mb-2">Une question ?</h2>
                <p className="text-amber-100/80 mb-8">Contactez l'équipe Mil'Aura</p>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/33682514694"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      className="w-full h-14 rounded-full bg-[#25D366] text-white text-lg font-bold hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3"
                    >
                      <WhatsAppIcon className="h-7 w-7" />
                      <span>WhatsApp</span>
                    </Button>
                  </a>
                  <a href="mailto:contact@milaura.fr" className="w-full">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full h-14 rounded-full bg-white/10 border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                    >
                      <Mail className="h-6 w-6" />
                      <span>Email</span>
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactBubble;