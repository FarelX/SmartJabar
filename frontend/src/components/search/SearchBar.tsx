import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Cari layanan...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 h-12 bg-white/95 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl shadow-xs focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 transition-all text-base"
      />
    </div>
  )
}

