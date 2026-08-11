import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Pencil, Trash2, Layers } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import type { Service } from '@/types'

interface ServiceCardProps {
  service: Service
  onServiceClick: (service: Service) => void
  onEdit?: (service: Service) => void
  onDelete?: (service: Service) => void
}

export function ServiceCard({ service, onServiceClick, onEdit, onDelete }: ServiceCardProps) {
  const { isAdmin } = useAuth()

  return (
    <GlassCard hoverable className="h-full flex flex-col justify-between relative group overflow-hidden">
      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(service)
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/40 hover:text-red-400 hover:bg-red-500/20 backdrop-blur-sm"
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
        <Badge variant="outline" className="absolute top-2 left-2 text-[10px] border-red-500/50 text-red-400 bg-red-500/10 z-10">
          Nonaktif
        </Badge>
      )}

      <div
        onClick={() => onServiceClick(service)}
        className="cursor-pointer flex flex-col h-full justify-between"
      >
        {/* Top: Logo area with uniform fixed height */}
        <div className="w-full h-32 flex items-center justify-center p-4 bg-white/[0.02] group-hover:bg-white/[0.05] transition-all rounded-t-xl shrink-0">
          {service.icon_url ? (
            <img
              src={service.icon_url}
              alt={service.nama}
              className="max-h-20 max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Layers className="h-8 w-8 text-white/20" />
              <span className="text-white/40 text-xs font-semibold">{service.nama}</span>
            </div>
          )}
        </div>

        {/* Middle: Description area with uniform sizing */}
        <div className="p-4 pt-2 flex-1 flex flex-col justify-between">
          <p className="text-white/60 text-xs leading-relaxed line-clamp-3 mb-3 text-center sm:text-left">
            {service.deskripsi}
          </p>

          {/* Bottom: Category + External link */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
            <Badge variant="outline" className="text-[10px] border-white/10 text-white/40 bg-white/5 shrink-0">
              {service.category?.nama || 'Lainnya'}
            </Badge>
            <span className="text-white/20 text-[10px] truncate max-w-[120px] hidden sm:inline">
              {service.nama}
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-white/20 group-hover:text-primary-400 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
