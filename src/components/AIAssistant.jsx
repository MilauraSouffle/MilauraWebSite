import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Gift, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast({
        title: "🚧 Assistant IA en cours de développement",
        description: "Cette fonctionnalité arrive bientôt pour vous guider !",
      });
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={handleToggle}
            className="rounded-full w-16 h-16 bg-gradient-to-br from-[#C3A46D] to-[#B18E48] text-black shadow-lg"
          >
            {isOpen ? <X size={28} /> : <Gift size={28} />}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-30 w-80 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-[#C3A46D] to-[#B18E48] rounded-full">
                  <Bot className="text-black" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Votre Assistant Cadeau</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Bientôt, je vous aiderai à trouver le cadeau énergétique parfait. Pour l'instant, explorez nos collections !
              </p>
              <Button className="w-full bg-black text-white rounded-full" onClick={() => setIsOpen(false)}>
                Explorer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;