import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import AIAssistant from '@/components/AIAssistant';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useCart } from '@/hooks/useCart';
import ContactBubble from '@/components/ContactBubble';

// Pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import EmotionalDashboardPage from '@/pages/EmotionalDashboardPage';
import AdventPage from '@/pages/AdventPage';
import LinkInBioPage from '@/pages/LinkInBioPage';
import CollectionsPage from '@/pages/CollectionsPage';
import SuccessPage from '@/pages/SuccessPage';
import BougieEmotionnellePage from '@/pages/BougieEmotionnellePage';
import NouveautesPage from '@/pages/NouveautesPage';
import ContactPage from '@/pages/ContactPage';
import BlogPage from '@/pages/BlogPage';
import ArticlePage from '@/pages/ArticlePage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import AdventCategoryPage from '@/pages/AdventCategoryPage';

/* ------------------------------------------------------------------ */
/* Gestionnaire de scroll global                                      */
/* - Force le retour en haut à chaque changement de route             */
/* - Gère les ancres (#id) avec un offset du header                   */
/* - Désactive la “restauration historique” du navigateur             */
/* ------------------------------------------------------------------ */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  // 1) empêcher le navigateur de restaurer une position aléatoire
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch (_) {}
    }
  }, []);

  // 2) à chaque changement de page, remonter en haut
  useEffect(() => {
    // on “reset” d’abord, puis on traite une éventuelle ancre juste après
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  // 3) si une ancre est présente, on scrolle en douceur avec offset du header
  useEffect(() => {
    if (!hash) return;

    const scrollToHash = () => {
      const el = document.querySelector(hash);
      if (!el) return;

      const header = document.getElementById('site-header');
      const offset = header ? header.getBoundingClientRect().height : 0;
      const top =
        window.scrollY + el.getBoundingClientRect().top - offset - 12; // petit margin

      window.scrollTo({
        top: Math.max(0, top),
        left: 0,
        behavior: 'smooth',
      });
    };

    // attendre un raf pour être sûr que le DOM est peint
    requestAnimationFrame(scrollToHash);
  }, [pathname, hash]);

  return null;
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();

  const shouldShowHeaderFooter = location.pathname !== '/lien';

  return (
    <>
      <div className="min-h-screen bg-[#FBF9F4] overflow-x-hidden">
        {/* Gestion globale du scroll (retour haut + ancres) */}
        <ScrollManager />

        {shouldShowHeaderFooter && (
          <div id="site-header" className="fixed top-0 left-0 w-full z-50">
            <AnnouncementBar />
            <div className="p-2 sm:p-3">
              <Header
                onCartClick={() => setIsCartOpen(true)}
                cartItemCount={cartItems.length}
              />
            </div>
          </div>
        )}

        <div className={`${shouldShowHeaderFooter ? 'pt-28 md:pt-32' : ''}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/bougie-emotionnelle" element={<BougieEmotionnellePage />} />
              <Route path="/calendriers-de-l-avent" element={<AdventPage />} />
              <Route path="/collections/calendrier-de-lavent" element={<AdventCategoryPage />} />
              <Route path="/nouveautes" element={<NouveautesPage />} />
              <Route path="/nos-collections" element={<CollectionsPage />} />
              <Route path="/collections/:categorySlug" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/boutique" element={<Navigate to="/nos-collections" replace />} />
              <Route path="/profil" element={<EmotionalDashboardPage />} />
              <Route path="/lien" element={<LinkInBioPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/newsletter" element={<Navigate to="/conseils-energie" replace />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/conseils-energie" element={<BlogPage />} />
              <Route path="/conseils-energie/:slug" element={<ArticlePage />} />
              <Route path="/collections" element={<Navigate to="/nos-collections" replace />} />
              <Route path="/collections/nouveautes" element={<Navigate to="/nouveautes" replace />} />
              <Route path="/collections/tous-les-produits" element={<Navigate to="/boutique" replace />} />
              <Route path="/abonnement" element={<SubscriptionPage />} />
            </Routes>
          </AnimatePresence>
        </div>

        {shouldShowHeaderFooter && <AIAssistant />}
        {shouldShowHeaderFooter && <ContactBubble />}
        <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        {shouldShowHeaderFooter && <Footer />}
      </div>
    </>
  );
}

export default App;