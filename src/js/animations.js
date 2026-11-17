/**
 * Scroll-reveal animations using IntersectionObserver.
 * Elements with the class `.reveal` will fade-in and slide-up
 * once they enter the viewport.
 */

const REVEAL_THRESHOLD = 0.15;
const REVEAL_ROOT_MARGIN = '0px 0px -60px 0px';

/**
 * Applies the `.visible` class to observed elements once they
 * intersect the viewport. Unobserves after first reveal so the
 * animation only fires once per element.
 */
function handleReveal(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}

/**
 * Initialises the IntersectionObserver for all `.reveal` elements.
 * Respects `prefers-reduced-motion` — if the user prefers reduced
 * motion, all elements are made visible immediately.
 */
export function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  // Respect reduced-motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers — just show everything
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(handleReveal, {
    threshold: REVEAL_THRESHOLD,
    rootMargin: REVEAL_ROOT_MARGIN,
  });

  reveals.forEach((el) => observer.observe(el));
}
