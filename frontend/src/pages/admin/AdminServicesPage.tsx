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
import { Plus, Pencil, Trash2, Search, ExternalLink, Layers } from 'lucide-react'
import { toast } from 'sonner'
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
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.deskripsi.toLowerCase().includes(search.toLowerCase())
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
      toast.success(`Layanan "${form.nama}" berhasil diperbarui!`)
    } else {
      const newService: Service = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        ...form,
        icon_url: form.icon_url || null,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: mockCategories.find(c => c.id === form.category_id),
        usage_count: 0,
      }
      setServices(prev => [...prev, newService])
      toast.success(`Layanan baru "${newService.nama}" berhasil ditambahkan!`)
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingService) {
      setServices(prev => prev.filter(s => s.id !== deletingService.id))
      setDeleteDialogOpen(false)
      toast.success(`Layanan "${deletingService.nama}" berhasil dihapus.`)
      setDeletingService(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Layanan</h1>
          <p className="text-slate-500 text-sm">{services.length} layanan terdaftar di sistem</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau deskripsi layanan..."
          className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-xs"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="text-slate-600 font-semibold">Nama Layanan</TableHead>
              <TableHead className="text-slate-600 font-semibold hidden md:table-cell">Kategori</TableHead>
              <TableHead className="text-slate-600 font-semibold hidden lg:table-cell">URL Tujuan</TableHead>
              <TableHead className="text-slate-600 font-semibold">Status</TableHead>
              <TableHead className="text-slate-600 font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map(service => (
              <TableRow key={service.id} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                <TableCell className="text-slate-900 font-medium">
                  <div className="flex items-center gap-2.5">
                    {service.icon_url ? (
                      <img
                        src={service.icon_url}
                        alt={service.nama}
                        className="h-7 w-7 object-contain rounded shrink-0"
                      />
                    ) : (
                      <Layers className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-900">{service.nama}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600 bg-slate-50 font-normal">
                    {service.category?.nama}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <a
                    href={service.url_tujuan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 text-xs hover:underline inline-flex items-center gap-1 font-medium"
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
                        ? 'text-[10px] border-teal-200 text-teal-700 bg-teal-50 font-semibold'
                        : 'text-[10px] border-red-200 text-red-600 bg-red-50 font-semibold'
                    }
                  >
                    {service.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit Layanan"
                      className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-primary-50 shadow-2xs"
                      onClick={() => openEdit(service)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Hapus Layanan"
                      className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-2xs"
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
      </div>

      {/* Create/Edit Dialog (shadcn/ui) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Isi data layanan administrasi yang akan ditampilkan pada portal SmartJabar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Nama Layanan</Label>
              <Input
                value={form.nama}
                onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                placeholder="Contoh: JABAR SMART ASN"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                className="min-h-[85px] resize-none"
                placeholder="Deskripsi singkat layanan..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">URL Tujuan</Label>
              <Input
                value={form.url_tujuan}
                onChange={e => setForm(f => ({ ...f, url_tujuan: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">URL Logo / Ikon (opsional)</Label>
              <Input
                value={form.icon_url}
                onChange={e => setForm(f => ({ ...f, icon_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Kategori</Label>
              <Select
                value={String(form.category_id)}
                onValueChange={(val) => setForm(f => ({ ...f, category_id: Number(val) }))}
              >
                <SelectTrigger className="w-full bg-white border-slate-200">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg">
                  {mockCategories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggle Aktif with shadcn Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="space-y-0.5">
                <Label className="text-slate-800 text-xs font-semibold">Layanan Aktif</Label>
                <p className="text-slate-400 text-[11px]">Tampilkan layanan di portal publik</p>
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
              disabled={!form.nama.trim() || !form.url_tujuan.trim()}
              className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
            >
              {editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog (shadcn/ui) */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Hapus Layanan?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 pt-2 leading-relaxed">
              Layanan <strong className="text-slate-800">{deletingService?.nama}</strong> akan dihapus secara permanen.
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
              Hapus Layanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

