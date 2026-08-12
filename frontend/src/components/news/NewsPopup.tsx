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
import { ChevronLeft, ChevronRight, X, Newspaper, Calendar } from 'lucide-react'
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
      <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center">
                <Newspaper className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Pengumuman & Berita
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Informasi resmi Pemerintah Provinsi Jawa Barat
                </DialogDescription>
              </div>
            </div>
            {hasMultiple && (
              <Badge variant="outline" className="text-xs border-slate-200 text-slate-600 bg-slate-50 font-semibold">
                {currentIndex + 1} / {news.length}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 pt-2 space-y-4 max-h-[65vh] overflow-y-auto">
          {currentNews.gambar_url && (
            <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
              <img
                src={currentNews.gambar_url}
                alt={currentNews.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-2">
              {currentNews.judul}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {currentNews.isi_teks}
            </p>

            {currentNews.tanggal_mulai && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-3">
                <Calendar className="h-3.5 w-3.5" />
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

        {/* Footer / Navigation with shadcn Button */}
        <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between sm:justify-between">
          {hasMultiple ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-8"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
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
                className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white text-xs h-8 font-medium shadow-xs"
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
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-8"
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

