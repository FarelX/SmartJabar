import { cn } from '@/lib/utils'

interface GridBackgroundProps {
  className?: string
  children?: React.ReactNode
  showTechAccents?: boolean
}

interface GridBackgroundLayerProps {
  className?: string
  fixed?: boolean
  showTechAccents?: boolean
  density?: 'normal' | 'dense'
}

/**
 * Clean Background Layer — solid light background (#F8FAFC / slate-50).
 */
export function GridBackgroundLayer({
  className,
  fixed = false,
}: GridBackgroundLayerProps) {
  return (
    <div
      className={cn(
        fixed ? 'fixed inset-0 pointer-events-none z-0' : 'absolute inset-0 pointer-events-none',
        'bg-slate-50',
        className
      )}
      aria-hidden="true"
    />
  )
}

/**
 * Full Page Background Wrapper component.
 */
export function GridBackground({
  className,
  children,
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'min-h-screen min-h-dvh relative bg-slate-50 selection:bg-primary-500 selection:text-white',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}

