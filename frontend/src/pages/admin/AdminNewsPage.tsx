import { useState } from 'react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { mockNews } from '@/lib/mock/news'
import type { News, NewsFormData } from '@/types'

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
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingNews) {
      setNewsList(prev => prev.filter(n => n.id !== deletingNews.id))
      setDeleteDialogOpen(false)
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Berita</h1>
          <p className="text-white/40 text-sm">{newsList.length} berita terdaftar</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Berita
        </Button>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">Judul</TableHead>
              <TableHead className="text-white/50 hidden md:table-cell">Mulai</TableHead>
              <TableHead className="text-white/50 hidden md:table-cell">Selesai</TableHead>
              <TableHead className="text-white/50">Status</TableHead>
              <TableHead className="text-white/50 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsList.map(news => (
              <TableRow key={news.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white font-medium max-w-[200px] truncate">
                  {news.judul}
                </TableCell>
                <TableCell className="text-white/40 text-xs hidden md:table-cell">
                  {formatDate(news.tanggal_mulai)}
                </TableCell>
                <TableCell className="text-white/40 text-xs hidden md:table-cell">
                  {formatDate(news.tanggal_selesai)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      news.is_active
                        ? 'text-[10px] border-teal-500/50 text-teal-400 bg-teal-500/10'
                        : 'text-[10px] border-red-500/50 text-red-400 bg-red-500/10'
                    }
                  >
                    {news.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/40 hover:text-primary-400 hover:bg-primary-500/10"
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
                      className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                      onClick={() => openEdit(news)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
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
      </GlassCard>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong border-white/10 bg-primary-950/95 backdrop-blur-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/70">Judul</Label>
              <Input
                value={form.judul}
                onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Judul berita..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Isi Teks</Label>
              <Textarea
                value={form.isi_teks}
                onChange={e => setForm(f => ({ ...f, isi_teks: e.target.value }))}
                className="bg-white/5 border-white/10 text-white min-h-[120px]"
                placeholder="Isi berita..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">URL Gambar (opsional)</Label>
              <Input
                value={form.gambar_url}
                onChange={e => setForm(f => ({ ...f, gambar_url: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={form.tanggal_mulai}
                  onChange={e => setForm(f => ({ ...f, tanggal_mulai: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Tanggal Selesai</Label>
                <Input
                  type="date"
                  value={form.tanggal_selesai}
                  onChange={e => setForm(f => ({ ...f, tanggal_selesai: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={checked => setForm(f => ({ ...f, is_active: checked }))}
              />
              <Label className="text-white/70">Berita Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.judul || !form.isi_teks}
              className="bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white"
            >
              {editingNews ? 'Simpan Perubahan' : 'Tambah Berita'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="glass-strong border-white/10 bg-primary-950/95 backdrop-blur-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Pratinjau Berita</DialogTitle>
          </DialogHeader>
          {previewNews && (
            <div className="py-4">
              {previewNews.gambar_url && (
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-white/5">
                  <img
                    src={previewNews.gambar_url}
                    alt={previewNews.judul}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-white font-semibold text-lg mb-3">{previewNews.judul}</h3>
              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
                {previewNews.isi_teks}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-strong border-white/10 bg-primary-950/95 backdrop-blur-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Hapus Berita?</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm">
            Berita <strong className="text-white">{deletingNews?.judul}</strong> akan dihapus secara permanen.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
