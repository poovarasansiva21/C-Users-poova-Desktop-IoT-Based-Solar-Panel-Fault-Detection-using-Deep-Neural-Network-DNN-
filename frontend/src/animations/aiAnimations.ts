import { gsap, isReducedMotion } from './gsapConfig';

export const runAIPipelineAnimation = (
  onStepChange: (step: number) => void,
  onComplete: () => void
) => {
  if (isReducedMotion()) {
    onStepChange(5);
    onComplete();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      onComplete();
    }
  });

  tl.call(() => onStepChange(1))
    .to({}, { duration: 0.4 })
    .call(() => onStepChange(2))
    .to({}, { duration: 0.4 })
    .call(() => onStepChange(3))
    .to({}, { duration: 0.5 })
    .call(() => onStepChange(4))
    .to({}, { duration: 0.4 })
    .call(() => onStepChange(5));

  return tl;
};

export const animateConfidenceBar = (barElement: HTMLElement | null, targetPercent: number) => {
  if (!barElement) return;
  if (isReducedMotion()) {
    barElement.style.width = `${targetPercent}%`;
    return;
  }

  gsap.fromTo(
    barElement,
    { width: '0%' },
    {
      width: `${targetPercent}%`,
      duration: 0.9,
      ease: 'power2.out'
    }
  );
};

export const animateAlertPop = (element: HTMLElement | null) => {
  if (!element || isReducedMotion()) return;

  gsap.fromTo(
    element,
    { opacity: 0, y: -20, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
  );
};

export const animateNeuralFlow = (scopeElement: HTMLElement | null) => {
  if (!scopeElement || isReducedMotion()) return null;

  const ctx = gsap.context(() => {
    // Stagger activation pulses along layers
    gsap.to('.neuron-dot', {
      scale: 1.4,
      opacity: 1,
      stagger: {
        each: 0.08,
        repeat: -1,
        yoyo: true
      },
      duration: 0.5,
      ease: 'sine.inOut'
    });

    // Particle flow through synapses
    gsap.to('.synapse-flow', {
      strokeDashoffset: 0,
      repeat: -1,
      duration: 1.5,
      ease: 'none'
    });
  }, scopeElement);

  return ctx;
};
