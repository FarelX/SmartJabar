import { Loader2 } from 'lucide-react'

export function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-teal-400 animate-spin opacity-30" />
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin absolute" />
      </div>
      <p className="text-slate-500 text-xs font-medium tracking-wide">Memuat halaman...</p>
    </div>
  )
}
