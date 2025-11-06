import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { getProducts } from '@/api/EcommerceApi';

const placeholderImage =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTFkZWRjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgc3R5bGU9ImRvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiIGZpbGw9IiNhYWFhYWEiPk5vIGltYWdlPC90ZXh0Pjwvc3ZnPg==";

// utils
const deaccent = (s = '') =>
  s.toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const collectCategoryTokens = (product) => {
  const tokens = new Set();

  toArray(product?.collections).forEach((c) => {
    if (!c) return;
    if (c.name) tokens.add(deaccent(c.name));
    if (c.slug) tokens.add(deaccent(c.slug));
    if (c.handle) tokens.add(deaccent(c.handle));
    if (c.id) tokens.add(String(c.id));
    if (c.collection_id) tokens.add(String(c.collection_id));
    if (c.category_id) tokens.add(String(c.category_id));
  });
  toArray(product?.categories).forEach((c) => {
    if (!c) return;
    if (c.name) tokens.add(deaccent(c.name));
    if (c.slug) tokens.add(deaccent(c.slug));
    if (c.id) tokens.add(String(c.id));
    if (c.category_id) tokens.add(String(c.category_id));
  });

  ['category', 'category_name', 'category_slug', 'collection', 'collection_name'].forEach((k) => {
    const val = product?.[k];
    if (val) tokens.add(deaccent(val));
  });

  const rawTags = product?.tags;
  if (typeof rawTags === 'string') {
    rawTags.split(',').forEach((t) => tokens.add(deaccent(t)));
  } else if (Array.isArray(rawTags)) {
    rawTags.forEach((t) => tokens.add(deaccent(t)));
  }

  return tokens;
};

// stricter calendrier matcher
const isCalendrierMatch = (product) => {
  const tokens = collectCategoryTokens(product);

  // prioriser vrai rattachement ID
  const ids = new Set();
  toArray(product?.collections).forEach((c) => {
    const cid = c?.id ?? c?.collection_id ?? c?.category_id;
    if (cid != null) ids.add(String(cid));
  });
  toArray(product?.categories).forEach((c) => {
    const cid = c?.id ?? c?.category_id;
    if (cid != null) ids.add(String(cid));
  });
  // si le produit est explicitement rangé dans la collection calendrier côté back, ce sera traité dans matchesWanted via ID, mais on laisse ici le fuzzy de secours.

  // tokens “calendrier”
  const hitCalendrier =
    Array.from(tokens).some((t) =>
      t.includes('calendrier') ||
      t.includes('avent') ||
      t.includes('advent') ||
      t.includes('calendrier de l avent') ||
      t.includes('calendrier-de-l-avent') ||
      t.includes('calendrier de lavent')
    );

  // exclusion explicite de produits bougie quand ça “fuit”
  const isClearlyBougie =
    Array.from(tokens).some((t) =>
      t.includes('bougie') || t.includes('candle')
    );

  return hitCalendrier && !isClearlyBougie;
};

// UI helpers
const AnimatedButtonText = ({ text }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 10, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };
  return (
    <motion.div className="flex justify-center items-center overflow-hidden" variants={container} initial="hidden" animate="visible">
      {letters.map((letter, index) => (
        <motion.span variants={child} key={`${letter}-${index}`}>{letter === " " ? "\u00A0" : letter}</motion.span>
      ))}
    </motion.div>
  );
};

