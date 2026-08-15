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
    <div
      tabIndex={0}
      role="button"
      aria-label={`Buka layanan ${service.nama}: ${service.deskripsi}`}
      onClick={() => onServiceClick(service)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
          e.preventDefault()
          onServiceClick(service)
        }
      }}
      className="h-full flex flex-col justify-between relative group overflow-hidden rounded-2xl bg-white hover:bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
    >
      {/* Favorite Button (Star) */}
      {onToggleFavorite && (
        <Button
          variant="outline"
          size="icon"
          title={isFavorite ? 'Lepas dari Favorit' : 'Sematkan ke Favorit'}
          aria-label={isFavorite ? `Lepas ${service.nama} dari favorit` : `Sematkan ${service.nama} ke favorit`}
          aria-pressed={isFavorite}
          className={cn(
            'group/fav absolute top-2.5 left-2.5 h-7 w-7 rounded-lg shadow-2xs backdrop-blur-md transition-all z-10 bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-primary-500',
            isFavorite
              ? 'opacity-100 scale-100'
              : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:focus-visible:opacity-100'
          )}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(service)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
            }
          }}
        >
          <Star
            aria-hidden="true"
            className={cn(
              'h-3.5 w-3.5 transition-all duration-200',
              isFavorite
                ? 'fill-amber-400 text-amber-500 scale-105'
                : 'text-slate-400 group-hover/fav:text-amber-400 group-hover/fav:fill-amber-400 group-hover/fav:scale-110'
            )}
          />
        </Button>
      )}

      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity z-10">
          <Button
            variant="outline"
            size="icon"
            title="Edit Layanan"
            aria-label={`Edit layanan ${service.nama}`}
            className="h-7 w-7 bg-white/95 hover:bg-white text-slate-700 hover:text-primary-600 border-slate-200 shadow-xs focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(service)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
          >
            <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Hapus Layanan"
            aria-label={`Hapus layanan ${service.nama}`}
            className="h-7 w-7 bg-white/95 hover:bg-red-50 text-slate-700 hover:text-red-600 hover:border-red-200 border-slate-200 shadow-xs focus-visible:ring-2 focus-visible:ring-red-500"
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(service)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
          >
            <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Status badge */}
      {!service.is_active && (
        <Badge
          variant="outline"
          className={cn(
            'absolute top-2.5 text-[10px] border-red-300 text-red-600 bg-red-50 z-10 font-medium',
            onToggleFavorite ? 'left-11' : 'left-2.5'
          )}
        >
          Nonaktif
        </Badge>
      )}

      {/* Card Body */}
      <div className="flex flex-col h-full justify-between pointer-events-none">
        {/* Top: Logo area with uniform fixed height */}
        <div className="w-full h-32 sm:h-36 flex items-center justify-center p-4 bg-white rounded-t-2xl shrink-0 border-b border-slate-100">
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

        {/* Middle: Description area */}
        <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-3 text-left">
            {service.deskripsi}
          </p>

          {/* Bottom: Category + External link */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-auto">
            <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600 bg-slate-50 font-medium shrink-0">
              {service.category?.nama || 'Lainnya'}
            </Badge>
            <span className="text-slate-400 text-[10px] truncate max-w-[120px] hidden sm:inline font-medium">
              {service.nama}
            </span>
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary-600 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}


