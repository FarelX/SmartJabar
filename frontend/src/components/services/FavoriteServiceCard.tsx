import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ExternalLink, Layers } from 'lucide-react'
import type { Service } from '@/types'

interface FavoriteServiceCardProps {
  service: Service
  onServiceClick: (service: Service) => void
  onUnpin: (service: Service) => void
}

export function FavoriteServiceCard({
  service,
  onServiceClick,
  onUnpin,
}: FavoriteServiceCardProps) {
  return (
    <GlassCard
      hoverable
      className="h-full flex flex-col justify-between relative overflow-hidden group border-amber-500/20 hover:border-amber-500/40"
      onClick={() => onServiceClick(service)}
    >
      {/* Subtle gold/amber gradient hover background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-primary-500/0 to-teal-500/0 group-hover:from-amber-500/[0.06] group-hover:to-teal-500/[0.04] transition-all duration-500 pointer-events-none rounded-2xl" />

      {/* Top Bar: Pin badge & Unpin Button */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <Badge
          variant="outline"
          className="text-[10px] bg-amber-50/90 text-amber-800 border-amber-300/80 shadow-2xs backdrop-blur-xs font-semibold flex items-center gap-1"
        >
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          Favorit
        </Badge>
      </div>

      <div className="absolute top-2.5 right-2.5 z-10">
        <Button
          variant="outline"
          size="icon"
          title="Lepas dari Favorit"
          className="h-7 w-7 rounded-lg bg-white/90 hover:bg-amber-50 border-amber-200/80 text-amber-500 shadow-2xs backdrop-blur-md transition-all group-hover:scale-105"
          onClick={(e) => {
            e.stopPropagation()
            onUnpin(service)
          }}
        >
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
        </Button>
      </div>

      {/* Logo Area */}
      <div className="relative z-0 w-full h-32 bg-white/35 flex items-center justify-center p-4 rounded-t-2xl group-hover:bg-white/60 border-b border-white/60 transition-all duration-300 shrink-0">
        {service.icon_url ? (
          <img
            src={service.icon_url}
            alt={service.nama}
            className="max-h-20 max-w-[85%] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Layers className="h-8 w-8 text-amber-500/70 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-slate-700 text-xs font-semibold">{service.nama}</span>
          </div>
        )}
      </div>

      {/* Description & Footer */}
      <div className="relative z-0 p-4 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-slate-900 font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {service.nama}
          </h3>
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
            {service.deskripsi}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 mt-3">
          <Badge
            variant="outline"
            className="text-[10px] border-slate-200/80 text-slate-600 bg-white/50 backdrop-blur-xs font-medium"
          >
            {service.category?.nama || 'Layanan'}
          </Badge>
          <div className="flex items-center gap-1 text-primary-600 text-xs font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Buka</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
