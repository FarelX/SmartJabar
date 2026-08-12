import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { mockCategories } from '@/lib/mock/categories'
import type { ServiceCategory } from '@/types'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>(mockCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<ServiceCategory | null>(null)
  const [formNama, setFormNama] = useState('')

  const openCreate = () => {
    setEditingCategory(null)
    setFormNama('')
    setDialogOpen(true)
  }

  const openEdit = (cat: ServiceCategory) => {
    setEditingCategory(cat)
    setFormNama(cat.nama)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingCategory) {
      setCategories(prev =>
        prev.map(c => (c.id === editingCategory.id ? { ...c, nama: formNama.trim() } : c))
      )
      toast.success(`Kategori "${formNama.trim()}" berhasil diperbarui!`)
    } else {
      const newCat: ServiceCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        nama: formNama.trim(),
      }
      setCategories(prev => [...prev, newCat])
      toast.success(`Kategori baru "${newCat.nama}" berhasil ditambahkan!`)
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingCategory) {
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id))
      setDeleteDialogOpen(false)
      toast.success(`Kategori "${deletingCategory.nama}" berhasil dihapus.`)
      setDeletingCategory(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <FadeInView direction="down">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Kategori Layanan</h1>
            <p className="text-slate-500 text-sm">{categories.length} kategori terdaftar</p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>
      </FadeInView>

      {/* Category List */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map(cat => (
          <StaggerItem key={cat.id}>
            <div className="p-4 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-primary-300 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 flex items-center justify-center shrink-0">
                  <Tag className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <span className="text-slate-800 font-semibold text-sm block">{cat.nama}</span>
                  <span className="text-slate-400 text-[11px]">ID: #{cat.id}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  title="Edit Kategori"
                  className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-primary-50 shadow-2xs"
                  onClick={() => openEdit(cat)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Hapus Kategori"
                  className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-2xs"
                  onClick={() => {
                    setDeletingCategory(cat)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Create/Edit Dialog (shadcn/ui) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kategori digunakan untuk mengelompokkan layanan pada portal SmartJabar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-2">
            <Label className="text-slate-700 text-xs font-semibold">Nama Kategori</Label>
            <Input
              value={formNama}
              onChange={e => setFormNama(e.target.value)}
              placeholder="Contoh: Kepegawaian, Keuangan, dsb..."
              autoFocus
            />
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
              disabled={!formNama.trim()}
              className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
            >
              {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog (shadcn/ui) */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Hapus Kategori?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 pt-2 leading-relaxed">
              Kategori <strong className="text-slate-800">{deletingCategory?.nama}</strong> akan dihapus. Layanan dengan kategori ini akan disesuaikan.
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
              Hapus Kategori
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

