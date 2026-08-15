import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hoverable?: boolean
  strong?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

/**
 * GlassCard — Base glassmorphism card component.
 * Semi-translucent background, backdrop blur, glowing border.
 */
export function GlassCard({
  children,
  className,
  hoverable = false,
  strong = false,
  onClick,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        strong ? 'glass-strong' : hoverable ? 'glass-card-hover' : 'glass-card',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
