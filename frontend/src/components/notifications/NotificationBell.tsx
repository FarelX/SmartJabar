import { useState } from 'react'
import { useNotifications } from '@/lib/hooks/useNotifications'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Bell,
  CheckCheck,
  Megaphone,
  Calendar,
  ChevronRight,
  Sparkles,
  Inbox,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { News } from '@/types'

export function NotificationBell() {
  const { notifications, unreadCount, isRead, markAsRead, markAllAsRead } = useNotifications()
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleOpenDetail = (news: News) => {
    markAsRead(news.id)
    setSelectedNews(news)
    setDropdownOpen(false)
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Kotak Masuk Notifikasi & Pengumuman"
            className="relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-slate-700 shrink-0"
          >
            <Bell className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-[calc(100vw-2rem)] sm:w-96 max-w-sm p-0 bg-white border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-primary-50 text-primary-600 border border-primary-100">
                <Megaphone className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Kotak Masuk & Pengumuman</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-primary-100 text-primary-700">
                  {unreadCount} baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  markAllAsRead()
                }}
                className="text-[11px] font-medium text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1 cursor-pointer"
                title="Tandai semua sudah dibaca"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Tandai Dibaca</span>
              </button>
            )}
          </div>

          {/* List of announcements */}
          <div className="max-h-[60vh] sm:max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((item) => {
                const read = isRead(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className={cn(
                      'px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer text-left group',
                      read
                        ? 'bg-white hover:bg-slate-50/80'
                        : 'bg-primary-50/30 hover:bg-primary-50/60'
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105',
                        read
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-amber-100 text-amber-600 shadow-2xs'
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-semibold text-primary-700 uppercase tracking-wider">
                          Diskominfo Jabar
                        </span>
                        {item.tanggal_mulai && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        )}
                      </div>

                      <h4
                        className={cn(
                          'text-xs font-bold leading-snug line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors',
                          read ? 'text-slate-700' : 'text-slate-900'
                        )}
                      >
                        {item.judul}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.isi_teks}
                      </p>
                    </div>

                    {/* Status dot / arrow */}
                    <div className="shrink-0 flex items-center self-center pl-1">
                      {!read ? (
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center">
                <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Tidak ada pengumuman</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Semua pengumuman resmi Diskominfo telah tersimpan rapi di sini.
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">
              Pengumuman &amp; Berita Resmi Pemerintah Provinsi Jawa Barat
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal Detail Pengumuman (Membuka kembali isi berita lengkap) */}
      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl p-0 overflow-hidden max-h-[92dvh] flex flex-col rounded-2xl">
          {selectedNews && (
            <>
              {/* Header Modal */}
              <DialogHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-5 shrink-0 border-b border-slate-100 bg-slate-50/50">
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
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1.5 text-left">
                  {selectedNews.judul}
                </DialogTitle>
                {selectedNews.tanggal_mulai && (
                  <DialogDescription className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 text-left">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(selectedNews.tanggal_mulai).toLocaleDateString('id-ID', {
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
                {selectedNews.gambar_url && (
                  <div className="group/img relative w-full rounded-2xl overflow-hidden bg-slate-950/5 border border-slate-200 flex items-center justify-center p-2 shrink-0 max-h-[280px] sm:max-h-[360px]">
                    <img
                      src={selectedNews.gambar_url}
                      alt={selectedNews.judul}
                      className="max-h-[260px] sm:max-h-[340px] w-auto max-w-full object-contain rounded-xl drop-shadow-xs transition-transform duration-300"
                    />
                    <a
                      href={selectedNews.gambar_url}
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

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedNews.isi_teks}
                  </p>
                </div>
              </div>

              {/* Footer Modal */}
              <DialogFooter className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/70 shrink-0 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setSelectedNews(null)}
                  className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white text-xs h-9 px-4 font-medium shadow-xs"
                >
                  Tutup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
