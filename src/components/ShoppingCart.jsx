// src/components/ShoppingCart.jsx
import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/components/ui/use-toast';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Votre panier est vide',
        description: 'Ajoutez des produits avant de commander.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const items = cartItems.map((item) => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;

      const { url } = await initializeCheckout({
        items,
        successUrl,
        cancelUrl,
        locale: 'fr',
      });

      clearCart();
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Erreur de paiement',
        description: 'Un problème est survenu. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  }, [cartItems, clearCart, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="
              absolute right-0 top-0 h-full w-full max-w-md
              panel-gold panel-shimmer ring-1 ring-black/10
              shadow-2xl flex flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <h2 className="text-2xl font-bold text-black">Votre Panier</h2>
              <Button
                onClick={() => setIsCartOpen(false)}
                variant="ghost"
                size="icon"
                className="text-black hover:bg-white/30"
              >
                <X />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-black/60 h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={48} className="mb-4" />
                  <p>Votre panier est vide.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.variant.id}
                    className="
                      flex items-start gap-4
                      bg-white/70 backdrop-blur-sm
                      p-3 rounded-lg shadow-sm ring-1 ring-black/5
                    "
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-black">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-black/60">
                        {item.variant.title}
                      </p>
                      <p className="text-sm font-bold mt-1 text-black">
                        {item.variant.sale_price_formatted ||
                          item.variant.price_formatted}
                      </p>

                      <div className="flex items-center border border-black/10 rounded-md mt-2 w-fit bg-white/60">
                        <Button
                          onClick={() =>
                            updateQuantity(
                              item.variant.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          size="sm"
                          variant="ghost"
                          className="px-2 text-black hover:bg-black/5"
                        >
                          -
                        </Button>
                        <span className="px-2 text-black text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() =>
                            updateQuantity(item.variant.id, item.quantity + 1)
                          }
                          size="sm"
                          variant="ghost"
                          className="px-2 text-black hover:bg-black/5"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => removeFromCart(item.variant.id)}
                      size="sm"
                      variant="ghost"
                      className="text-black/50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-black/10">
                <div className="flex justify-between items-center mb-4 text-black">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">
                    {getCartTotal()}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="
                    w-full btn-golden-animated font-semibold py-3 text-base
                    rounded-full
                  "
                >
                  Procéder au paiement
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;