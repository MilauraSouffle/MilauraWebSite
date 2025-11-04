import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigationLinks = [
  { name: 'Nos Collections', href: '/nos-collections' },
  { name: 'Calendriers de l\'Avent', href: '/calendriers-de-l-avent' },
  { name: 'Bougie Émotionnelle', href: '/bougie-emotionnelle' },
  { name: 'Nouveautés', href: '/nouveautes' },
];

const Header = ({ onCartClick, cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeLinkStyle = {
    color: '#BFA57C',
    fontWeight: 'bold',
  };

  return (
    <header className="relative z-40 snake-border-animation shadow-lg">
      <div className="header-content-wrapper">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <motion.div
                  className="relative w-14 h-14"
                  animate={{ rotate: 360 }}
                  transition={{
                    loop: Infinity,
                    ease: "linear",
                    duration: 10
                  }}
                >
                  <img src="https://i.imgur.com/Y6OG1mr.png" alt="Logo étoile Mil'Aura" className="w-full h-full" />
                </motion.div>
              </Link>
            </div>

            <nav className="hidden md:flex md:space-x-8">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className="text-gray-600 transition-colors duration-300 text-base font-medium hover-underline-animation"
                  style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/profil" className="text-gray-600 hover:text-[#BFA57C] transition-colors duration-300">
                <User className="h-6 w-6" />
              </Link>
              <button onClick={onCartClick} className="relative text-gray-600 hover:text-[#BFA57C] transition-colors duration-300">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-xs font-bold text-black">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-[#BFA57C]">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#FBF9F4]/95 backdrop-blur-lg shadow-lg rounded-b-2xl"
          >
            <nav className="flex flex-col items-center space-y-4 py-4">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-[#BFA57C] transition-colors duration-300 text-lg font-medium"
                   style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;