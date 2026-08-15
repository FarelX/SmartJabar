import { Layers } from 'lucide-react'
import type { Service } from '@/types'

interface QuickAccessCardProps {
  service: Service
  rank?: number
  onServiceClick: (service: Service) => void
  isFavorite?: boolean
  onToggleFavorite?: (service: Service) => void
}

export function QuickAccessCard({
  service,
  onServiceClick,
}: QuickAccessCardProps) {
  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Layanan terpopuler: ${service.nama}. ${service.deskripsi}.${service.usage_count ? ` ${service.usage_count.toLocaleString()} kali diakses.` : ''}`}
      className="h-full flex flex-col justify-between relative overflow-hidden group rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
      onClick={() => onServiceClick(service)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
          e.preventDefault()
          onServiceClick(service)
        }
      }}
    >
      {/* Top Logo Area — frosted glass with subtle bottom separator */}
      <div
        className="w-full h-32 sm:h-36 flex items-center justify-center p-4 rounded-t-2xl shrink-0"
        style={{
          background: 'rgba(255, 255, 255, 0.70)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        {service.icon_url ? (
          <img
            src={service.icon_url}
            alt={`Logo ${service.nama}`}
            className="max-h-20 max-w-[80%] object-contain drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Layers aria-hidden="true" className="h-8 w-8 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-slate-600 text-xs font-semibold">{service.nama}</span>
          </div>
        )}
      </div>

      {/* Description & info strip */}
      <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
        <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed font-normal">
          {service.deskripsi}
        </p>
        <div
          className="flex items-center justify-between pt-2.5 mt-auto"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.5)' }}
        >
          <span className="text-slate-400 text-[11px] font-normal">Layanan Populer</span>
          <span className="text-blue-600 font-semibold text-[11px]">
            {service.usage_count?.toLocaleString()} kali diakses
          </span>
        </div>
      </div>
    </div>
  )
}
