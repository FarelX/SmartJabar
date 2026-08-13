import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Pencil, Trash2, Layers, Star } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { cn } from '@/lib/utils'
import type { Service } from '@/types'

interface ServiceCardProps {
  service: Service
  onServiceClick: (service: Service) => void
  onEdit?: (service: Service) => void
  onDelete?: (service: Service) => void
  isFavorite?: boolean
  onToggleFavorite?: (service: Service) => void
}

export function ServiceCard({
  service,
  onServiceClick,
  onEdit,
  onDelete,
  isFavorite = false,
  onToggleFavorite,
}: ServiceCardProps) {
  const { isAdmin } = useAuth()

  return (
    <GlassCard hoverable className="h-full flex flex-col justify-between relative group overflow-hidden">
      {/* Favorite Button (Star) */}
      {onToggleFavorite && (
        <Button
          variant="outline"
          size="icon"
          title={isFavorite ? 'Lepas dari Favorit' : 'Sematkan ke Favorit'}
          className={cn(
            'absolute top-2.5 left-2.5 h-7 w-7 rounded-lg shadow-2xs backdrop-blur-md transition-all z-10',
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

      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="outline"
            size="icon"
            title="Edit Layanan"
            className="h-7 w-7 bg-white/90 hover:bg-white text-slate-700 hover:text-primary-600 border-white/80 shadow-xs backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(service)
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Hapus Layanan"
            className="h-7 w-7 bg-white/90 hover:bg-red-50 text-slate-700 hover:text-red-600 hover:border-red-200 border-white/80 shadow-xs backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(service)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Status badge */}
      {!service.is_active && (
        <Badge
          variant="outline"
          className={cn(
            'absolute top-2.5 text-[10px] border-red-300 text-red-600 bg-red-50/85 backdrop-blur-xs z-10 font-medium',
            onToggleFavorite ? 'left-11' : 'left-2.5'
          )}
        >
          Nonaktif
        </Badge>
      )}

      <div
        onClick={() => onServiceClick(service)}
        className="cursor-pointer flex flex-col h-full justify-between"
      >
        {/* Top: Logo area with uniform fixed height & hover animation from main */}
        <div className="w-full h-32 flex items-center justify-center p-4 bg-white/35 group-hover:bg-white/60 transition-all duration-300 rounded-t-2xl shrink-0 border-b border-white/60">
          {service.icon_url ? (
            <img
              src={service.icon_url}
              alt={service.nama}
              className="max-h-20 max-w-[85%] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Layers className="h-8 w-8 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-slate-600 text-xs font-semibold">{service.nama}</span>
            </div>
          )}
        </div>

        {/* Middle: Description area with uniform sizing */}
        <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-3 text-center sm:text-left">
            {service.deskripsi}
          </p>

          {/* Bottom: Category + External link */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 mt-auto">
            <Badge variant="outline" className="text-[10px] border-slate-200/80 text-slate-600 bg-white/50 backdrop-blur-xs font-medium shrink-0">
              {service.category?.nama || 'Lainnya'}
            </Badge>
            <span className="text-slate-400 text-[10px] truncate max-w-[120px] hidden sm:inline font-medium">
              {service.nama}
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary-600 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </GlassCard>
  )
}


