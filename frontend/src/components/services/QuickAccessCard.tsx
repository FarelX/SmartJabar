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
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/20 text-accent text-[10px] font-bold z-10">
        <TrendingUp className="h-3 w-3" />
        #{rank}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-teal-500/0 group-hover:from-primary-500/5 group-hover:to-teal-500/5 transition-all duration-500 rounded-xl" />

      {/* Logo area — fixed uniform height */}
      <div className="relative z-10 w-full h-36 bg-white/[0.02] flex items-center justify-center p-5 rounded-t-xl group-hover:bg-white/[0.05] transition-all shrink-0">
        {service.icon_url ? (
          <img
            src={service.icon_url}
            alt={service.nama}
            className="max-h-24 max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Layers className="h-10 w-10 text-white/20" />
        )}
      </div>

      {/* Description & info strip */}
      <div className="relative z-10 p-4 pt-2 flex-1 flex flex-col justify-between">
        <p className="text-white/60 text-xs line-clamp-2 mb-3">
          {service.deskripsi}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <span className="text-white/30 text-[11px] font-medium">Layanan Populer</span>
          <span className="text-accent/80 text-[11px] font-semibold">
            {service.usage_count?.toLocaleString()} kali diakses
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
