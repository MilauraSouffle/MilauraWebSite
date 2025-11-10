// src/App.jsx
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import AIAssistant from '@/components/AIAssistant';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useCart } from '@/hooks/useCart';
import ContactBubble from '@/components/ContactBubble';
import { useAuth } from '@/contexts/SupabaseAuthContext';

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
import AuthPage from '@/pages/AuthPage';

/* ------------------------------------------------------------------ */
/* Scroll manager robuste                                              */
/* ------------------------------------------------------------------ */
function scrollTopNow() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const firstRenderRef = useRef(true);

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      try { window.history.scrollRestoration = 'manual'; } catch (_) { }
    }
  }, []);

  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        requestAnimationFrame(scrollTopNow);
        setTimeout(scrollTopNow, 60);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  useEffect(() => {
    if (hash) return;

    scrollTopNow();
    requestAnimationFrame(scrollTopNow);
    const t = setTimeout(scrollTopNow, 80);

    if (pathname === '/') {
      const onLoad = () => scrollTopNow();
      window.addEventListener('load', onLoad, { once: true });
      const t2 = setTimeout(scrollTopNow, 160);
      const t3 = setTimeout(scrollTopNow, 320);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
        clearTimeout(t3);
        window.removeEventListener('load', onLoad);
      };
    }

    return () => clearTimeout(t);
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    const scrollToHash = () => {
      const el = document.querySelector(hash);
      if (!el) return;
      const header = document.getElementById('site-header');
      const offset = header ? header.getBoundingClientRect().height : 0;
      const top = window.scrollY + el.getBoundingClientRect().top - offset - 12;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'smooth' });
    };
    requestAnimationFrame(scrollToHash);
    const t = setTimeout(scrollToHash, 50);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  useLayoutEffect(() => {
    if (firstRenderRef.current && pathname === '/') {
      firstRenderRef.current = false;
      scrollTopNow();
    } else {
      firstRenderRef.current = false;
    }
  }, [pathname]);

  return null;
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { user, loading } = useAuth();

  const shouldShowHeaderFooter = location.pathname !== '/lien';
  const isHomePage = location.pathname === '/';

  return (
    <>
      <div className="min-h-screen bg-[#FBF9F4] overflow-x-hidden">
        <ScrollManager />

        {shouldShowHeaderFooter && (
          <div id="site-header" className="fixed top-0 left-0 w-full z-50 bg-transparent">
            <div className="hidden sm:block">
              <AnnouncementBar />
            </div>
            <Header
              onCartClick={() => setIsCartOpen(true)}
              cartItemCount={cartItems.length}
            />
          </div>
        )}

        {/* wrapper contenu : sur la home pas de padding-top (le Hero gère l’offset),
           sur les autres pages on garde l’offset réel + safe-area iOS */}
        <main
          id="app-content"
          className={`app-content ${isHomePage ? 'has-hero' : ''}`}
          style={{
            paddingTop: isHomePage
              ? '0px'
              : 'calc(var(--header-offset) + env(safe-area-inset-top, 0px))',
          }}
        >
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
              <Route
                path="/profil"
                element={!loading && user ? <EmotionalDashboardPage /> : <Navigate to="/connexion" replace />}
              />
              <Route
                path="/connexion"
                element={!loading && !user ? <AuthPage /> : <Navigate to="/profil" replace />}
              />
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
        </main>

        {shouldShowHeaderFooter && <AIAssistant />}
        {shouldShowHeaderFooter && <ContactBubble />}
        <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        {shouldShowHeaderFooter && <Footer />}
      </div>
    </>
  );
}

export default App;