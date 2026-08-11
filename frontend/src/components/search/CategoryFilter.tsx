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
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          selected.length === 0
            ? 'bg-gradient-to-r from-primary-500 to-teal-600 text-white shadow-lg shadow-primary-500/20'
            : 'glass-static text-white/60 hover:text-white hover:bg-white/10'
        )}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => toggleCategory(cat.id)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            selected.includes(cat.id)
              ? 'bg-gradient-to-r from-primary-500 to-teal-600 text-white shadow-lg shadow-primary-500/20'
              : 'glass-static text-white/60 hover:text-white hover:bg-white/10'
          )}
        >
          {cat.nama}
        </button>
      ))}
    </div>
  )
}
