import { GlassCard } from '@/components/shared/GlassCard'
import { TrendingUp, Layers } from 'lucide-react'
import type { Service } from '@/types'

interface QuickAccessCardProps {
  service: Service
  rank: number
  onServiceClick: (service: Service) => void
}

export function QuickAccessCard({ service, rank, onServiceClick }: QuickAccessCardProps) {
  return (
    <GlassCard
      hoverable
      className="h-full flex flex-col justify-between relative overflow-hidden group"
      onClick={() => onServiceClick(service)}
    >
      {/* Rank badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-800 text-[11px] font-bold z-10 shadow-2xs backdrop-blur-xs">
        <TrendingUp className="h-3 w-3 text-amber-600" />
        #{rank}
      </div>

      {/* Subtle hover gradient from main */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-teal-500/0 group-hover:from-primary-500/[0.04] group-hover:to-teal-500/[0.04] transition-all duration-500 pointer-events-none rounded-2xl" />

      {/* Logo area — fixed uniform height */}
      <div className="relative z-10 w-full h-36 bg-white/35 flex items-center justify-center p-5 rounded-t-2xl group-hover:bg-white/60 border-b border-white/60 transition-all duration-300 shrink-0">
        {service.icon_url ? (
          <img
            src={service.icon_url}
            alt={service.nama}
            className="max-h-24 max-w-[85%] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Layers className="h-9 w-9 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-slate-600 text-xs font-semibold">{service.nama}</span>
          </div>
        )}
      </div>

      {/* Description & info strip */}
      <div className="relative z-10 p-4 pt-3 flex-1 flex flex-col justify-between">
        <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed">
          {service.deskripsi}
        </p>
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 mt-auto">
          <span className="text-slate-400 text-[11px] font-medium">Layanan Populer</span>
          <span className="text-primary-600 text-[11px] font-bold">
            {service.usage_count?.toLocaleString()} kali diakses
          </span>
        </div>
      </div>
    </GlassCard>
  )
}


