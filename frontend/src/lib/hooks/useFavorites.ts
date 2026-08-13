import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { toast } from 'sonner'
import type { Service } from '@/types'

const MAX_FAVORITES = 6
const DEFAULT_FAVORITE_IDS = [1, 2] // Default awal: JABAR SMART ASN & SIDEBAR

export function useFavorites() {
  const { user } = useAuth()
  const storageKey = user?.nip ? `smartjabar_favs_${user.nip}` : 'smartjabar_favs_default'

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
      return DEFAULT_FAVORITE_IDS
    } catch {
      return DEFAULT_FAVORITE_IDS
    }
  })

  // Sinkronisasi saat user berganti akun (misal switch role di demo)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
          return
        }
      }
      setFavorites(DEFAULT_FAVORITE_IDS)
    } catch {
      setFavorites(DEFAULT_FAVORITE_IDS)
    }
  }, [storageKey])

  // Simpan perubahan ke localStorage
  const saveFavorites = useCallback((newFavs: number[]) => {
    setFavorites(newFavs)
    try {
      localStorage.setItem(storageKey, JSON.stringify(newFavs))
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e)
    }
  }, [storageKey])

  const isFavorite = useCallback((serviceId: number) => {
    return favorites.includes(serviceId)
  }, [favorites])

  const toggleFavorite = useCallback((service: Pick<Service, 'id' | 'nama'>) => {
    if (favorites.includes(service.id)) {
      const updated = favorites.filter(id => id !== service.id)
      saveFavorites(updated)
      toast.info(`Layanan "${service.nama}" dihapus dari favorit`)
      return false
    } else {
      if (favorites.length >= MAX_FAVORITES) {
        toast.warning(`Maksimal ${MAX_FAVORITES} layanan favorit yang dapat disematkan`)
        return false
      }
      const updated = [...favorites, service.id]
      saveFavorites(updated)
      toast.success(`Layanan "${service.nama}" disematkan ke favorit ⭐`)
      return true
    }
  }, [favorites, saveFavorites])

  const removeFavorite = useCallback((serviceId: number, serviceName?: string) => {
    const updated = favorites.filter(id => id !== serviceId)
    saveFavorites(updated)
    if (serviceName) {
      toast.info(`Layanan "${serviceName}" dilepas dari favorit`)
    }
  }, [favorites, saveFavorites])

  return {
    favorites,
    maxFavorites: MAX_FAVORITES,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  }
}
