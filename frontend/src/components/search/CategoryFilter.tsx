import { motion } from 'framer-motion'
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

  const isAllSelected = selected === null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer select-none',
          isAllSelected
            ? 'text-white font-semibold'
            : 'glass bg-white/60 hover:bg-white/90 border-white/70 text-slate-700 hover:text-slate-900 shadow-2xs'
        )}
      >
        {isAllSelected && (
          <motion.div
            layoutId="active-category-pill"
            className="absolute inset-0 bg-gradient-to-r from-primary-600 to-teal-600 rounded-xl shadow-md shadow-primary-500/25 -z-0"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10">Semua</span>
      </button>
      {categories.map((cat) => {
        const isCatSelected = selected === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={cn(
              'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer select-none',
              isCatSelected
                ? 'text-white font-semibold'
                : 'glass bg-white/60 hover:bg-white/90 border-white/70 text-slate-700 hover:text-slate-900 shadow-2xs'
            )}
          >
            {isCatSelected && (
              <motion.div
                layoutId="active-category-pill"
                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-teal-600 rounded-xl shadow-md shadow-primary-500/25 -z-0"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{cat.nama}</span>
          </button>
        )
      })}
    </div>
  )
}




