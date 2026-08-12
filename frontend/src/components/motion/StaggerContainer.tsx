import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainerVariants, reducedMotionVariants } from '@/lib/motion'
import type { ReactNode } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  layoutKey?: string | number
  viewportMargin?: string
}

/**
 * StaggerContainer — Wrapper grid/list container yang memicu animasi berurutan pada anak-anaknya.
 * Respek prefers-reduced-motion: gunakan instant variants bila diaktifkan.
 */
export function StaggerContainer({
  children,
  className,
  layoutKey,
  viewportMargin = '-30px',
}: StaggerContainerProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      key={layoutKey}
      variants={prefersReduced ? reducedMotionVariants : staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
