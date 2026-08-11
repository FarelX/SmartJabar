import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X, Newspaper } from 'lucide-react'
import type { News } from '@/types'

interface NewsPopupProps {
  news: News[]
}

export function NewsPopup({ news }: NewsPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Tampil otomatis saat pertama kali buka dashboard dalam sesi
  useEffect(() => {
    if (news.length === 0) return
    const shown = sessionStorage.getItem('news_popup_shown')
    if (!shown) {
      setIsOpen(true)
      sessionStorage.setItem('news_popup_shown', 'true')
    }
  }, [news])

  if (news.length === 0) return null

  const currentNews = news[currentIndex]
  const hasMultiple = news.length > 1

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-strong border-white/10 bg-primary-950/95 backdrop-blur-2xl max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <Newspaper className="h-4 w-4 text-accent" />
              </div>
              <DialogTitle className="text-white text-lg font-semibold">
                Berita & Pengumuman
              </DialogTitle>
            </div>
            {hasMultiple && (
              <span className="text-white/30 text-xs">
                {currentIndex + 1} / {news.length}
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 pt-4">
          {currentNews.gambar_url && (
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-white/5">
              <img
                src={currentNews.gambar_url}
                alt={currentNews.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h3 className="text-white font-semibold text-lg mb-3">
            {currentNews.judul}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
            {currentNews.isi_teks}
          </p>

          {currentNews.tanggal_mulai && (
            <p className="text-white/20 text-xs mt-4">
              {new Date(currentNews.tanggal_mulai).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between">
          {hasMultiple ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentIndex < news.length - 1) {
                    setCurrentIndex(i => i + 1)
                  } else {
                    setIsOpen(false)
                  }
                }}
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                {currentIndex < news.length - 1 ? (
                  <>
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Tutup
                    <X className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                Tutup
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
