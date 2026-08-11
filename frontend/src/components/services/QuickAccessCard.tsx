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
      className="p-6 relative overflow-hidden group"
      onClick={() => onServiceClick(service)}
    >
      {/* Rank badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/20 text-accent text-[10px] font-bold">
        <TrendingUp className="h-3 w-3" />
        #{rank}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-teal-500/0 group-hover:from-primary-500/5 group-hover:to-teal-500/5 transition-all duration-500 rounded-xl" />

      <div className="relative z-10">
        {/* Service icon/logo */}
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4 overflow-hidden group-hover:bg-white/10 transition-all">
          {service.icon_url ? (
            <img
              src={service.icon_url}
              alt={service.nama}
              className="w-11 h-11 object-contain"
            />
          ) : (
            <Layers className="h-6 w-6 text-primary-400" />
          )}
        </div>
        <h3 className="text-white font-semibold text-base mb-1">{service.nama}</h3>
        <p className="text-white/40 text-xs line-clamp-2">{service.deskripsi}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-white/20 text-[10px]">
            {service.usage_count?.toLocaleString()} kali diakses
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
