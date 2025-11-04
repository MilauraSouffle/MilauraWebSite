import React from 'react';
import ProductsList from '@/components/ProductsList';

const ProductCatalog = ({ isHomePage = false }) => {
  return (
    <section id="products" className="py-12 px-4">
      <div className="container mx-auto">
        <ProductsList limit={isHomePage ? 3 : undefined} />
      </div>
    </section>
  );
};

export default ProductCatalog;