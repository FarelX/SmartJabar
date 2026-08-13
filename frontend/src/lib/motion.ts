import type { Variants, Transition } from 'framer-motion'

/**
 * Standardized spring physics transitions for SmartJabar
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 24,
}

export const smoothSpringTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
}

export const gentleEaseTransition: Transition = {
  duration: 0.38,
  ease: [0.16, 1, 0.3, 1],
}

/**
 * Container variants for staggered grid/list children.
 * staggerChildren reduced to 0.05 (was 0.07) for faster completion on low-end devices.
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
}

/**
 * Item variants for cards entering with fade-up.
 * Scale removed — avoids triggering GPU compositing layers per card.
 */
export const fadeUpItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
}

/**
 * Instant/no-op variants for prefers-reduced-motion users.
 * Use these when useReducedMotion() returns true.
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Section fade-in variants
 */
export const sectionFadeInVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}
