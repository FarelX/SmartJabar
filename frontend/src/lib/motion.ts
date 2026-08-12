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
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
}

/**
 * Container variants for staggered grid/list children
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

/**
 * Item variants for cards entering with spring lift
 */
export const fadeUpItemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
}

/**
 * Section fade-in variants
 */
export const sectionFadeInVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}
