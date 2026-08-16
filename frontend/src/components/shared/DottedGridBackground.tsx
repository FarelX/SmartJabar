import { memo } from 'react'

interface DottedGridBackgroundProps {
  /** Jarak transisi polos di bagian atas sebelum grid mulai muncul (default: 80px) */
  topOffset?: number
}

/**
 * DottedGridBackground Component (Opsi 2)
 * 
 * Latar belakang Dotted Grid ultra-halus (modern & clean):
 * - Titik mikro slate dengan spacing elegan (24px)
 * - Masking vertikal cerdas: Mulai 100% transparan (plain white) di bagian atas
 *   agar transisi dari Hero Section Gedung Sate tetap bersih dan rapi,
 *   lalu memudar masuk secara halus (fade-in) di area 19 kartu layanan.
 * - Anti "AI slop": tidak kontras berlebihan, tidak ada animasi neon silau.
 */
export const DottedGridBackground = memo(function DottedGridBackground({
  topOffset = 60,
}: DottedGridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Subtle Dotted Grid Pattern with Top-to-Bottom Mask */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage: `linear-gradient(to bottom, transparent 0px, transparent ${topOffset}px, rgba(0,0,0,0.85) ${topOffset + 80}px, rgba(0,0,0,0.85) calc(100% - 60px), transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, transparent ${topOffset}px, rgba(0,0,0,0.85) ${topOffset + 80}px, rgba(0,0,0,0.85) calc(100% - 60px), transparent 100%)`,
        }}
      />

      {/* Very Soft Ambient Lighting beneath the grid */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-500/[0.02] blur-[120px]"
      />
    </div>
  )
})
