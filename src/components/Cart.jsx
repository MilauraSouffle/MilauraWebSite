import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, CreditCard, Smartphone, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Cart = ({ items, isOpen, onClose, onRemoveItem, onUpdateQuantity }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (method) => {
    toast({
      title: "🚧 Paiement",
      description: `Le paiement ${method} n'est pas encore implémenté—mais vous pouvez le demander dans votre prochain prompt ! 🚀`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FBF9F4] z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gradient">Votre Panier</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <p className="text-xl text-gray-500 mb-4">Votre panier est vide</p>
                <p className="text-gray-400">Découvrez nos créations magiques ✨</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="glass-effect p-4 rounded-2xl flex items-center gap-4"
                    >
                      <div className="w-20 h-20 bg-[#F5F1E9]/50 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                        <img src="https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/4c8236f98c735500e5c2e4ece4a2172c.png" alt="Milaura Logo" className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 text-black">{item.name}</h3>
                        <p className="text-gradient font-bold">{item.price.toFixed(2)}€</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button size="icon" variant="outline" className="h-6 w-6 rounded-full" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3"/></Button>
                          <span>{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-6 w-6 rounded-full" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3"/></Button>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 border-t border-black/10 flex-shrink-0">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-3xl font-bold text-gradient">{total.toFixed(2)}€</span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => handleCheckout('Carte Bancaire')}
                      className="w-full bg-black text-white py-6 text-lg rounded-full"
                    >
                      <CreditCard className="w-6 h-6 mr-2" />
                      Procéder au paiement
                    </Button>
                  </div>
                  <div className="glass-effect p-4 rounded-2xl text-center mt-4">
                    <p className="text-sm text-gray-700">
                      💝 <strong>Garantie Émotionnelle</strong><br />
                      Si la pierre ne résonne pas avec vous, échange gratuit
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;