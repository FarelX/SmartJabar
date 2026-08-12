import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye, Calendar, Newspaper } from 'lucide-react'
import { DatePicker, ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { mockNews } from '@/lib/mock/news'
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
  const [newsList, setNewsList] = useState<News[]>(mockNews)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [deletingNews, setDeletingNews] = useState<News | null>(null)
  const [previewNews, setPreviewNews] = useState<News | null>(null)
  const [form, setForm] = useState<NewsFormData>(emptyForm)

  const openCreate = () => {
    setEditingNews(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (news: News) => {
    setEditingNews(news)
    setForm({
      judul: news.judul,
      isi_teks: news.isi_teks,
      gambar_url: news.gambar_url || '',
      is_active: news.is_active,
      tanggal_mulai: news.tanggal_mulai || '',
      tanggal_selesai: news.tanggal_selesai || '',
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingNews) {
      setNewsList(prev =>
        prev.map(n =>
          n.id === editingNews.id
            ? {
                ...n,
                ...form,
                gambar_url: form.gambar_url || null,
                tanggal_mulai: form.tanggal_mulai || null,
                tanggal_selesai: form.tanggal_selesai || null,
                updated_at: new Date().toISOString(),
              }
            : n
        )
      )
      toast.success('Berita berhasil diperbarui!')
    } else {
      const newNews: News = {
        id: Math.max(...newsList.map(n => n.id), 0) + 1,
        ...form,
        gambar_url: form.gambar_url || null,
        tanggal_mulai: form.tanggal_mulai || null,
        tanggal_selesai: form.tanggal_selesai || null,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setNewsList(prev => [...prev, newNews])
      toast.success('Berita baru berhasil ditambahkan!')
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingNews) {
      setNewsList(prev => prev.filter(n => n.id !== deletingNews.id))
      setDeleteDialogOpen(false)
      toast.success(`Berita "${deletingNews.judul}" berhasil dihapus.`)
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
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Berita & Pengumuman</h1>
          <p className="text-slate-500 text-sm">{newsList.length} pengumuman terdaftar</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white shadow-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Berita
        </Button>
      </div>

      {/* News Table Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="text-slate-600 font-semibold">Judul Pengumuman</TableHead>
              <TableHead className="text-slate-600 font-semibold hidden md:table-cell">Mulai</TableHead>
              <TableHead className="text-slate-600 font-semibold hidden md:table-cell">Selesai</TableHead>
              <TableHead className="text-slate-600 font-semibold">Status</TableHead>
              <TableHead className="text-slate-600 font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsList.map(news => (
              <TableRow key={news.id} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                <TableCell className="text-slate-900 font-medium max-w-[260px] truncate">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{news.judul}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-xs hidden md:table-cell font-medium">
                  {formatDate(news.tanggal_mulai)}
                </TableCell>
                <TableCell className="text-slate-500 text-xs hidden md:table-cell font-medium">
                  {formatDate(news.tanggal_selesai)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      news.is_active
                        ? 'text-[10px] border-teal-200 text-teal-700 bg-teal-50 font-semibold'
                        : 'text-[10px] border-red-200 text-red-600 bg-red-50 font-semibold'
                    }
                  >
                    {news.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Pratinjau Berita"
                      className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-primary-50 shadow-2xs"
                      onClick={() => {
                        setPreviewNews(news)
                        setPreviewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit Berita"
                      className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-primary-50 shadow-2xs"
                      onClick={() => openEdit(news)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Hapus Berita"
                      className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-2xs"
                      onClick={() => {
                        setDeletingNews(news)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog (Pure shadcn/ui components) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingNews ? 'Edit Berita & Pengumuman' : 'Tambah Berita Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kelola informasi pengumuman pop-up untuk seluruh ASN Jawa Barat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Judul Pengumuman</Label>
              <Input
                value={form.judul}
                onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                placeholder="Contoh: Pemeliharaan Server Portal Smart Jabar"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Isi Teks Pengumuman</Label>
              <Textarea
                value={form.isi_teks}
                onChange={e => setForm(f => ({ ...f, isi_teks: e.target.value }))}
                className="min-h-[110px] resize-none"
                placeholder="Tuliskan isi detail berita atau pengumuman..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">URL Banner / Gambar (opsional)</Label>
              <Input
                value={form.gambar_url}
                onChange={e => setForm(f => ({ ...f, gambar_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            {/* Date range with Ant Design RangePicker */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Periode Tayang
              </Label>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#2563eb',
                    borderRadius: 8,
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
                  className="w-full h-10 rounded-lg border-slate-200 shadow-2xs"
                  allowClear
                />
              </ConfigProvider>
            </div>

            {/* Toggle Aktif with shadcn Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="space-y-0.5">
                <Label className="text-slate-800 text-xs font-semibold">Berita Aktif</Label>
                <p className="text-slate-400 text-[11px]">Tampilkan sebagai pop-up otomatis di beranda portal</p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setForm(f => ({ ...f, is_active: checked }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.judul.trim() || !form.isi_teks.trim()}
              className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
            >
              {editingNews ? 'Simpan Perubahan' : 'Tambah Berita'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog (Pure shadcn/ui) */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
                <Newspaper className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Pratinjau Berita & Pengumuman
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Tampilan pop-up yang akan dilihat oleh pengguna ASN.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {previewNews && (
            <div className="p-5 pt-3 space-y-4">
              {previewNews.gambar_url && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80">
                  <img
                    src={previewNews.gambar_url}
                    alt={previewNews.judul}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge
                    variant="outline"
                    className={
                      previewNews.is_active
                        ? 'text-[10px] border-teal-200 text-teal-700 bg-teal-50'
                        : 'text-[10px] border-red-200 text-red-600 bg-red-50'
                    }
                  >
                    {previewNews.is_active ? 'Sedang Tayang' : 'Nonaktif'}
                  </Badge>
                  {previewNews.tanggal_mulai && (
                    <span className="text-slate-400 text-xs">
                      {formatDate(previewNews.tanggal_mulai)}
                    </span>
                  )}
                </div>
                <h3 className="text-slate-900 font-bold text-base mb-2">
                  {previewNews.judul}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                  {previewNews.isi_teks}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9"
            >
              Tutup Pratinjau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog (Pure shadcn/ui) */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Hapus Berita?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 pt-2 leading-relaxed">
              Pengumuman <strong className="text-slate-800">{deletingNews?.judul}</strong> akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Hapus Berita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

