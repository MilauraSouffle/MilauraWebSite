import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Instagram, Facebook, Mail, Package } from 'lucide-react';
import Seo from "@/components/Seo";

const links = [
  {
    icon: ShoppingBag,
    text: 'Nos produits',
    href: '/boutique',
    isExternal: false,
  },
  {
    icon: Instagram,
    text: 'Instagram',
    href: 'https://www.instagram.com/milaura_souffle/',
    isExternal: true,
  },
  {
    icon: Facebook,
    text: 'Facebook',
    href: 'https://www.facebook.com/milaura.creations',
    isExternal: true,
  },
  {
    icon: Mail,
    text: 'Contact mail',
    href: 'mailto:contact@milaura.fr',
    isExternal: true,
  },
  {
    icon: Package,
    text: 'Suivi commande',
    href: '#', // Lien à ajouter plus tard
    isExternal: false,
    disabled: true,
  },
];

const ContactPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const renderLink = (link) => {
    const content = (
      <motion.div
        className={`w-full flex items-center justify-center text-center p-4 h-16 rounded-full border-2 border-amber-300/50 bg-white/50 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group ${link.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-amber-50/50 hover:border-amber-400'}`}
        variants={itemVariants}
        whileHover={!link.disabled ? { scale: 1.03 } : {}}
        whileTap={!link.disabled ? { scale: 0.98 } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 -translate-x-full group-hover:translate-x-0" />
        <link.icon className="w-6 h-6 mr-3 text-amber-600" />
        <span className="font-semibold text-gray-800">{link.text}</span>
      </motion.div>
    );

    if (link.disabled) {
      return <div key={link.text}>{content}</div>;
    }

    if (link.isExternal) {
      return (
        <a key={link.text} href={link.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }

    return (
      <Link key={link.text} to={link.href}>
        {content}
      </Link>
    );
  };

  return (
    <>
      <Seo
        title="Contact & liens utiles"
        description="Contactez Mil’aura et retrouvez tous nos liens."
        canonical="https://milaura.fr/contact"
      />
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#FBF9F4] to-[#F5EFE6] p-4">
        <motion.div
          className="w-full max-w-md mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <img
              src="https://i.imgur.com/Y6OG1mr.png"
              alt="Logo Mil'Aura"
              className="w-28 h-28 mx-auto mb-4"
            />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-2"
            variants={itemVariants}
          >
            Mil'Aura
          </motion.h1>
          <motion.p
            className="text-gray-600 mb-8"
            variants={itemVariants}
          >
            Créations énergétiques et émotionnelles, fabriquées avec soin en France.
          </motion.p>

          <div className="space-y-4">
            {links.map(renderLink)}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ContactPage;