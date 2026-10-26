import { gsap, ScrollTrigger, isReducedMotion } from './gsapConfig';

export const initScrollSection = (element: HTMLElement | null, staggerClass: string = '.stagger-item') => {
  if (!element || isReducedMotion()) return null;

  const ctx = gsap.context(() => {
    // Reveal section heading and subtitle
    gsap.from('.section-header', {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Reveal stagger cards/elements
    gsap.from(staggerClass, {
      scrollTrigger: {
        trigger: element,
        start: 'top 75%',
        once: true
      },
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out'
    });
  }, element);

  return ctx;
};
