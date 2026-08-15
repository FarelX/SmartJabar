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
import { ChevronLeft, ChevronRight, X, Calendar, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
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
      <DialogContent className="w-[calc(100vw-1rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl p-0 overflow-hidden max-h-[92dvh] flex flex-col rounded-2xl">
        {/* Header Modal */}
        <DialogHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5 shrink-0 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] bg-primary-50 text-primary-700 border-primary-200 font-semibold"
              >
                Pengumuman Resmi
              </Badge>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-[11px] text-slate-500 font-medium">
                Diskominfo Pemprov Jabar
              </span>
            </div>

            {hasMultiple && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs border-slate-200 text-slate-600 bg-white font-semibold shrink-0 mr-5"
              >
                {currentIndex + 1} / {news.length}
              </Badge>
            )}
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1.5 text-left">
            {currentNews.judul}
          </DialogTitle>

          {currentNews.tanggal_mulai && (
            <DialogDescription className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 text-left">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>
                {new Date(currentNews.tanggal_mulai).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Body Content */}
        <div className="px-4 py-4 sm:px-6 space-y-3 overflow-y-auto flex-1 min-h-0">
          {currentNews.gambar_url && (
            <div
              className={cn(
                'group/img relative w-full rounded-2xl overflow-hidden bg-slate-950/5 border border-slate-200 flex items-center justify-center p-2 shrink-0 transition-all',
                currentNews.isi_teks?.trim()
                  ? 'max-h-[280px] sm:max-h-[340px]'
                  : 'max-h-[68vh] sm:max-h-[540px]'
              )}
            >
              <img
                src={currentNews.gambar_url}
                alt={currentNews.judul}
                className={cn(
                  'w-auto max-w-full object-contain rounded-xl drop-shadow-xs transition-transform duration-300',
                  currentNews.isi_teks?.trim()
                    ? 'max-h-[260px] sm:max-h-[320px]'
                    : 'max-h-[64vh] sm:max-h-[520px]'
                )}
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

          {currentNews.isi_teks?.trim() && (
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {currentNews.isi_teks}
              </p>
            </div>
          )}
        </div>

        {/* Footer Modal / Navigation */}
        <DialogFooter className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/70 shrink-0">
          {hasMultiple ? (
            <div className="flex items-center justify-between w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 px-3 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Sebelumnya</span>
                <span className="xs:hidden">Prev</span>
              </Button>

              {/* Navigation Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {news.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                      idx === currentIndex
                        ? 'w-5 bg-primary-600'
                        : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                    )}
                    title={`Pengumuman ${idx + 1}`}
                  />
                ))}
              </div>

              <Button
                size="sm"
                onClick={() => {
                  if (currentIndex < news.length - 1) {
                    setCurrentIndex(i => i + 1)
                  } else {
                    setIsOpen(false)
                  }
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-9 px-4 font-medium shadow-xs"
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
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-9 px-4 font-medium shadow-xs"
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
