import { gsap, isReducedMotion } from './gsapConfig';

export const animateHeroTimeline = (scopeElement: HTMLElement | null) => {
  if (!scopeElement || isReducedMotion()) return null;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

    // 1. Badges & Tagline
    tl.from('.hero-badge', {
      opacity: 0,
      y: -15,
      stagger: 0.1,
      duration: 0.6
    })
    // 2. Heading
    .from('.hero-title', {
      opacity: 0,
      y: 30,
      duration: 0.9
    }, '-=0.3')
    // 3. Subtitle
    .from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, '-=0.5')
    // 4. CTA Buttons
    .from('.hero-btn', {
      opacity: 0,
      scale: 0.95,
      stagger: 0.15,
      duration: 0.6
    }, '-=0.4')
    // 5. Hero Pipeline Diagram Elements Reveal Sequentially
    .from('.flow-solar', {
      opacity: 0,
      scale: 0.8,
      duration: 0.7
    }, '-=0.3')
    .from('.flow-sensors', {
      opacity: 0,
      y: 15,
      duration: 0.6
    }, '-=0.3')
    .from('.flow-esp32', {
      opacity: 0,
      scale: 0.85,
      duration: 0.6
    }, '-=0.3')
    .from('.flow-backend', {
      opacity: 0,
      y: 15,
      duration: 0.6
    }, '-=0.3')
    .from('.flow-dnn', {
      opacity: 0,
      scale: 0.85,
      duration: 0.6
    }, '-=0.3')
    .from('.flow-detection', {
      opacity: 0,
      scale: 0.85,
      duration: 0.7
    }, '-=0.3');

    // Continuous subtle data flow pulse along the pipeline
    gsap.to('.energy-particle', {
      x: '100%',
      repeat: -1,
      duration: 2.4,
      ease: 'none',
      stagger: 0.4
    });

  }, scopeElement);

  return ctx;
};
