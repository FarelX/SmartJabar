import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  strong?: boolean
  onClick?: () => void
}

/**
 * GlassCard — Base glassmorphism card component.
 * Semi-translucent background, backdrop blur, glowing border.
 */
export function GlassCard({ children, className, hoverable = false, strong = false, onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        strong ? 'glass-strong' : hoverable ? 'glass-card-hover' : 'glass-card',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
