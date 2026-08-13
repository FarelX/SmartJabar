import { motion } from 'framer-motion'
import { fadeUpItemVariants } from '@/lib/motion'
import type { ReactNode } from 'react'

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

/**
 * StaggerItem — Anak dari StaggerContainer yang otomatis beranimasi naik secara halus.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={fadeUpItemVariants} className={className}>
      {children}
    </motion.div>
  )
}
