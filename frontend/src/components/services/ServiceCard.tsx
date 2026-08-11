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
    <GlassCard hoverable className="p-5 relative group">
      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
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
            className="h-7 w-7 text-white/40 hover:text-red-400 hover:bg-red-500/10"
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
        <Badge variant="outline" className="absolute top-3 right-3 text-[10px] border-red-500/50 text-red-400 bg-red-500/10">
          Nonaktif
        </Badge>
      )}

      <div onClick={() => onServiceClick(service)} className="cursor-pointer">
        {/* Service icon/logo */}
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 overflow-hidden group-hover:bg-white/10 transition-all">
          {service.icon_url ? (
            <img
              src={service.icon_url}
              alt={service.nama}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <Layers className="h-5 w-5 text-primary-400" />
          )}
        </div>

        <h3 className="text-white font-semibold text-sm mb-1.5">{service.nama}</h3>
        <p className="text-white/40 text-xs line-clamp-2 mb-3 min-h-[2rem]">{service.deskripsi}</p>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] border-white/10 text-white/40 bg-white/5">
            {service.category?.nama || 'Lainnya'}
          </Badge>
          <ExternalLink className="h-3.5 w-3.5 text-white/20 group-hover:text-primary-400 transition-colors" />
        </div>
      </div>
    </GlassCard>
  )
}
