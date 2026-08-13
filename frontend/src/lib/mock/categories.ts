import type { ServiceCategory } from '@/types'

const STORAGE_KEY = 'smartjabar_mock_categories'

export const defaultMockCategories: ServiceCategory[] = [
  { id: 1, nama: 'Kepegawaian' },
  { id: 2, nama: 'Dokumen' },
  { id: 3, nama: 'Data' },
  { id: 4, nama: 'Pengawasan' },
  { id: 5, nama: 'Keuangan' },
]

export function getStoredCategories(): ServiceCategory[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return defaultMockCategories
}

export function saveStoredCategories(categories: ServiceCategory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    window.dispatchEvent(new CustomEvent('smartjabar_categories_updated'))
  } catch (e) {
    console.error('Failed to save categories', e)
  }
}

export const mockCategories: ServiceCategory[] = getStoredCategories()
