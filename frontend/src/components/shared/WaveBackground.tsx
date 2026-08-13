import { cn } from '@/lib/utils'

interface WaveBackgroundProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Static Wave Background with West Java inspired flowing wave contours,
 * soft ambient lights, and subtle geometric patterns.
 */
export function WaveBackground({ className, children }: WaveBackgroundProps) {
  return (
    <div
      className={cn(
        'min-h-screen min-h-dvh relative overflow-hidden bg-slate-50 selection:bg-primary-500 selection:text-white',
        className
      )}
    >
      {/* 1. Static Gradient Base Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/80 to-teal-50/40 pointer-events-none" />

      {/* 2. Soft Ambient Radial Light Spots (Static, no animation) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* 3. Subtle Geometric Matrix Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 4. Top Flowing Waves SVG */}
      <svg
        className="absolute top-0 left-0 right-0 w-full h-48 sm:h-72 pointer-events-none opacity-40 text-blue-500/20"
        viewBox="0 0 1440 320"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          fill="url(#top-wave-grad-1)"
        />
        <path
          d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,186.7C840,181,960,139,1080,128C1200,117,1320,139,1380,149.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          fill="url(#top-wave-grad-2)"
        />
        <defs>
          <linearGradient id="top-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="top-wave-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </svg>

      {/* 5. Bottom Multi-Layer Organic Wave Flow SVG */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-56 sm:h-80 pointer-events-none opacity-60"
        viewBox="0 0 1440 320"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,218.7C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="url(#bottom-wave-grad-1)"
        />
        <path
          d="M0,128L40,149.3C80,171,160,213,240,218.7C320,224,400,192,480,181.3C560,171,640,181,720,202.7C800,224,880,256,960,245.3C1040,235,1120,181,1200,165.3C1280,149,1360,171,1400,181.3L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          fill="url(#bottom-wave-grad-2)"
        />
        <path
          d="M0,288L60,277.3C120,267,240,245,360,245.3C480,245,600,267,720,261.3C840,256,960,224,1080,208C1200,192,1320,192,1380,192L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="url(#bottom-wave-grad-3)"
        />
        <defs>
          <linearGradient id="bottom-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.09" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="bottom-wave-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="bottom-wave-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.07" />
          </linearGradient>
        </defs>
      </svg>

      {/* 6. Topographic Contour Line Accents (West Java Mountain & Valley Theme) */}
      <svg
        className="absolute top-1/4 right-0 w-96 h-96 pointer-events-none opacity-20 hidden lg:block"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50,200 Q150,50 300,120 T400,280"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M30,240 Q130,90 280,160 T380,320"
          stroke="#0d9488"
          strokeWidth="1.5"
        />
        <path
          d="M10,280 Q110,130 260,200 T360,360"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Main Content Area */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
