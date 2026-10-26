import { gsap, isReducedMotion } from './gsapConfig';

export const animateSensorValue = (
  element: HTMLElement | null,
  fromVal: number,
  toVal: number,
  decimals: number = 2
) => {
  if (!element) return;
  if (isReducedMotion()) {
    element.innerText = toVal.toFixed(decimals);
    return;
  }

  const obj = { val: fromVal };
  gsap.to(obj, {
    val: toVal,
    duration: 0.6,
    ease: 'power1.out',
    onUpdate: () => {
      if (element) {
        element.innerText = obj.val.toFixed(decimals);
      }
    }
  });
};

export const animateLivePulse = (element: HTMLElement | null) => {
  if (!element || isReducedMotion()) return null;

  return gsap.to(element, {
    scale: 1.25,
    opacity: 0.7,
    repeat: -1,
    yoyo: true,
    duration: 1.2,
    ease: 'sine.inOut'
  });
};
