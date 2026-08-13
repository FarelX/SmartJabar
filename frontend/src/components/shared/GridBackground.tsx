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
 * Reusable Grid Background Layer — for embedding directly or fixing in portal layouts.
 */
export function GridBackgroundLayer({
  className,
  fixed = false,
  showTechAccents = true,
  density = 'normal',
}: GridBackgroundLayerProps) {
  const gridSize = density === 'dense' ? 32 : 40

  return (
    <div
      className={cn(
        fixed ? 'fixed inset-0 pointer-events-none z-0' : 'absolute inset-0 pointer-events-none',
        'overflow-hidden bg-slate-50',
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Base Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/60 to-blue-50/20" />

      {/* 2. Soft Ambient Lighting (Static glows) */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-500/6 blur-3xl" />

      {/* 3. SVG Grid Pattern with Crosshairs and Radial Mask */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 98%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 98%)',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Grid Unit */}
            <pattern
              id="global-grid-pattern"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              {/* Subtle Grid Box Lines */}
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="rgba(148, 163, 184, 0.20)"
                strokeWidth="1"
              />
              {/* Subtle Crosshair (+) at grid intersections */}
              <path
                d="M 0 -3 L 0 3 M -3 0 L 3 0"
                fill="none"
                stroke="rgba(59, 130, 246, 0.32)"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>

          {/* Fill Grid Background */}
          <rect width="100%" height="100%" fill="url(#global-grid-pattern)" />

          {/* Decorative Subtle Accent Grid Blocks */}
          <rect x="120" y="80" width={gridSize} height={gridSize} fill="rgba(59, 130, 246, 0.04)" />
          <rect x="160" y="80" width={gridSize} height={gridSize} fill="rgba(59, 130, 246, 0.02)" />
          <rect x="240" y="200" width={gridSize * 2} height={gridSize} fill="rgba(13, 148, 136, 0.03)" />
          <rect x="80" y="440" width={gridSize} height={gridSize} fill="rgba(59, 130, 246, 0.03)" />
        </svg>
      </div>

      {/* 4. Fine Tech Accent Labels (Optional, desktop only) */}
      {showTechAccents && (
        <>
          <div className="absolute top-6 left-6 hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-400 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span>SYS.JABARPROV.GO.ID</span>
          </div>

          <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-400 select-none">
            <span>LAT -6.9025° • LONG 107.6186°</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Full Page Grid Background Wrapper component.
 */
export function GridBackground({
  className,
  children,
  showTechAccents = true,
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'min-h-screen min-h-dvh relative overflow-hidden bg-slate-50 selection:bg-primary-500 selection:text-white',
        className
      )}
    >
      <GridBackgroundLayer showTechAccents={showTechAccents} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
