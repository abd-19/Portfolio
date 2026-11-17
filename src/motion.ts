// Single source of truth for the user's motion preference (WCAG 2.3.3 / prefers-reduced-motion)
export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
