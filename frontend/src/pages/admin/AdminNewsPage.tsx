import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  Newspaper,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  RotateCcw,
  X,
  AlertTriangle,
  FolderOpen,
  ImageIcon,
  Clock,
} from 'lucide-react'
import { DatePicker, ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { FadeInView } from '@/components/motion'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { isValidUrl, sanitizeString } from '@/lib/validation'
import { getStoredNews, saveStoredNews } from '@/lib/mock/news'
import type { News, NewsFormData } from '@/types'

const { RangePicker } = DatePicker

const emptyForm: NewsFormData = {
  judul: '',
  isi_teks: '',
  gambar_url: '',
  is_active: true,
  tanggal_mulai: '',
  tanggal_selesai: '',
}

export function AdminNewsPage() {
  const [newsList, setNewsList] = useState<News[]>(() => getStoredNews())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [deletingNews, setDeletingNews] = useState<News | null>(null)
  const [previewNews, setPreviewNews] = useState<News | null>(null)
  const [form, setForm] = useState<NewsFormData>(emptyForm)

  // Metrics
  const activeNewsCount = useMemo(() => newsList.filter(n => n.is_active).length, [newsList])
  const inactiveNewsCount = useMemo(() => newsList.filter(n => !n.is_active).length, [newsList])
  const newsWithImagesCount = useMemo(() => newsList.filter(n => Boolean(n.gambar_url)).length, [newsList])

  // Filtered news
  const filteredNews = useMemo(() => {
    return newsList.filter(news => {
      const matchSearch =
        !search.trim() ||
        news.judul.toLowerCase().includes(search.toLowerCase()) ||
        (news.isi_teks ? news.isi_teks.toLowerCase().includes(search.toLowerCase()) : false)

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && news.is_active) ||
        (statusFilter === 'inactive' && !news.is_active)

      return matchSearch && matchStatus
    })
  }, [newsList, search, statusFilter])

  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all'

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
  }

  const openCreate = () => {
    setEditingNews(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (news: News) => {
    setEditingNews(news)
    setForm({
      judul: news.judul,
      isi_teks: news.isi_teks || '',
      gambar_url: news.gambar_url || '',
      is_active: news.is_active,
      tanggal_mulai: news.tanggal_mulai || '',
      tanggal_selesai: news.tanggal_selesai || '',
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    const cleanJudul = sanitizeString(form.judul)
    const cleanIsiTeks = sanitizeString(form.isi_teks)
    const cleanGambarUrl = form.gambar_url ? form.gambar_url.trim() : ''

    if (!cleanJudul) {
      toast.error('Judul pengumuman wajib diisi.')
      return
    }

    if (!cleanIsiTeks && !cleanGambarUrl) {
      toast.error('Mohon isi teks pengumuman atau unggah gambar poster / banner.')
      return
    }

    if (cleanGambarUrl && !isValidUrl(cleanGambarUrl, true)) {
      toast.error('Format URL gambar tidak valid.')
      return
    }

    const payload: NewsFormData = {
      ...form,
      judul: cleanJudul,
      isi_teks: cleanIsiTeks,
      gambar_url: cleanGambarUrl || '',
    }

    if (editingNews) {
      const updated = newsList.map(n =>
        n.id === editingNews.id
          ? {
              ...n,
              ...payload,
              isi_teks: cleanIsiTeks,
              gambar_url: cleanGambarUrl || null,
              tanggal_mulai: form.tanggal_mulai || null,
              tanggal_selesai: form.tanggal_selesai || null,
              updated_at: new Date().toISOString(),
            }
          : n
      )
      setNewsList(updated)
      saveStoredNews(updated)
      toast.success('Pengumuman berhasil diperbarui!')
    } else {
      const newNews: News = {
        id: Math.max(...newsList.map(n => n.id), 0) + 1,
        ...payload,
        isi_teks: cleanIsiTeks,
        gambar_url: cleanGambarUrl || null,
        tanggal_mulai: form.tanggal_mulai || null,
        tanggal_selesai: form.tanggal_selesai || null,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const updated = [...newsList, newNews]
      setNewsList(updated)
      saveStoredNews(updated)
      toast.success('Pengumuman baru berhasil ditambahkan!')
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingNews) {
      const updated = newsList.filter(n => n.id !== deletingNews.id)
      setNewsList(updated)
      saveStoredNews(updated)
      setDeleteDialogOpen(false)
      toast.success(`Pengumuman "${deletingNews.judul}" berhasil dihapus.`)
      setDeletingNews(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <FadeInView direction="down">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-100/80">
                Administrasi Informasi
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Kelola Berita & Pengumuman
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Atur siaran pop-up pengumuman resmi dan banner informasi untuk ASN di portal SmartJabar.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={openCreate}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm transition-all text-xs sm:text-sm h-9 sm:h-10 px-4"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah Berita
            </Button>
          </div>
        </div>
      </FadeInView>

      {/* Summary KPI Cards */}
      <FadeInView delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-slate-200/80 bg-white/90 shadow-2xs">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Pengumuman
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {newsList.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0">
                <Newspaper className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-2xs">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-emerald-600 uppercase tracking-wider">
                  Sedang Tayang
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {activeNewsCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-2xs">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nonaktif / Arsip
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {inactiveNewsCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-500 shrink-0">
                <XCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-2xs">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Banner Bergambar
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {newsWithImagesCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                <ImageIcon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeInView>

      {/* Filter & Search Toolbar */}
      <FadeInView delay={0.1}>
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Search input */}
              <div className="sm:col-span-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari pengumuman berdasarkan judul atau isi teks..."
                  className="pl-9 pr-8 bg-slate-50/70 focus:bg-white border-slate-200 text-xs sm:text-sm h-9.5 rounded-xl transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    title="Hapus pencarian"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="sm:col-span-4">
                <Select
                  value={statusFilter}
                  onValueChange={(val: 'all' | 'active' | 'inactive') => setStatusFilter(val)}
                >
                  <SelectTrigger className="w-full bg-slate-50/70 focus:bg-white border-slate-200 text-xs sm:text-sm h-9.5 rounded-xl">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg">
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Status: Sedang Tayang</SelectItem>
                    <SelectItem value="inactive">Status: Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter state and reset */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Filter aktif:</span>
                  {search && (
                    <Badge variant="outline" className="text-[10px] bg-slate-50 font-normal">
                      Keyword: "{search}"
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="outline" className="text-[10px] bg-slate-50 font-normal">
                      Status: {statusFilter === 'active' ? 'Sedang Tayang' : 'Nonaktif'}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-7 text-xs text-slate-500 hover:text-primary-600 px-2"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset Filter
                </Button>
              </div>
            )}
          </div>

          {/* News Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="w-[45%] text-slate-600 font-semibold text-xs py-3.5">
                      Pengumuman & Isi
                    </TableHead>
                    <TableHead className="w-[25%] text-slate-600 font-semibold text-xs hidden md:table-cell">
                      Periode Tayang
                    </TableHead>
                    <TableHead className="w-[15%] text-slate-600 font-semibold text-xs">
                      Status
                    </TableHead>
                    <TableHead className="w-[15%] text-slate-600 font-semibold text-xs text-right pr-4">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.length > 0 ? (
                    filteredNews.map(news => (
                      <TableRow
                        key={news.id}
                        className="border-slate-100/80 hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Title & snippet */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                              {news.gambar_url ? (
                                <img
                                  src={news.gambar_url}
                                  alt={news.judul}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Newspaper className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0 max-w-sm sm:max-w-md">
                              <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate block">
                                {news.judul}
                              </span>
                              {news.isi_teks ? (
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {news.isi_teks}
                                </p>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic mt-0.5">
                                  (Pengumuman gambar poster)
                                </p>
                              )}
                              {/* Mobile date preview */}
                              <div className="md:hidden mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(news.tanggal_mulai)} s.d {formatDate(news.tanggal_selesai)}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Date column */}
                        <TableCell className="hidden md:table-cell py-3">
                          <div className="space-y-0.5 text-xs text-slate-600">
                            {news.tanggal_mulai || news.tanggal_selesai ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-700">
                                  {formatDate(news.tanggal_mulai)}
                                </span>
                                <span className="text-slate-400">—</span>
                                <span className="text-slate-700">
                                  {formatDate(news.tanggal_selesai)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">Tanpa batas waktu</span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3">
                          {news.is_active ? (
                            <Badge
                              variant="outline"
                              className="text-[11px] border-emerald-200 text-emerald-700 bg-emerald-50/80 font-medium inline-flex items-center gap-1 py-0.5 px-2 rounded-full"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Tayang
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[11px] border-slate-200 text-slate-500 bg-slate-50 font-medium inline-flex items-center gap-1 py-0.5 px-2 rounded-full"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Nonaktif
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right py-3 pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Pratinjau Pengumuman"
                              className="h-8 w-8 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                              onClick={() => {
                                setPreviewNews(news)
                                setPreviewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit Pengumuman"
                              className="h-8 w-8 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                              onClick={() => openEdit(news)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-600 hover:text-slate-900 rounded-lg"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 text-xs">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setPreviewNews(news)
                                    setPreviewDialogOpen(true)
                                  }}
                                  className="cursor-pointer text-xs"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-2" />
                                  Pratinjau Pop-up
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEdit(news)}
                                  className="cursor-pointer text-xs"
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-2" />
                                  Edit Pengumuman
                                </DropdownMenuItem>
                                {news.gambar_url && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(news.gambar_url!, '_blank')}
                                    className="cursor-pointer text-xs"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                                    Buka Banner Penuh
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setDeletingNews(news)
                                    setDeleteDialogOpen(true)
                                  }}
                                  className="cursor-pointer text-xs text-red-600 focus:text-red-700 focus:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  Hapus Pengumuman
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                          <FolderOpen className="h-9 w-9 stroke-[1.5] text-slate-300" />
                          <p className="text-sm font-medium text-slate-600">
                            Tidak ada pengumuman yang sesuai
                          </p>
                          <p className="text-xs text-slate-400 max-w-xs">
                            Coba ubah kata kunci pencarian atau sesuaikan status filter.
                          </p>
                          {hasActiveFilters && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleResetFilters}
                              className="mt-2 text-xs border-slate-200"
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                              Reset Filter
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </FadeInView>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingNews ? 'Edit Berita & Pengumuman' : 'Tambah Pengumuman Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kelola informasi pengumuman pop-up untuk seluruh ASN Jawa Barat.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Judul */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">
                Judul Pengumuman <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.judul}
                onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                placeholder="Contoh: Pemeliharaan Server Portal SmartJabar"
                className="h-9.5 rounded-xl border-slate-200 text-xs"
              />
            </div>

            {/* Isi Teks */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 text-xs font-semibold">
                  Isi Teks Pengumuman <span className="text-slate-400 font-normal">(Opsional)</span>
                </Label>
                <span className="text-[10px] text-slate-400">
                  Kosongkan jika pengumuman hanya berupa poster / gambar
                </span>
              </div>
              <Textarea
                value={form.isi_teks}
                onChange={e => setForm(f => ({ ...f, isi_teks: e.target.value }))}
                className="min-h-[90px] resize-none rounded-xl border-slate-200 text-xs"
                placeholder="Tuliskan isi detail pengumuman jika ada (opsional jika sudah ada banner poster)..."
              />
            </div>

            {/* Banner Image */}
            <ImageUpload
              value={form.gambar_url}
              onChange={url => setForm(f => ({ ...f, gambar_url: url }))}
              onRemove={() => setForm(f => ({ ...f, gambar_url: '' }))}
              label="Banner / Gambar Pengumuman (Opsional jika ada teks)"
              aspectRatio="banner"
              maxSizeMB={5}
            />

            {/* Periode Tayang RangePicker */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Periode Tayang
              </Label>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#2563eb',
                    borderRadius: 10,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    colorBorder: '#e2e8f0',
                    colorBgContainer: '#ffffff',
                  },
                }}
              >
                <RangePicker
                  value={
                    form.tanggal_mulai && form.tanggal_selesai
                      ? [dayjs(form.tanggal_mulai), dayjs(form.tanggal_selesai)]
                      : form.tanggal_mulai
                      ? [dayjs(form.tanggal_mulai), null]
                      : null
                  }
                  onChange={(_dates, dateStrings) => {
                    setForm(f => ({
                      ...f,
                      tanggal_mulai: dateStrings && dateStrings[0] ? dateStrings[0] : '',
                      tanggal_selesai: dateStrings && dateStrings[1] ? dateStrings[1] : '',
                    }))
                  }}
                  format="YYYY-MM-DD"
                  placeholder={['Tanggal Mulai', 'Tanggal Selesai']}
                  className="w-full h-9.5 rounded-xl border-slate-200"
                  allowClear
                />
              </ConfigProvider>
              <p className="text-[10px] text-slate-400">
                Kosongkan rentang tanggal jika pengumuman berlaku seterusnya tanpa batas waktu.
              </p>
            </div>

            {/* Toggle Aktif */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-0.5">
                <Label className="text-slate-800 text-xs font-semibold cursor-pointer">
                  Status Pengumuman Aktif
                </Label>
                <p className="text-slate-500 text-[11px]">
                  Tampilkan sebagai pop-up otomatis di beranda portal saat pengguna masuk.
                </p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={checked => setForm(f => ({ ...f, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.judul.trim() || (!form.isi_teks.trim() && !form.gambar_url)}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs h-9 rounded-xl shadow-xs"
            >
              {editingNews ? 'Simpan Perubahan' : 'Tambah Pengumuman'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl p-0 overflow-hidden max-h-[92dvh] flex flex-col rounded-2xl">
          {previewNews && (
            <>
              {/* Header Modal */}
              <DialogHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5 shrink-0 border-b border-slate-100 bg-slate-50/50">
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
                  <span className="text-slate-400 text-xs">·</span>
                  <Badge
                    variant="outline"
                    className={
                      previewNews.is_active
                        ? 'text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50 font-semibold'
                        : 'text-[10px] border-slate-200 text-slate-600 bg-white font-semibold'
                    }
                  >
                    {previewNews.is_active ? 'Sedang Tayang' : 'Nonaktif'}
                  </Badge>
                </div>

                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-1.5 text-left">
                  {previewNews.judul}
                </DialogTitle>

                {previewNews.tanggal_mulai && (
                  <DialogDescription className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 text-left">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {new Date(previewNews.tanggal_mulai).toLocaleDateString('id-ID', {
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
                {previewNews.gambar_url && (
                  <div
                    className={
                      'group/img relative w-full rounded-2xl overflow-hidden bg-slate-950/5 border border-slate-200 flex items-center justify-center p-2 shrink-0 transition-all ' +
                      (previewNews.isi_teks?.trim()
                        ? 'max-h-[280px] sm:max-h-[340px]'
                        : 'max-h-[68vh] sm:max-h-[540px]')
                    }
                  >
                    <img
                      src={previewNews.gambar_url}
                      alt={previewNews.judul}
                      className={
                        'w-auto max-w-full object-contain rounded-xl drop-shadow-xs transition-transform duration-300 ' +
                        (previewNews.isi_teks?.trim()
                          ? 'max-h-[260px] sm:max-h-[320px]'
                          : 'max-h-[64vh] sm:max-h-[520px]')
                      }
                    />
                    <a
                      href={previewNews.gambar_url}
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

                {previewNews.isi_teks?.trim() && (
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {previewNews.isi_teks}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Modal */}
              <DialogFooter className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/70 shrink-0 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setPreviewDialogOpen(false)}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-9 px-4 font-medium shadow-xs"
                >
                  Tutup Pratinjau
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Hapus Pengumuman?
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 my-2">
            Pengumuman <strong className="text-slate-900 font-semibold">{deletingNews?.judul}</strong> akan dihapus secara permanen dari portal SmartJabar.
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs h-9 rounded-xl shadow-xs"
            >
              Hapus Pengumuman
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
