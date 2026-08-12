import { cn } from '@/lib/utils'
import type { ServiceCategory } from '@/types'

interface CategoryFilterProps {
  categories: ServiceCategory[]
  selected: number[]
  onChange: (selected: number[]) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const toggleCategory = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange([])}
        className={cn(
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
          selected.length === 0
            ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-sm shadow-primary-500/25 font-semibold'
            : 'bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
        )}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => toggleCategory(cat.id)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
            selected.includes(cat.id)
              ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-sm shadow-primary-500/25 font-semibold'
              : 'bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
          )}
        >
          {cat.nama}
        </button>
      ))}
    </div>
  )
}

