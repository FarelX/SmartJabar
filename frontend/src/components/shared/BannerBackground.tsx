import React from 'react'
import { cn } from '@/lib/utils'

interface BannerBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Konten di dalam container banner */
  children?: React.ReactNode
  /** Kelas CSS tambahan untuk wrapper */
  className?: string
  /** Tampilkan pola grid dot geometris */
  showGridPattern?: boolean
  /** Tampilkan glowing blur orbs */
  showGlowingOrbs?: boolean
}

/**
 * Komponen reusable untuk background bergaya hero/banner SmartJabar
 * yang memiliki gradien gelap premium (navy/slate), glowing orbs,
 * dan pola geometris subtle.
 */
export function BannerBackground({
  children,
  className,
  showGridPattern = true,
  showGlowingOrbs = true,
  ...props
}: BannerBackgroundProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border border-blue-800/40 p-6 sm:p-8',
        className
      )}
      {...props}
    >
      {/* Background Decorative Gradient Orbs */}
      {showGlowingOrbs && (
        <>
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-20 w-72 h-72 rounded-full bg-blue-600/25 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 top-1/2 w-64 h-64 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
        </>
      )}

      {/* Subtle geometric dot pattern overlay */}
      {showGridPattern && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {/* Children Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/**
 * Layer background murni tanpa wrapper container/padding,
 * cocok digunakan secara absolute di dalam custom container.
 */
export function BannerBackgroundLayer({
  className,
  showGridPattern = true,
  showGlowingOrbs = true,
}: {
  className?: string
  showGridPattern?: boolean
  showGlowingOrbs?: boolean
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pointer-events-none',
        className
      )}
    >
      {showGlowingOrbs && (
        <>
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute left-1/3 -bottom-20 w-72 h-72 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 w-64 h-64 rounded-full bg-indigo-500/15 blur-2xl" />
        </>
      )}

      {showGridPattern && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      )}
    </div>
  )
}
