import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import {
  ShoppingCart,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Minus,
  Plus,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Seo from "@/components/Seo";

const placeholderImage = "https://horizons-cdn.hostinger.com/5ed1deb4-535d-4bff-8341-dc46a5456047/b0d0f13150ef2b7e83c531ca77552e79.png";

/* ---------- Helpers affichage infos sup ---------- */
const stripInline = (html = "") =>
  html
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "");

const normalizeHtml = (html = "") =>
  stripInline(html)
    .replace(/<p>\s*/gi, "")
    .replace(/\s*<\/p>/gi, "");

/* On couvre un max de structures possibles renvoyées par l’intégration */
const extractSupplementalSections = (product) => {
  const sections = [];

  // 1) Tableau standard
  const arr =
    product?.additional_sections ||
    product?.additional_info ||
    product?.extra_sections ||
    product?.supplemental_sections;

  if (Array.isArray(arr)) {
    arr.forEach((s, i) => {
      const title = s?.title || s?.heading || `Informations ${i + 1}`;
      const raw =
        s?.content || s?.html || s?.body || s?.text || s?.description || "";
      const html = normalizeHtml(raw);
      if (html.trim()) sections.push({ title, html });
    });
  }

  // 2) Objet unique
  const obj =
    product?.additional_info_object ||
    product?.supplemental_info ||
    product?.extra_info;

  if (obj && (obj.title || obj.content || obj.html || obj.body || obj.text || obj.description)) {
    const title = obj.title || "Informations complémentaires";
    const raw = obj.content || obj.html || obj.body || obj.text || obj.description || "";
    const html = normalizeHtml(raw);
    if (html.trim()) sections.push({ title, html });
  }

  // 3) String brut
  if (typeof product?.additional_info === "string" && product.additional_info.trim()) {
    sections.push({
      title: "Informations complémentaires",
      html: normalizeHtml(product.additional_info)
    });
  }

  // 4) Métadonnées éventuelles
  const metaHtml =
    product?.metadata?.additional_info ||
    product?.metadata?.extra_info ||
    "";
  if (typeof metaHtml === "string" && metaHtml.trim()) {
    sections.push({
      title: "Informations",
      html: normalizeHtml(metaHtml)
    });
  }

  return sections;
};

const AnimatedButtonText = ({ text }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.04 * i } }),
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 10, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };
  return (
    <motion.div className="flex justify-center items-center overflow-hidden" variants={container} initial="hidden" animate="visible">
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>{letter === " " ? "\u00A0" : letter}</motion.span>
      ))}
    </motion.div>
  );
};

function ChevronDownIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};

  // Contexte retour (provenance)
  const backTo   = navState.backTo   || "/nos-collections";
  const backLabel= navState.backLabel|| "Retour aux collections";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const buttonText = "Ajouter au panier";

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        toast({
          title: "✨ Ajouté au panier !",
          description: `${quantity} x ${product.title} (${selectedVariant.title}) ajouté.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Oh non ! Quelque chose s'est mal passé.",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + amount;
      if (newQuantity < 1) return 1;
      const availableStock = selectedVariant ? selectedVariant.inventory_quantity : Infinity;
      const stockManaged = selectedVariant ? selectedVariant.manage_inventory : false;
      if (stockManaged && newQuantity > availableStock) return availableStock;
      return newQuantity;
    });
  }, [selectedVariant]);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    if (variant.image_url && product?.images?.length > 0) {
      const imageIndex = product.images.findIndex(image => image.url === variant.image_url);
      if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
    }
  }, [product?.images]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await getProduct(id);

        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity,manage_inventory',
          product_ids: [fetchedProduct.id]
        });

        const variantDataMap = new Map();
        quantitiesResponse.variants.forEach(variant => {
          variantDataMap.set(variant.id, {
            inventory_quantity: variant.inventory_quantity,
            manage_inventory: variant.manage_inventory
          });
        });

        const productWithData = {
          ...fetchedProduct,
          variants: fetchedProduct.variants.map(variant => {
            const data = variantDataMap.get(variant.id);
            return {
              ...variant,
              inventory_quantity: data ? data.inventory_quantity : variant.inventory_quantity,
              manage_inventory: data ? data.manage_inventory : variant.manage_inventory
            }
          })
        };

        setProduct(productWithData);
        if (productWithData.variants && productWithData.variants.length > 0) {
          setSelectedVariant(productWithData.variants[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  const price = useMemo(() => selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted, [selectedVariant]);
  const originalPrice = useMemo(() => selectedVariant?.price_price_formatted, [selectedVariant]);
  const availableStock = useMemo(() => selectedVariant ? selectedVariant.inventory_quantity : 0, [selectedVariant]);
  const isStockManaged = useMemo(() => selectedVariant?.manage_inventory ?? false, [selectedVariant]);
  const canAddToCart = useMemo(() => !isStockManaged || quantity <= availableStock, [isStockManaged, quantity, availableStock]);

  const currentImage = useMemo(() => product?.images?.[currentImageIndex], [product, currentImageIndex]);
  const hasMultipleImages = useMemo(() => product?.images?.length > 1, [product]);

  const metaDescription = product?.description ? product.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Découvrez ${product?.title}, une création unique Mil'Aura pour le bien-être et l'harmonie.`;
  const metaImage = currentImage?.url || product?.images?.[0]?.url || placeholderImage;

  const supplementalSections = useMemo(() => extractSupplementalSections(product), [product]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 pt-28">
        <Seo title="Produit Introuvable" noindex={true} />
        <Link to={backTo} className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6">
          <ArrowLeft size={16} />
          {backLabel}
        </Link>
        <div className="text-center text-red-500 p-8 bg-red-50/50 rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Produit introuvable</h2>
          <p className="mb-6">{error || "Nous n'avons pas pu charger ce produit. Il est possible qu'il n'existe plus."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${product?.title || "Produit"} – Création lithothérapie`}
        description={metaDescription}
        canonical={`https://milaura.fr/product/${id}`}
        ogType="product"
        ogImage={metaImage}
      />
      <div className="container mx-auto px-4 py-12 pt-28">
        <Link to={backTo} className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6">
          <ArrowLeft size={16} />
          {backLabel}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Colonne GAUCHE : galerie */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-lg h-96 md:h-[500px]">
              <img
                src={metaImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-black p-2 rounded-full transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-black p-2 rounded-full transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#BFA57C] to-[#A48B65] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10">
                  {product.ribbon_text}
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="hidden md:flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-[#BFA57C]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={!image.url ? placeholderImage : image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Infos supplémentaires */}
            {extractSupplementalSections(product).length > 0 && (
              <div className="mt-6 space-y-3">
                {extractSupplementalSections(product).map((sec, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-gray-200 bg-white/70 p-4 open:shadow-sm"
                    {...(i === 0 ? { open: true } : {})}
                  >
                    <summary className="cursor-pointer list-none font-semibold text-black flex items-center justify-between">
                      <span>{sec.title}</span>
                      <span className="transition-transform group-open:rotate-180">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </summary>
                    <div
                      className="prose prose-lg max-w-none text-gray-700 mt-3"
                      dangerouslySetInnerHTML={{ __html: sec.html }}
                    />
                  </details>
                ))}
              </div>
            )}
          </motion.div>

          {/* Colonne DROITE : titre, prix, options, CTA */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
            <h1 className="text-4xl font-bold text-black mb-2">{product.title}</h1>
            <p className="text-lg text-gray-500 mb-4">{product.subtitle}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gradient-gold-warm">{price}</span>
              {selectedVariant?.sale_price_in_cents && (
                <span className="text-2xl text-gray-400 line-through">{originalPrice}</span>
              )}
            </div>

            <div className="prose prose-lg text-gray-700 mb-6 max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />

            {product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-black mb-2">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                      onClick={() => setSelectedVariant(variant)}
                      className={`transition-all !rounded-full ${selectedVariant?.id === variant.id ? 'bg-black text-white border-black' : 'border-gray-300 text-black hover:bg-gray-100'}`}
                    >
                      {variant.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-full p-1">
                <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-black hover:bg-gray-100"><Minus size={16} /></Button>
                <span className="w-10 text-center text-black font-bold">{quantity}</span>
                <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-black hover:bg-gray-100"><Plus size={16} /></Button>
              </div>
            </div>

            <div
              className="mt-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full btn-golden-animated !py-7 !text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:!shadow-none disabled:bg-gray-300"
                disabled={!canAddToCart || !product.purchasable}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                <AnimatePresence mode="wait">
                  {isHovered && product.purchasable && canAddToCart ? (
                    <AnimatedButtonText text={"Ajouter au panier"} />
                  ) : (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Ajouter au panier
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              {isStockManaged && canAddToCart && product.purchasable && (
                <p className="text-sm text-green-600 mt-3 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> {availableStock} en stock !
                </p>
              )}

              {isStockManaged && !canAddToCart && product.purchasable && (
                <p className="text-sm text-yellow-600 mt-3 flex items-center justify-center gap-2">
                  <XCircle size={16} /> Stock insuffisant. {availableStock > 0 ? `Seulement ${availableStock} restant(s).` : "Rupture de stock."}
                </p>
              )}

              {!product.purchasable && (
                <p className="text-sm text-red-600 mt-3 flex items-center justify-center gap-2">
                  <XCircle size={16} /> Actuellement indisponible
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;