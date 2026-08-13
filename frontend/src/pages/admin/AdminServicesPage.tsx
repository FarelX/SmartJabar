import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Layers,
  Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/motion'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { mockServices } from '@/lib/mock/services'
import { getStoredCategories, saveStoredCategories } from '@/lib/mock/categories'
import { cn } from '@/lib/utils'
import type { Service, ServiceCategory, ServiceFormData } from '@/types'

const emptyServiceForm: ServiceFormData = {
  nama: '',
  deskripsi: '',
  icon_url: '',
  url_tujuan: '',
  category_id: 1,
  is_active: true,
}

export function AdminServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'kategori' ? 'kategori' : 'layanan'
  const [activeTab, setActiveTab] = useState<'layanan' | 'kategori'>(initialTab)

  // Services State
  const [services, setServices] = useState<Service[]>(mockServices)
  const [search, setSearch] = useState('')
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [serviceDeleteDialogOpen, setServiceDeleteDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState<ServiceFormData>(emptyServiceForm)

  // Categories State
  const [categories, setCategories] = useState<ServiceCategory[]>(() => getStoredCategories())
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categoryDeleteDialogOpen, setCategoryDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<ServiceCategory | null>(null)
  const [formCategoryNama, setFormCategoryNama] = useState('')

  // Sync category changes
  useEffect(() => {
    const handleCategoryUpdate = () => {
      setCategories(getStoredCategories())
    }
    window.addEventListener('smartjabar_categories_updated', handleCategoryUpdate)
    window.addEventListener('storage', handleCategoryUpdate)
    return () => {
      window.removeEventListener('smartjabar_categories_updated', handleCategoryUpdate)
      window.removeEventListener('storage', handleCategoryUpdate)
    }
  }, [])

  const handleTabChange = (tab: 'layanan' | 'kategori') => {
    setActiveTab(tab)
    if (tab === 'kategori') {
      setSearchParams({ tab: 'kategori' }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  // Filtered Services
  const filteredServices = services.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.deskripsi.toLowerCase().includes(search.toLowerCase())
  )

  // Service CRUD Handlers
  const openCreateService = () => {
    setEditingService(null)
    setServiceForm({
      ...emptyServiceForm,
      category_id: categories[0]?.id || 1,
    })
    setServiceDialogOpen(true)
  }

  const openEditService = (service: Service) => {
    setEditingService(service)
    setServiceForm({
      nama: service.nama,
      deskripsi: service.deskripsi,
      icon_url: service.icon_url || '',
      url_tujuan: service.url_tujuan,
      category_id: service.category_id,
      is_active: service.is_active,
    })
    setServiceDialogOpen(true)
  }

  const handleSaveService = () => {
    if (editingService) {
      setServices(prev =>
        prev.map(s =>
          s.id === editingService.id
            ? {
                ...s,
                ...serviceForm,
                category: categories.find(c => c.id === serviceForm.category_id),
                updated_at: new Date().toISOString(),
              }
            : s
        )
      )
      toast.success(`Layanan "${serviceForm.nama}" berhasil diperbarui!`)
    } else {
      const newService: Service = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        ...serviceForm,
        icon_url: serviceForm.icon_url || null,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: categories.find(c => c.id === serviceForm.category_id),
        usage_count: 0,
      }
      setServices(prev => [...prev, newService])
      toast.success(`Layanan baru "${newService.nama}" berhasil ditambahkan!`)
    }
    setServiceDialogOpen(false)
  }

  const handleDeleteService = () => {
    if (deletingService) {
      setServices(prev => prev.filter(s => s.id !== deletingService.id))
      setServiceDeleteDialogOpen(false)
      toast.success(`Layanan "${deletingService.nama}" berhasil dihapus.`)
      setDeletingService(null)
    }
  }

  // Category CRUD Handlers
  const openCreateCategory = () => {
    setEditingCategory(null)
    setFormCategoryNama('')
    setCategoryDialogOpen(true)
  }

  const openEditCategory = (cat: ServiceCategory) => {
    setEditingCategory(cat)
    setFormCategoryNama(cat.nama)
    setCategoryDialogOpen(true)
  }

  const handleSaveCategory = () => {
    if (editingCategory) {
      const updated = categories.map(c =>
        c.id === editingCategory.id ? { ...c, nama: formCategoryNama.trim() } : c
      )
      setCategories(updated)
      saveStoredCategories(updated)
      // Update joined category name in services list
      setServices(prev =>
        prev.map(s =>
          s.category_id === editingCategory.id
            ? { ...s, category: { id: s.category_id, nama: formCategoryNama.trim() } }
            : s
        )
      )
      toast.success(`Kategori "${formCategoryNama.trim()}" berhasil diperbarui!`)
    } else {
      const newCat: ServiceCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        nama: formCategoryNama.trim(),
      }
      const updated = [...categories, newCat]
      setCategories(updated)
      saveStoredCategories(updated)
      toast.success(`Kategori baru "${newCat.nama}" berhasil ditambahkan!`)
    }
    setCategoryDialogOpen(false)
  }

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      const updated = categories.filter(c => c.id !== deletingCategory.id)
      setCategories(updated)
      saveStoredCategories(updated)
      setCategoryDeleteDialogOpen(false)
      toast.success(`Kategori "${deletingCategory.nama}" berhasil dihapus.`)
      setDeletingCategory(null)
    }
  }

  // Helper count services in each category
  const getCategoryUsageCount = (categoryId: number) => {
    return services.filter(s => s.category_id === categoryId).length
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FadeInView direction="down">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Layanan</h1>
            <p className="text-slate-500 text-sm">
              {services.length} layanan · {categories.length} kategori terdaftar di sistem
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Primary Action Button based on active tab */}
            {activeTab === 'layanan' ? (
              <Button
                onClick={openCreateService}
                className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Layanan
              </Button>
            ) : (
              <Button
                onClick={openCreateCategory}
                className="bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            )}
          </div>
        </div>
      </FadeInView>

      {/* Sub-Tab Navigation Bar */}
      <FadeInView delay={0.05}>
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => handleTabChange('layanan')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                activeTab === 'layanan'
                  ? 'bg-white text-primary-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Layers className="h-4 w-4" />
              <span>Daftar Layanan</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600 ml-0.5">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('kategori')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                activeTab === 'kategori'
                  ? 'bg-white text-primary-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Tag className="h-4 w-4" />
              <span>Kategori Layanan</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600 ml-0.5">
                {categories.length}
              </span>
            </button>
          </div>

          {/* Search Input (Only shown on Layanan tab) */}
          {activeTab === 'layanan' && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau deskripsi..."
                className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-2xs text-xs sm:text-sm h-9"
              />
            </div>
          )}
        </div>
      </FadeInView>

      {/* TAB 1: DAFTAR LAYANAN */}
      {activeTab === 'layanan' && (
        <FadeInView delay={0.1}>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
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
                  {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
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
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 block truncate">{service.nama}</span>
                              <span className="text-[11px] text-slate-400 line-clamp-1 md:hidden">
                                {service.category?.nama}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600 bg-slate-50 font-normal">
                            {service.category?.nama || 'Lainnya'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <a
                            href={service.url_tujuan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 text-xs hover:underline inline-flex items-center gap-1 font-medium max-w-[200px] truncate"
                          >
                            {new URL(service.url_tujuan).hostname}
                            <ExternalLink className="h-3 w-3 shrink-0" />
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
                              onClick={() => openEditService(service)}
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
                                setServiceDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                        Tidak ada layanan yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </FadeInView>
      )}

      {/* TAB 2: KATEGORI LAYANAN */}
      {activeTab === 'kategori' && (
        <FadeInView delay={0.1}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-xs sm:text-sm">
                Kategori digunakan untuk mengelompokkan layanan pada portal SmartJabar.
              </p>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {categories.map(cat => {
                const count = getCategoryUsageCount(cat.id)
                return (
                  <StaggerItem key={cat.id}>
                    <div className="p-4 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-primary-300 transition-all duration-200 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Tag className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-slate-900 font-semibold text-sm block truncate">{cat.nama}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-slate-200 text-slate-500 bg-slate-50 font-medium">
                              {count} Layanan
                            </Badge>
                            <span className="text-slate-400 text-[10px]">ID #{cat.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 shrink-0 ml-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="Edit Kategori"
                          className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-primary-50 shadow-2xs"
                          onClick={() => openEditCategory(cat)}
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
                            setCategoryDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </FadeInView>
      )}

      {/* SERVICE: Create/Edit Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl max-h-[90dvh] overflow-y-auto rounded-2xl">
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
                value={serviceForm.nama}
                onChange={e => setServiceForm(f => ({ ...f, nama: e.target.value }))}
                placeholder="Contoh: JABAR SMART ASN"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Deskripsi</Label>
              <Textarea
                value={serviceForm.deskripsi}
                onChange={e => setServiceForm(f => ({ ...f, deskripsi: e.target.value }))}
                className="min-h-[85px] resize-none"
                placeholder="Deskripsi singkat layanan..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">URL Tujuan</Label>
              <Input
                value={serviceForm.url_tujuan}
                onChange={e => setServiceForm(f => ({ ...f, url_tujuan: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <ImageUpload
              value={serviceForm.icon_url}
              onChange={(url) => setServiceForm(f => ({ ...f, icon_url: url }))}
              onRemove={() => setServiceForm(f => ({ ...f, icon_url: '' }))}
              label="Logo / Ikon Layanan"
              aspectRatio="square"
              maxSizeMB={5}
            />
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Kategori</Label>
              <Select
                value={String(serviceForm.category_id)}
                onValueChange={(val) => setServiceForm(f => ({ ...f, category_id: Number(val) }))}
              >
                <SelectTrigger className="w-full bg-white border-slate-200">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggle Aktif */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-0.5">
                <Label className="text-slate-800 text-xs font-semibold">Layanan Aktif</Label>
                <p className="text-slate-400 text-[11px]">Tampilkan layanan di portal publik</p>
              </div>
              <Switch
                checked={serviceForm.is_active}
                onCheckedChange={(checked) => setServiceForm(f => ({ ...f, is_active: checked }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setServiceDialogOpen(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveService}
              disabled={!serviceForm.nama.trim() || !serviceForm.url_tujuan.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
            >
              {editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SERVICE: Delete Confirmation Dialog */}
      <Dialog open={serviceDeleteDialogOpen} onOpenChange={setServiceDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl">
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
              onClick={() => setServiceDeleteDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Hapus Layanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CATEGORY: Create/Edit Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl">
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
              value={formCategoryNama}
              onChange={e => setFormCategoryNama(e.target.value)}
              placeholder="Contoh: Kepegawaian, Keuangan, dsb..."
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={!formCategoryNama.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
            >
              {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CATEGORY: Delete Dialog */}
      <Dialog open={categoryDeleteDialogOpen} onOpenChange={setCategoryDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl">
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
              onClick={() => setCategoryDeleteDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
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
