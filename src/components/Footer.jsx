import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

const footerLinks = [
  {
    title: "Boutique",
    links: [
      { name: "Nos collections", href: "/nos-collections" },
      { name: "Nouveautés", href: "/nouveautes" },
      { name: "Calendriers de l'Avent", href: "/calendriers-de-l-avent" },
      { name: "Bougie Émotionnelle", href: "/bougie-emotionnelle" },
    ],
  },
  {
    title: "Inspiration",
    links: [
      { name: "Conseils & Énergie", href: "/conseils-energie" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Légal",
    links: [
      { name: "Conditions Générales de Vente", href: "/cgv" },
      { name: "Politique de Confidentialité", href: "/confidentialite" },
      { name: "Mentions Légales", href: "/mentions-legales" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com" },
  { icon: Instagram, href: "https://instagram.com" },
  { icon: Youtube, href: "https://youtube.com" },
];

const Footer = () => {
  return (
    <footer className="bg-[#FBF9F4] text-gray-800 pt-20 pb-8 px-4 sm:px-6 lg:px-8 border-t-2 border-amber-200/50">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
           <Link to="/" className="flex flex-col items-center space-y-4 mb-4">
             <motion.div
              className="relative w-40 h-40"
              animate={{ rotate: 360 }}
              transition={{
                loop: Infinity,
                ease: "linear",
                duration: 20
              }}
            >
              <img src="https://i.imgur.com/Y6OG1mr.png" alt="Logo étoile Mil'Aura" className="w-full h-full" />
            </motion.div>
          </Link>
          <p className="text-2xl text-gray-700 mt-4 font-semibold italic">
            Créateur d'émotions
          </p>
          <p className="text-md text-gray-600 mt-2 max-w-md">
            Mil’Aura unit la beauté des pierres à la magie des émotions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col items-center md:items-start">
              <p className="font-bold text-lg mb-4 text-gradient-gold-warm">{section.title}</p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-600 hover:text-[#BFA57C] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-amber-200/50 flex flex-col items-center">
          <div className="flex space-x-6 mb-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#BFA57C] transition-colors">
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Mil'Aura. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;