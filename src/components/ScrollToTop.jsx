import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Utilisation de window.scrollTo(0, 0) pour une remise à zéro plus directe et fiable.
    // Cette méthode est universellement supportée et moins sujette aux interférences.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;