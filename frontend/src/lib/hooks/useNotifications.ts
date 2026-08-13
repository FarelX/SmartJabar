import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { getStoredNews, getActiveNews } from '@/lib/mock/news'
import type { News } from '@/types'

export function useNotifications() {
  const { user } = useAuth()
  const storageKey = user?.nip ? `smartjabar_read_news_${user.nip}` : 'smartjabar_read_news_default'

  const [newsList, setNewsList] = useState<News[]>(() => getStoredNews())

  // Sinkronisasi realtime saat ada berita baru yang ditambah/diedit di kelola berita
  useEffect(() => {
    const handleUpdate = () => {
      setNewsList(getStoredNews())
    }
    window.addEventListener('smartjabar_news_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('smartjabar_news_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Daftar pengumuman aktif
  const notifications = useMemo<News[]>(() => {
    return getActiveNews(newsList)
  }, [newsList])

  // State ID pengumuman yang sudah dibaca
  const [readIds, setReadIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
      return []
    } catch {
      return []
    }
  })

  // Sinkronisasi saat berganti user
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setReadIds(parsed)
          return
        }
      }
      setReadIds([])
    } catch {
      setReadIds([])
    }
  }, [storageKey])

  const saveReadIds = useCallback((ids: number[]) => {
    setReadIds(ids)
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids))
    } catch (e) {
      console.error('Failed to save read notifications', e)
    }
  }, [storageKey])

  const isRead = useCallback((id: number) => {
    return readIds.includes(id)
  }, [readIds])

  const markAsRead = useCallback((id: number) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id]
      saveReadIds(updated)
    }
  }, [readIds, saveReadIds])

  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map(n => n.id)
    saveReadIds(allIds)
  }, [notifications, saveReadIds])

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length
  }, [notifications, readIds])

  return {
    notifications,
    unreadCount,
    isRead,
    markAsRead,
    markAllAsRead,
  }
}
