import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, X, Newspaper, Calendar, ExternalLink } from 'lucide-react'
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
      {/*
        Mobile: full-width, bottom-anchored sheet feel (max-h-[92dvh] + mx-2)
        Desktop (sm+): centered modal max-w-lg
      */}
      <DialogContent className="
        w-[calc(100vw-1rem)] max-w-lg
        bg-white border-slate-200 text-slate-900 shadow-2xl
        p-0 overflow-hidden
        max-h-[92dvh] flex flex-col
        rounded-2xl sm:rounded-2xl
      ">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                <Newspaper className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Pengumuman &amp; Berita
                </DialogTitle>
                <DialogDescription className="text-[11px] sm:text-xs text-slate-500 leading-tight mt-0.5 hidden sm:block">
                  Informasi resmi Pemerintah Provinsi Jawa Barat
                </DialogDescription>
              </div>
            </div>
            {hasMultiple && (
              <Badge variant="outline" className="text-[10px] sm:text-xs border-slate-200 text-slate-600 bg-slate-50 font-semibold shrink-0 ml-2">
                {currentIndex + 1} / {news.length}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="px-4 pb-2 sm:px-6 space-y-3 overflow-y-auto flex-1 min-h-0">
          {currentNews.gambar_url && (
            <div className="group/img relative w-full rounded-2xl overflow-hidden bg-slate-950/5 border border-slate-200/90 flex items-center justify-center p-2 shrink-0 max-h-[280px] sm:max-h-[360px]">
              <img
                src={currentNews.gambar_url}
                alt={currentNews.judul}
                className="max-h-[260px] sm:max-h-[340px] w-auto max-w-full object-contain rounded-xl drop-shadow-xs transition-transform duration-300"
              />
              <a
                href={currentNews.gambar_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka gambar ukuran penuh"
                className="absolute top-2.5 right-2.5 opacity-0 group-hover/img:opacity-100 transition-all bg-white/90 hover:bg-white text-slate-700 hover:text-primary-600 px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-xs border border-slate-200/80 flex items-center gap-1 backdrop-blur-xs"
              >
                <span>Ukuran Penuh</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div>
            <h3 className="text-slate-900 font-bold text-base sm:text-lg mb-2 leading-snug">
              {currentNews.judul}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100">
              {currentNews.isi_teks}
            </p>

            {currentNews.tanggal_mulai && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-3">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {new Date(currentNews.tanggal_mulai).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Navigation */}
        <DialogFooter className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
          {hasMultiple ? (
            <div className="flex items-center justify-between w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Sebelumnya</span>
                <span className="xs:hidden">Prev</span>
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (currentIndex < news.length - 1) {
                    setCurrentIndex(i => i + 1)
                  } else {
                    setIsOpen(false)
                  }
                }}
                className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white text-xs h-9 px-3 font-medium shadow-xs"
              >
                {currentIndex < news.length - 1 ? (
                  <>
                    <span className="hidden xs:inline">Selanjutnya</span>
                    <span className="xs:hidden">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Tutup
                    <X className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9"
              >
                Tutup
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
