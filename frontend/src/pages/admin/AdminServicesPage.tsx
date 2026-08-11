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
import { Plus, Pencil, Trash2, Search, ExternalLink } from 'lucide-react'
import { mockServices } from '@/lib/mock/services'
import { mockCategories } from '@/lib/mock/categories'
import type { Service, ServiceFormData } from '@/types'

const emptyForm: ServiceFormData = {
  nama: '',
  deskripsi: '',
  icon_url: '',
  url_tujuan: '',
  category_id: 1,
  is_active: true,
}

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceFormData>(emptyForm)

  const filteredServices = services.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditingService(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditingService(service)
    setForm({
      nama: service.nama,
      deskripsi: service.deskripsi,
      icon_url: service.icon_url || '',
      url_tujuan: service.url_tujuan,
      category_id: service.category_id,
      is_active: service.is_active,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingService) {
      // Edit
      setServices(prev =>
        prev.map(s =>
          s.id === editingService.id
            ? {
                ...s,
                ...form,
                category: mockCategories.find(c => c.id === form.category_id),
                updated_at: new Date().toISOString(),
              }
            : s
        )
      )
    } else {
      // Create
      const newService: Service = {
        id: Math.max(...services.map(s => s.id)) + 1,
        ...form,
        icon_url: form.icon_url || null,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: mockCategories.find(c => c.id === form.category_id),
        usage_count: 0,
      }
      setServices(prev => [...prev, newService])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingService) {
      setServices(prev => prev.filter(s => s.id !== deletingService.id))
      setDeleteDialogOpen(false)
      setDeletingService(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Layanan</h1>
          <p className="text-white/40 text-sm">{services.length} layanan terdaftar</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari layanan..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">Nama</TableHead>
              <TableHead className="text-white/50 hidden md:table-cell">Kategori</TableHead>
              <TableHead className="text-white/50 hidden lg:table-cell">URL</TableHead>
              <TableHead className="text-white/50">Status</TableHead>
              <TableHead className="text-white/50 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map(service => (
              <TableRow key={service.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white font-medium">{service.nama}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="text-[10px] border-white/10 text-white/50">
                    {service.category?.nama}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <a
                    href={service.url_tujuan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 text-xs hover:underline flex items-center gap-1"
                  >
                    {new URL(service.url_tujuan).hostname}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      service.is_active
                        ? 'text-[10px] border-teal-500/50 text-teal-400 bg-teal-500/10'
                        : 'text-[10px] border-red-500/50 text-red-400 bg-red-500/10'
                    }
                  >
                    {service.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                      onClick={() => openEdit(service)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        setDeletingService(service)
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
              {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/70">Nama Layanan</Label>
              <Input
                value={form.nama}
                onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Contoh: JABAR SMART ASN"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                className="bg-white/5 border-white/10 text-white min-h-[80px]"
                placeholder="Deskripsi singkat layanan..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">URL Tujuan</Label>
              <Input
                value={form.url_tujuan}
                onChange={e => setForm(f => ({ ...f, url_tujuan: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Kategori</Label>
              <select
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: Number(e.target.value) }))}
                className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white px-3 text-sm"
              >
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-primary-950 text-white">
                    {cat.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={checked => setForm(f => ({ ...f, is_active: checked }))}
              />
              <Label className="text-white/70">Layanan Aktif</Label>
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
              disabled={!form.nama || !form.url_tujuan}
              className="bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white"
            >
              {editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-strong border-white/10 bg-primary-950/95 backdrop-blur-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Hapus Layanan?</DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm">
            Layanan <strong className="text-white">{deletingService?.nama}</strong> akan dihapus secara permanen.
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
