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
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl backdrop-blur-sm focus:bg-white/8 focus:border-primary-500/50 focus:ring-primary-500/20 transition-all text-base"
      />
    </div>
  )
}
