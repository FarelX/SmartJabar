import { TrendingUp, Layers } from 'lucide-react'
import type { Service } from '@/types'

interface QuickAccessCardProps {
  service: Service
  rank: number
  onServiceClick: (service: Service) => void
}

export function QuickAccessCard({ service, rank, onServiceClick }: QuickAccessCardProps) {
  return (
    <div
      className="h-full flex flex-col justify-between relative overflow-hidden group bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-primary-300 transition-all duration-200 cursor-pointer"
      onClick={() => onServiceClick(service)}
    >
      {/* Rank badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-700 text-[11px] font-bold z-10 shadow-2xs">
        <TrendingUp className="h-3 w-3 text-amber-600" />
        #{rank}
      </div>

      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-teal-500/0 group-hover:from-primary-500/[0.03] group-hover:to-teal-500/[0.03] transition-all duration-300 pointer-events-none rounded-xl" />

      {/* Logo area — fixed uniform height */}
      <div className="relative z-10 w-full h-36 bg-slate-50/70 flex items-center justify-center p-5 rounded-t-xl group-hover:bg-blue-50/30 border-b border-slate-100 transition-all shrink-0">
        {service.icon_url ? (
          <img
            src={service.icon_url}
            alt={service.nama}
            className="max-h-24 max-w-[85%] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Layers className="h-9 w-9 text-slate-400" />
            <span className="text-slate-600 text-xs font-semibold">{service.nama}</span>
          </div>
        )}
      </div>

      {/* Description & info strip */}
      <div className="relative z-10 p-4 pt-3 flex-1 flex flex-col justify-between">
        <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed">
          {service.deskripsi}
        </p>
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-auto">
          <span className="text-slate-400 text-[11px] font-medium">Layanan Populer</span>
          <span className="text-primary-600 text-[11px] font-semibold">
            {service.usage_count?.toLocaleString()} kali diakses
          </span>
        </div>
      </div>
    </div>
  )
}

