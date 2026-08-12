import { motion } from 'framer-motion'
import { staggerContainerVariants } from '@/lib/motion'
import type { ReactNode } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  layoutKey?: string | number
  viewportMargin?: string
}

/**
 * StaggerContainer — Wrapper grid/list container yang memicu animasi berurutan pada anak-anaknya.
 */
export function StaggerContainer({
  children,
  className,
  layoutKey,
  viewportMargin = '-30px',
}: StaggerContainerProps) {
  return (
    <motion.div
      key={layoutKey}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
