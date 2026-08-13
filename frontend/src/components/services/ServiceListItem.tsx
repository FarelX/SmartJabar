import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Pencil, Trash2, Layers, Star } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { cn } from '@/lib/utils'
import type { Service } from '@/types'

interface ServiceListItemProps {
  service: Service
  onServiceClick: (service: Service) => void
  onEdit?: (service: Service) => void
  onDelete?: (service: Service) => void
  isFavorite?: boolean
  onToggleFavorite?: (service: Service) => void
}

export function ServiceListItem({
  service,
  onServiceClick,
  onEdit,
  onDelete,
  isFavorite = false,
  onToggleFavorite,
}: ServiceListItemProps) {
  const { isAdmin } = useAuth()

  return (
    <div
      onClick={() => onServiceClick(service)}
      className={cn(
        'group relative flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer',
        'glass bg-white/70 hover:bg-white/90 border border-white/80 hover:border-primary-200/80 shadow-2xs hover:shadow-xs'
      )}
    >
      {/* Left side: Star, Logo, Name & Description */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
        {/* Favorite Button (Star) */}
        {onToggleFavorite && (
          <Button
            variant="outline"
            size="icon"
            title={isFavorite ? 'Lepas dari Favorit' : 'Sematkan ke Favorit'}
            className={cn(
              'group/fav h-7 w-7 sm:h-8 sm:w-8 rounded-lg shadow-2xs backdrop-blur-md transition-all shrink-0 bg-white/90 hover:bg-white border-white/80 hover:border-slate-200',
              isFavorite
                ? 'opacity-100 scale-100'
                : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(service)
            }}
          >
            <Star
              className={cn(
                'h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-200',
                isFavorite
                  ? 'fill-amber-400 text-amber-500 scale-105'
                  : 'text-slate-400 group-hover/fav:text-amber-400 group-hover/fav:fill-amber-400 group-hover/fav:scale-110'
              )}
            />
          </Button>
        )}

        {/* Thumbnail Logo */}
        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white/85 border border-slate-200/70 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
          {service.icon_url ? (
            <img
              src={service.icon_url}
              alt={service.nama}
              className="max-h-full max-w-full object-contain drop-shadow-xs"
            />
          ) : (
            <Layers className="h-5 w-5 text-slate-400" />
          )}
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-primary-600 transition-colors truncate">
              {service.nama}
            </h3>

            {/* Category badge */}
            <Badge
              variant="outline"
              className="text-[9px] sm:text-[10px] py-0 px-1.5 border-slate-200/80 text-slate-600 bg-white/60 font-medium shrink-0"
            >
              {service.category?.nama || 'Layanan'}
            </Badge>

            {/* Inactive badge */}
            {!service.is_active && (
              <Badge
                variant="outline"
                className="text-[9px] sm:text-[10px] py-0 px-1.5 border-red-300 text-red-600 bg-red-50/80 font-medium shrink-0"
              >
                Nonaktif
              </Badge>
            )}
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 leading-relaxed">
            {service.deskripsi}
          </p>
        </div>
      </div>

      {/* Right side: Admin controls & External link / Open action */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Admin controls */}
        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              title="Edit Layanan"
              className="h-7 w-7 bg-white/90 hover:bg-white text-slate-700 hover:text-primary-600 border-slate-200 shadow-2xs"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(service)
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Hapus Layanan"
              className="h-7 w-7 bg-white/90 hover:bg-red-50 text-slate-700 hover:text-red-600 hover:border-red-200 border-slate-200 shadow-2xs"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(service)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Buka Layanan action */}
        <div className="flex items-center gap-1 text-primary-600 text-xs font-semibold px-2 py-1 rounded-lg group-hover:bg-primary-50/80 transition-colors">
          <span className="hidden sm:inline">Buka</span>
          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  )
}
