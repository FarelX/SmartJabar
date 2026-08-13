import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { TrendingUp, Layers, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Service } from '@/types'

interface QuickAccessCardProps {
  service: Service
  rank: number
  onServiceClick: (service: Service) => void
  isFavorite?: boolean
  onToggleFavorite?: (service: Service) => void
}

export function QuickAccessCard({
  service,
  rank,
  onServiceClick,
  isFavorite = false,
  onToggleFavorite,
}: QuickAccessCardProps) {
  return (
    <GlassCard
      hoverable
      className="h-full flex flex-col justify-between relative overflow-hidden group"
      onClick={() => onServiceClick(service)}
    >
      {/* Favorite Button (Star) */}
      {onToggleFavorite && (
        <Button
          variant="outline"
          size="icon"
          title={isFavorite ? 'Lepas dari Favorit' : 'Sematkan ke Favorit'}
          className={cn(
            'absolute top-3 left-3 h-7 w-7 rounded-lg shadow-2xs backdrop-blur-md transition-all z-20',
            isFavorite
              ? 'bg-amber-50/95 border-amber-300 text-amber-500 opacity-100 hover:bg-amber-100 hover:scale-105'
              : 'bg-white/90 border-white/80 text-slate-400 hover:text-amber-500 hover:border-amber-200 opacity-0 group-hover:opacity-100'
          )}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(service)
          }}
        >
          <Star
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              isFavorite ? 'fill-amber-400 text-amber-500' : 'hover:scale-110'
            )}
          />
        </Button>
      )}

      {/* Rank badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-500/15 border border-red-400/40 text-red-800 text-[11px] font-bold z-10 shadow-2xs backdrop-blur-xs">
        <TrendingUp className="h-3 w-3 text-red-600" />
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


