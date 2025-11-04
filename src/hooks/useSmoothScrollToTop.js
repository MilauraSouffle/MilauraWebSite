import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

// Ce hook personnalisé gère l'instance de Lenis pour le scroll fluide
// et assure que la page remonte en haut à chaque changement de route.
const useSmoothScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialise Lenis pour le défilement fluide
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    // Fonction de rafraîchissement pour l'animation
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    
    // Remonte en haut de la page à chaque changement de `pathname`
    // en utilisant la méthode de Lenis pour rester cohérent avec le scroll fluide.
    lenis.scrollTo(0, { immediate: true });

    // Nettoie l'instance de Lenis lors du démontage du composant
    // pour éviter les fuites de mémoire.
    return () => {
      lenis.destroy();
    };
  }, [location.pathname]); // Se déclenche à chaque changement d'URL

  return null;
};

export default useSmoothScrollToTop;