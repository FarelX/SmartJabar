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
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.40) 100%)',
        backdropFilter: 'blur(20px) saturate(200%) brightness(118%)',
        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(118%)',
        border: '1px solid rgba(255, 255, 255, 0.70)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1.5px 1px rgba(255,255,255,0.95), inset 0 0 16px rgba(255,255,255,0.25)',
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
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.22) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
        }}
      >
        {service.icon_url ? (
          <img
            src={service.icon_url}
            alt={`Logo ${service.nama}`}
            className="max-h-20 max-w-[80%] object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Layers aria-hidden="true" className="h-8 w-8 text-slate-500 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-slate-700 text-xs font-semibold">{service.nama}</span>
          </div>
        )}
      </div>

      {/* Description & info strip */}
      <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
        <p className="text-slate-700 text-xs line-clamp-2 mb-3 leading-relaxed font-normal">
          {service.deskripsi}
        </p>
        <div
          className="flex items-center justify-between pt-2.5 mt-auto"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.45)' }}
        >
          <span className="text-slate-600/90 text-[11px] font-medium">Layanan Populer</span>
          <span className="text-primary-700 font-semibold text-[11px]">
            {service.usage_count?.toLocaleString()} kali diakses
          </span>
        </div>
      </div>
    </div>
  )
}
