import { useState } from 'react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
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
        prev.map(c => (c.id === editingCategory.id ? { ...c, nama: formNama } : c))
      )
    } else {
      const newCat: ServiceCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        nama: formNama,
      }
      setCategories(prev => [...prev, newCat])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingCategory) {
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id))
      setDeleteDialogOpen(false)
      setDeletingCategory(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Kategori</h1>
          <p className="text-white/40 text-sm">{categories.length} kategori layanan</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(cat => (
          <GlassCard key={cat.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-teal-500/20 flex items-center justify-center">
                <Tag className="h-4 w-4 text-primary-400" />
              </div>
              <span className="text-white font-medium text-sm">{cat.nama}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                onClick={() => openEdit(cat)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => {
                  setDeletingCategory(cat)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong border-white/10 bg-primary-950/95 backdrop-blur-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={formNama}
              onChange={e => setFormNama(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Nama kategori..."
              autoFocus
            />
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
              disabled={!formNama.trim()}
              className="bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white"
            >
              {editingCategory ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-strong border-white/10 bg-primary-950/95 backdrop-blur-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Hapus Kategori?</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm">
            Kategori <strong className="text-white">{deletingCategory?.nama}</strong> akan dihapus.
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
