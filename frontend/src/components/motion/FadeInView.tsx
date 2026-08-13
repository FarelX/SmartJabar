import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInViewProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  amount?: number
  margin?: string
}

/**
 * FadeInView — Wrapper komponen untuk menganimasikan elemen saat masuk ke viewport saat di-scroll.
 *
 * Perf optimizations vs. sebelumnya:
 * - `scale` dihapus dari initial state → mengurangi GPU compositing layer per elemen
 * - y-offset dikurangi 28 → 20 (pergerakan lebih singkat)
 * - duration default 0.45 → 0.38 (lebih snappy)
 * - Respek `prefers-reduced-motion` via useReducedMotion(): langsung tampil tanpa transisi
 */
export function FadeInView({
  children,
  className,
  delay = 0,
  duration = 0.38,
  direction = 'up',
  amount = 0.15,
  margin = '0px 0px -40px 0px',
}: FadeInViewProps) {
  const prefersReduced = useReducedMotion()

  // If user prefers reduced motion, skip all animation entirely
  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const getOffset = () => {
    switch (direction) {
      case 'up':    return { y: 20, x: 0 }
      case 'down':  return { y: -20, x: 0 }
      case 'left':  return { x: 20, y: 0 }
      case 'right': return { x: -20, y: 0 }
      case 'none':  return { x: 0, y: 0 }
    }
  }

  const offset = getOffset()

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount, margin }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
