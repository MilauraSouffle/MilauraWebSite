import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, Star, Plus, Minus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// ✅ 1) Importe tes produits depuis une source unique (à créer si besoin)
// Option A : via contexte / hook
// import { useProducts } from '@/contexts/StoreContext';

// Option B : temporaire, un fichier data partagé (src/data/products.js)
import { products } from '@/data/products'; // crée ce fichier si tu ne l'as pas

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

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams();
  // ✅ 2) Si tu utilises un contexte :
  // const { products } = useProducts();

  // On autorise id sous forme "string" ou number
  const product = React.useMemo(
    () => products?.find((p) => String(p.id) === String(id)),
    [id]
  );

  const [quantity, setQuantity] = React.useState(1);

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-2">Produit introuvable</h1>
          <p className="text-gray-600 mb-6">
            Le produit que vous recherchez n’existe plus ou a changé d’URL.
          </p>
          <Link to="/boutique" className="text-gradient font-semibold">
            ← Revenir à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const mainImage =
    product.image ||
    product.images?.[0] ||
    'https://dummyimage.com/900x900/f3f3f3/cccccc.png&text=Mil%E2%80%99Aura';

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
    toast({
      title: `✨ ${quantity} × ${product.name} ajouté(s)`,
      description: 'Votre panier a été mis à jour.',
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="pt-32 pb-20 px-4"
    >
      <div className="container mx-auto">
        {/* Fil d’Ariane simple */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/boutique" className="hover:underline">Boutique</Link>
          {' / '}
          <Link
            to={`/boutique/${product.category?.slug || product.category}`}
            className="hover:underline"
          >
            {product.category?.name || product.category}
          </Link>
          {' / '}
          <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="golden-frame"
          >
            <div className="bg-[#FBF9F4] rounded-2xl aspect-square flex items-center justify-center p-8">
              {/* ✅ 3) On affiche la vraie image du produit */}
              <img
                alt={product.name}
                src={mainImage}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Lien “retour catégorie” */}
            <Link
              to={`/boutique/${product.category?.slug || product.category}`}
              className="text-sm text-gradient font-semibold mb-2 inline-block"
            >
              {product.story || 'Découvrir la catégorie'}
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-600">(12 avis)</span>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              {product.longDescription || product.description}
            </p>

            <p className="text-4xl font-bold text-gradient mb-8">
              {Number(product.price).toFixed(2)}€
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 border rounded-full p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-black text-white rounded-full py-6 text-lg"
              >
                <ShoppingBag className="w-6 h-6 mr-2" />
                Ajouter au panier
              </Button>

              <Button size="icon" variant="outline" className="rounded-full h-14 w-14 border-black/20">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            <div className="glass-effect p-4 rounded-2xl text-sm">
              <p>✓ Fabrication artisanale française</p>
              <p>✓ Pierres certifiées de qualité supérieure</p>
              <p>✓ Expédition sous 48h</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;