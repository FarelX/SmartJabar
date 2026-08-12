import { cn } from '@/lib/utils'
import type { ServiceCategory } from '@/types'

interface CategoryFilterProps {
  categories: ServiceCategory[]
  selected: number | null
  onChange: (selected: number | null) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const handleSelect = (id: number) => {
    // Jika kategori yang sama diklik lagi, toggle kembali ke 'Semua' (null), jika tidak pilih kategori tersebut
    onChange(selected === id ? null : id)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
          selected === null
            ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-md shadow-primary-500/25 font-semibold'
            : 'glass bg-white/60 hover:bg-white/90 border-white/70 text-slate-700 hover:text-slate-900 shadow-2xs'
        )}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.id)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
            selected === cat.id
              ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-md shadow-primary-500/25 font-semibold'
              : 'glass bg-white/60 hover:bg-white/90 border-white/70 text-slate-700 hover:text-slate-900 shadow-2xs'
          )}
        >
          {cat.nama}
        </button>
      ))}
    </div>
  )
}



