import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, Menu, LogOut, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Logo avec taille ajustée
const Logo = () => (
  <Link to="/" className="flex items-center space-x-2 group" aria-label="Retour à l'accueil">
    <img 
      src="https://ik.imagekit.io/bupjuxqi6/logo%20MiL'Aura%20De%CC%81toure%CC%81%202.png?updatedAt=1762338419186" 
      alt="Logo Mil’Aura" 
      className="h-20 w-auto transition-transform duration-500 ease-in-out group-hover:rotate-[360deg]" 
    />
  </Link>
);

// Liens de navigation dans le bon ordre
const navLinks = [
  { href: '/nos-collections', label: 'Nos collections' },
  { href: '/bougie-emotionnelle', label: 'Découvrir ma bougie' },
  { href: "/collections/calendrier-de-lavent", label: "Calendrier de l'avent" },
  { href: '/nouveautes', label: 'Nos nouveautés' },
];

const NavItem = ({ href, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === href || (href === '/nos-collections' && location.pathname.startsWith('/collections'));
  
  return (
    <li className="relative">
      <NavLink
        to={href}
        onClick={onClick}
        className="text-base font-medium text-gray-700 hover:text-black transition-colors duration-300 py-2 block"
      >
        {label}
      </NavLink>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 rounded-full"
          layoutId="underline"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}
    </li>
  );
};

const MobileNavItem = ({ href, label, onClick }) => (
    <li>
        <NavLink
            to={href}
            onClick={onClick}
            className="text-2xl font-medium text-gray-800 hover:text-black transition-colors duration-300 py-3 block"
        >
            {label}
        </NavLink>
    </li>
);


// Icônes d'action
const ActionIcons = ({ onCartClick, cartItemCount }) => {
  const { user, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>;

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <button onClick={onCartClick} className="relative group p-2 rounded-full hover:bg-black/5 transition-colors" aria-label={`Voir le panier, ${cartItemCount} articles`}>
        <ShoppingBag className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors" />
        <AnimatePresence>
          {cartItemCount > 0 && (
            <motion.span
              key={cartItemCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gradient-to-br from-amber-500 to-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow"
            >
              {cartItemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="relative">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="group p-2 rounded-full hover:bg-black/5 transition-colors" aria-label="Menu utilisateur">
          <User className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors" />
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-56 bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl ring-1 ring-black/5 origin-top-right z-20"
            >
              <div className="py-2">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200/80">
                      <p className="text-sm text-gray-500">Connecté(e)</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                    </div>
                    <Link to="/profil" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-200/50 transition-colors w-full">
                      <Heart className="h-4 w-4 text-amber-600"/>
                      <span>Mon Profil Émotionnel</span>
                    </Link>
                    <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors w-full">
                      <LogOut className="h-4 w-4"/>
                      <span>Déconnexion</span>
                    </button>
                  </>
                ) : (
                   <div className="p-2">
                     <Link to="/connexion" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-3 text-sm text-white bg-black hover:bg-gray-800 rounded-lg transition-colors">
                        Connexion / Inscription
                    </Link>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


// Header principal
const Header = ({ onCartClick, cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <header className="py-3">
      <div className="container mx-auto px-4">
        <div className={`header-capsule ${isScrolled ? 'scrolled' : ''}`}>
            <div className="snake-border-animation">
              <div className="header-content-wrapper flex justify-between items-center h-24 px-6">
                <div className="flex-shrink-0">
                  <Logo />
                </div>
                
                <nav className="hidden lg:block">
                  <ul className="flex items-center space-x-8">
                    {navLinks.map((link) => <NavItem key={link.href} {...link} />)}
                  </ul>
                </nav>

                <div className="hidden lg:flex items-center gap-2">
                  <ActionIcons onCartClick={onCartClick} cartItemCount={cartItemCount} />
                </div>

                <div className="lg:hidden flex items-center gap-2">
                  <ActionIcons onCartClick={onCartClick} cartItemCount={cartItemCount} />
                  <button 
                    onClick={() => setIsMenuOpen(true)} 
                    aria-label="Ouvrir le menu"
                    className="btn-golden-animated h-12 w-12 flex items-center justify-center !rounded-2xl"
                  >
                    <Menu className="h-6 w-6 text-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 right-0 bg-[#FBF9F4] shadow-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <Logo />
                  <button onClick={() => setIsMenuOpen(false)} className="p-2">
                    <X className="h-7 w-7 text-gray-700" />
                  </button>
                </div>
                <nav>
                  <ul className="flex flex-col items-center space-y-4">
                    {navLinks.map((link) => <MobileNavItem key={link.href} {...link} onClick={() => setIsMenuOpen(false)} />)}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;