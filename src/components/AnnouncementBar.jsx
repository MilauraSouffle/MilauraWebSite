import React from 'react';

const AnnouncementBar = () => {
  return (
    <div
      className="bg-[#B18E48] text-white text-center py-2 px-4 z-[51] relative overflow-hidden"
    >
      <div className="shimmer-effect absolute inset-0"></div>
      <p className="text-sm font-medium relative">
        ✨ Livraison offerte dès 39 € · Chaque commande préparée avec soin en France 🌿 · Pierres certifiées
      </p>
    </div>
  );
};

export default AnnouncementBar;