export const animations = { 
  fadeUp: { 
    initial: { opacity: 0, y: 20 }, 
    animate: { opacity: 1, y: 0 }, 
    transition: { duration: 0.4, ease: 'easeOut' } 
  }, 
  fadeIn: { 
    initial: { opacity: 0 }, 
    animate: { opacity: 1 }, 
    transition: { duration: 0.3 } 
  }, 
  scaleIn: { 
    initial: { opacity: 0, scale: 0.95 }, 
    animate: { opacity: 1, scale: 1 }, 
    transition: { duration: 0.3, ease: 'easeOut' } 
  }, 
  slideRight: { 
    initial: { opacity: 0, x: -16 }, 
    animate: { opacity: 1, x: 0 }, 
    transition: { duration: 0.3 } 
  }, 
  stagger: { 
    animate: { transition: { staggerChildren: 0.08 } } 
  } 
} 

export const getAnimationProps = (type: keyof typeof animations) => {
  const isReduced = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  if (isReduced) {
    return {
      ...animations[type],
      transition: { ...(animations[type] as { transition?: Record<string, unknown> }).transition, duration: 0 }
    };
  }
  
  return animations[type];
};