// Carte Produit
const ProductCard = ({ product, index, backContext }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const buttonText = "Ajouter";

  const displayVariant = useMemo(() => product.variants?.[0], [product]);
  const hasSale = useMemo(
    () => displayVariant && displayVariant.sale_price_in_cents !== null && displayVariant.sale_price_in_cents !== undefined,
    [displayVariant]
  );
  const displayPrice = useMemo(
    () => (hasSale ? displayVariant?.sale_price_formatted : displayVariant?.price_formatted) || '',
    [displayVariant, hasSale]
  );

  const imageSrc =
    product.image ||
    product.images?.[0]?.src ||
    product.images?.[0]?.url ||
    placeholderImage;

  const openProduct = useCallback(() => {
    navigate(`/product/${product.id}`, { state: backContext });
  }, [navigate, product.id, backContext]);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if ((product.variants?.length || 0) > 1) {
      openProduct();
      return;
    }

    const defaultVariant = product.variants?.[0];

    try {
      await addToCart(product, defaultVariant, 1, defaultVariant?.inventory_quantity);
      toast({
        title: "✨ Ajouté au panier !",
        description: `${product.title} a été ajouté à votre panier.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [product, addToCart, toast, openProduct]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="golden-frame group"
    >
      <div className="bg-[#FBF9F4] rounded-[1.3rem] overflow-hidden h-full flex flex-col">
        <Link to={`/product/${product.id}`} state={backContext} className="block">
          <div className="aspect-square bg-[#FBF9F4]/50 flex items-center justify-center relative overflow-hidden p-8">
            <img
              src={imageSrc}
              alt={product.title || product.name}
              className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // ici, simple toast; la vraie persistance favoris est côté dashboard connecté
                // (déjà implémentée ailleurs)
              }}
            >
              <Heart className="w-5 h-5 text-[#C3A46D]" />
            </motion.button>
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-grow">
          <span className="text-sm text-gradient-gold-warm font-semibold mb-2">{product.subtitle || 'Création unique'}</span>
          <h3 className="text-2xl font-bold mb-2 text-black">
            <Link to={`/product/${product.id}`} state={backContext}>{product.title || product.name}</Link>
          </h3>

          <div className="flex items-center justify-between mt-auto pt-4">
            <span className="text-3xl font-bold text-gradient-gold-warm">{displayPrice}</span>
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Button onClick={handleAddToCart} className="!text-sm !font-bold btn-golden-animated !py-5 !px-6">
                <ShoppingCart className="w-5 h-5 mr-2" />
                <AnimatePresence mode="wait">
                  {isHovered ? (
                    <AnimatedButtonText text={buttonText} />
                  ) : (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {buttonText}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// LISTE PRODUITS + filtrage robuste
const ProductsList = ({ limit, collectionId, collectionSlug, collectionName, products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);
  const location = useLocation();

  // contexte retour
  const path = location.pathname ? deaccent(location.pathname) : '';
  const urlParams = new URLSearchParams(location.search);

  const backContext = useMemo(() => {
    let ctx = { backTo: '/nos-collections', backLabel: 'Retour aux collections' };

    const m = location.pathname.match(/^\/collections\/([^/?#]+)/);
    if (m) {
      const slug = m[1];
      ctx.backTo = `/collections/${slug}${location.search}`;
      ctx.backLabel = 'Retour à la catégorie';
      return ctx;
    }

    if (path.includes('nouveaute')) {
      return { backTo: '/nouveautes', backLabel: 'Retour aux nouveautés' };
    }
    if (path.includes('calendriers-de-l-avent')) {
      return { backTo: '/calendriers-de-l-avent', backLabel: "Retour aux calendriers de l’Avent" };
    }
    if (path.includes('bougie-emotionnelle')) {
      return { backTo: '/bougie-emotionnelle', backLabel: 'Retour à Bougie émotionnelle' };
    }
    return ctx;
  }, [location.pathname, location.search, path]);

  const wanted = {
    id: collectionId || urlParams.get('categoryId') || null,
    slug:
      collectionSlug ||
      urlParams.get('category') ||
      (path.includes('calendrier-de-lavent') || path.includes('calendriers-de-l-avent') ? 'calendrier-de-lavent' : null),
    name: collectionName || null,
  };

  // helpers ID strict
  const productHasCollectionId = (product, idStr) => {
    const idWanted = String(idStr);
    const inCollections = toArray(product?.collections).some((c) => {
      const cid = c?.id ?? c?.collection_id ?? c?.category_id;
      return cid != null && String(cid) === idWanted;
    });
    const inCategories = toArray(product?.categories).some((c) => {
      const cid = c?.id ?? c?.category_id;
      return cid != null && String(cid) === idWanted;
    });
    return inCollections || inCategories;
  };

  const matchesWanted = (product) => {
    const tokens = collectCategoryTokens(product);
    const hasWanted = wanted.id || wanted.slug || wanted.name;

    // 1) Si on a un ID explicite -> filtre STRICT par ID, sans fallback
    if (wanted.id) {
      return productHasCollectionId(product, wanted.id);
    }

    // 2) Cas spécifique calendrier (slug)
    if (wanted.slug === 'calendrier-de-lavent') {
      // si le produit est réellement dans la coll/ctg calendrier côté back, on prend
      const inCalendarByTokens =
        Array.from(tokens).some((t) =>
          t === 'calendrier-de-lavent' ||
          t.includes('calendrier-de-l-avent') ||
          t.includes('calendrier de l avent') ||
          t.includes('calendrier') ||
          t.includes('avent') ||
          t.includes('advent')
        );

      const clearlyBougie =
        Array.from(tokens).some((t) =>
          t.includes('bougie') || t.includes('candle')
        );

      // Autoriser si (rattachement ID détectable) OU (tokens “calendrier”) ET PAS (bougie)
      const byId =
        toArray(product?.collections).some((c) => deaccent(c?.slug || '') === 'calendrier-de-lavent') ||
        toArray(product?.categories).some((c) => deaccent(c?.slug || '') === 'calendrier-de-lavent');

      return (byId || inCalendarByTokens) && !clearlyBougie;
    }

    // 3) Autres cas: slug/name “normaux” → fuzzy mais raisonnable
    if (!hasWanted) return true;

    const wSlug = wanted.slug ? deaccent(wanted.slug) : null;
    const wName = wanted.name ? deaccent(wanted.name) : null;

    if (wSlug && Array.from(tokens).some((t) => t === wSlug || t.includes(wSlug) || wSlug.includes(t))) return true;
    if (wName && Array.from(tokens).some((t) => t === wName || t.includes(wName) || wName.includes(t))) return true;

    return false;
  };

  useEffect(() => {
    const hasInitialProducts = Array.isArray(initialProducts) && initialProducts.length > 0;

    if (hasInitialProducts) {
      setProducts(initialProducts.filter(matchesWanted));
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getProducts({ limit: 250 });
        const all = res?.products || res?.items || [];

        const filtered = all.filter(matchesWanted);
        setProducts(limit ? filtered.slice(0, limit) : filtered);
      } catch (err) {
        console.error('❌ Error loading products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, collectionId, collectionSlug, collectionName, initialProducts, location.pathname, location.search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 bg-red-50/50 rounded-lg">
        <p>Erreur lors du chargement des produits: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p className="font-bold text-lg">Aucun produit trouvé.</p>
        <p className="mt-2">Il semble qu'il n'y ait pas encore de trésors dans cette collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} backContext={backContext} />
      ))}
    </div>
  );
};

export default ProductsList;