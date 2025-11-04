import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';
import { categories } from '@/data/categories';
import Seo from "@/components/Seo";

const getCategoryInfo = (slug) => {
  if (!slug) return { 
      name: "Toutes nos créations",
      title: "Boutique | Toutes nos créations énergétiques",
      description: "Explorez toutes les créations Mil’Aura. Bougies émotionnelles, bijoux en pierres naturelles, et objets de lithothérapie pour votre bien-être spirituel.",
      header: "Toutes nos créations",
      subHeader: "Plongez au coeur de l'univers Mil'Aura et trouvez le trésor qui vous correspond."
  };
  
  const category = categories.find(cat => cat.slug === slug);
  
  if(!category) return {
      name: "Collection Introuvable",
      title: "Collection Introuvable",
      description: "Cette collection semble s'être égarée dans les brumes mystiques.",
      header: "Collection Introuvable",
      subHeader: "Revenez à nos collections pour trouver votre chemin."
  };

  return {
      name: category.name,
      title: `${category.name} | Collection Lithothérapie`,
      description: `Découvrez notre collection de ${category.name}. Des créations uniques en lithothérapie pour l'harmonie, le bien-être et vos rituels personnels.`,
      header: category.name,
      subHeader: `Explorez nos créations uniques dans la collection ${category.name}.`
  };
};

const ShopPage = () => {
  const { categorySlug } = useParams();
  const { title, description, header, subHeader } = getCategoryInfo(categorySlug);
  
  const url = `https://milaura.fr/${categorySlug ? 'collections/' + categorySlug : 'boutique'}`;

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonical={url}
      />
      <motion.div 
        className="container mx-auto px-4 pb-20 pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
            <h1 className="text-6xl font-script font-bold text-gradient-gold-warm mb-4 shine-effect">{header}</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">{subHeader}</p>
        </div>
        <ProductsList categorySlug={categorySlug} />
      </motion.div>
    </>
  );
};

export default ShopPage;