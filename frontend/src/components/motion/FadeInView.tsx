import { motion } from 'framer-motion'
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
 */
export function FadeInView({
  children,
  className,
  delay = 0,
  duration = 0.45,
  direction = 'up',
  amount = 0.15,
  margin = '0px 0px -40px 0px',
}: FadeInViewProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 28, x: 0 }
      case 'down':
        return { y: -28, x: 0 }
      case 'left':
        return { x: 28, y: 0 }
      case 'right':
        return { x: -28, y: 0 }
      case 'none':
        return { x: 0, y: 0 }
    }
  }

  const offset = getInitialPosition()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, ...offset }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
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

