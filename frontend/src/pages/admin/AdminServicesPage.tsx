import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Layers,
  Tag,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Copy,
  RotateCcw,
  Globe,
  ArrowRight,
  X,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/motion'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { isValidUrl, isValidImageUrl, sanitizeString } from '@/lib/validation'
import { mockServices } from '@/lib/mock/services'
import { getStoredCategories, saveStoredCategories } from '@/lib/mock/categories'
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Categories State
  const [categories, setCategories] = useState<ServiceCategory[]>(() => getStoredCategories())
  const [categorySearch, setCategorySearch] = useState('')

  // Dialogs State
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [serviceDeleteDialogOpen, setServiceDeleteDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState<ServiceFormData>(emptyServiceForm)

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

  // Quick action from category card to services tab filtered by that category
  const handleViewCategoryServices = (categoryId: number) => {
    setCategoryFilter(String(categoryId))
    setSearch('')
    setStatusFilter('all')
    setActiveTab('layanan')
    setSearchParams({}, { replace: true })
  }

  // Summary Metrics
  const activeServicesCount = useMemo(() => services.filter(s => s.is_active).length, [services])
  const inactiveServicesCount = useMemo(() => services.filter(s => !s.is_active).length, [services])

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchSearch =
        !search.trim() ||
        service.nama.toLowerCase().includes(search.toLowerCase()) ||
        service.deskripsi.toLowerCase().includes(search.toLowerCase())

      const matchCategory =
        categoryFilter === 'all' || service.category_id === Number(categoryFilter)

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.is_active) ||
        (statusFilter === 'inactive' && !service.is_active)

      return matchSearch && matchCategory && matchStatus
    })
  }, [services, search, categoryFilter, statusFilter])

  const hasActiveFilters = search.trim() !== '' || categoryFilter !== 'all' || statusFilter !== 'all'

  const handleResetFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setStatusFilter('all')
  }

  // Filtered Categories List
  const filteredCategories = useMemo(() => {
    return categories.filter(c =>
      c.nama.toLowerCase().includes(categorySearch.toLowerCase())
    )
  }, [categories, categorySearch])

  // Helper: Count services in each category
  const getCategoryUsageCount = (categoryId: number) => {
    return services.filter(s => s.category_id === categoryId).length
  }

  // Copy URL to clipboard
  const handleCopyUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url)
    toast.success(`URL ${name} disalin ke clipboard!`)
  }

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
    const cleanNama = sanitizeString(serviceForm.nama)
    const cleanDeskripsi = sanitizeString(serviceForm.deskripsi)
    const cleanUrl = serviceForm.url_tujuan.trim()
    const cleanIconUrl = serviceForm.icon_url ? serviceForm.icon_url.trim() : ''

    if (!cleanNama || !cleanUrl) {
      toast.error('Nama layanan dan URL tujuan wajib diisi.')
      return
    }

    if (!isValidUrl(cleanUrl)) {
      toast.error('Format URL tujuan tidak valid. Gunakan tautan yang diawali http:// atau https://')
      return
    }

    if (cleanIconUrl && !isValidImageUrl(cleanIconUrl)) {
      toast.error('Format URL/path ikon tidak valid.')
      return
    }

    const payload: ServiceFormData = {
      ...serviceForm,
      nama: cleanNama,
      deskripsi: cleanDeskripsi,
      url_tujuan: cleanUrl,
      icon_url: cleanIconUrl || null,
    }

    if (editingService) {
      setServices(prev =>
        prev.map(s =>
          s.id === editingService.id
            ? {
                ...s,
                ...payload,
                category: categories.find(c => c.id === payload.category_id),
                updated_at: new Date().toISOString(),
              }
            : s
        )
      )
      toast.success(`Layanan "${cleanNama}" berhasil diperbarui!`)
    } else {
      const newService: Service = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        ...payload,
        icon_url: cleanIconUrl || null,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: categories.find(c => c.id === payload.category_id),
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
    const cleanCategoryNama = sanitizeString(formCategoryNama)
    if (!cleanCategoryNama) {
      toast.error('Nama kategori tidak boleh kosong.')
      return
    }

    if (editingCategory) {
      const updated = categories.map(c =>
        c.id === editingCategory.id ? { ...c, nama: cleanCategoryNama } : c
      )
      setCategories(updated)
      saveStoredCategories(updated)
      // Update joined category name in services list
      setServices(prev =>
        prev.map(s =>
          s.category_id === editingCategory.id
            ? { ...s, category: { id: s.category_id, nama: cleanCategoryNama } }
            : s
        )
      )
      toast.success(`Kategori "${cleanCategoryNama}" berhasil diperbarui!`)
    } else {
      const newCat: ServiceCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        nama: cleanCategoryNama,
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

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <FadeInView direction="down">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-100/80">
                Administrasi Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Kelola Layanan
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Atur katalog layanan publik, tautan eksternal, dan pengelompokan kategori SmartJabar.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {activeTab === 'layanan' ? (
              <Button
                onClick={openCreateService}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm transition-all text-xs sm:text-sm h-9 sm:h-10 px-4"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Layanan
              </Button>
            ) : (
              <Button
                onClick={openCreateCategory}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm transition-all text-xs sm:text-sm h-9 sm:h-10 px-4"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Kategori
              </Button>
            )}
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
                  Total Layanan
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {services.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-2xs">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-emerald-600 uppercase tracking-wider">
                  Layanan Aktif
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {activeServicesCount}
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
                  Nonaktif / Draft
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {inactiveServicesCount}
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
                  Kategori
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {categories.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                <Tag className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeInView>

      {/* Tabs Navigation */}
      <FadeInView delay={0.1}>
        <Tabs
          value={activeTab}
          onValueChange={(val) => handleTabChange(val as 'layanan' | 'kategori')}
          className="w-full space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <TabsList className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 h-11 w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
              <TabsTrigger
                value="layanan"
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-xs transition-all"
              >
                <Layers className="h-4 w-4" />
                <span>Daftar Layanan</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-slate-200/70 text-slate-700 font-semibold"
                >
                  {services.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="kategori"
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-xs transition-all"
              >
                <Tag className="h-4 w-4" />
                <span>Kategori Layanan</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-slate-200/70 text-slate-700 font-semibold"
                >
                  {categories.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Quick Helper indicator */}
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              {activeTab === 'layanan'
                ? `Menampilkan ${filteredServices.length} dari ${services.length} layanan`
                : `${categories.length} kategori terdaftar`}
            </span>
          </div>

          {/* TAB 1: DAFTAR LAYANAN */}
          {activeTab === 'layanan' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Search input */}
                  <div className="sm:col-span-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Cari layanan berdasarkan nama atau deskripsi..."
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

                  {/* Filter Kategori */}
                  <div className="sm:col-span-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full bg-slate-50/70 focus:bg-white border-slate-200 text-xs sm:text-sm h-9.5 rounded-xl">
                        <SelectValue placeholder="Semua Kategori" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg">
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter Status */}
                  <div className="sm:col-span-3">
                    <Select
                      value={statusFilter}
                      onValueChange={(val: 'all' | 'active' | 'inactive') => setStatusFilter(val)}
                    >
                      <SelectTrigger className="w-full bg-slate-50/70 focus:bg-white border-slate-200 text-xs sm:text-sm h-9.5 rounded-xl">
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg">
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Status: Aktif</SelectItem>
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
                      {categoryFilter !== 'all' && (
                        <Badge variant="outline" className="text-[10px] bg-slate-50 font-normal">
                          Kategori: {categories.find(c => String(c.id) === categoryFilter)?.nama}
                        </Badge>
                      )}
                      {statusFilter !== 'all' && (
                        <Badge variant="outline" className="text-[10px] bg-slate-50 font-normal">
                          Status: {statusFilter === 'active' ? 'Aktif' : 'Nonaktif'}
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

              {/* Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
                        <TableHead className="w-[38%] text-slate-600 font-semibold text-xs py-3.5">
                          Layanan
                        </TableHead>
                        <TableHead className="w-[20%] text-slate-600 font-semibold text-xs hidden md:table-cell">
                          Kategori
                        </TableHead>
                        <TableHead className="w-[22%] text-slate-600 font-semibold text-xs hidden lg:table-cell">
                          Tautan Tujuan
                        </TableHead>
                        <TableHead className="w-[10%] text-slate-600 font-semibold text-xs">
                          Status
                        </TableHead>
                        <TableHead className="w-[10%] text-slate-600 font-semibold text-xs text-right pr-4">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                          <TableRow
                            key={service.id}
                            className="border-slate-100/80 hover:bg-slate-50/70 transition-colors group"
                          >
                            {/* Service Details */}
                            <TableCell className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                                  {service.icon_url ? (
                                    <img
                                      src={service.icon_url}
                                      alt={service.nama}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <Globe className="h-5 w-5 text-slate-400" />
                                  )}
                                </div>
                                <div className="min-w-0 max-w-sm sm:max-w-md">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate block">
                                      {service.nama}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                    {service.deskripsi || 'Tidak ada deskripsi'}
                                  </p>
                                  {/* Mobile category badge */}
                                  <div className="md:hidden mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] px-1.5 py-0 border-slate-200 text-slate-600 bg-slate-50 font-normal"
                                    >
                                      {service.category?.nama || 'Lainnya'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Category Column */}
                            <TableCell className="hidden md:table-cell py-3">
                              <Badge
                                variant="outline"
                                className="text-xs border-slate-200 text-slate-700 bg-slate-50/80 font-normal py-0.5 px-2.5 rounded-lg"
                              >
                                {service.category?.nama || 'Lainnya'}
                              </Badge>
                            </TableCell>

                            {/* URL Column */}
                            <TableCell className="hidden lg:table-cell py-3">
                              <div className="flex items-center gap-1.5 max-w-[220px]">
                                <a
                                  href={service.url_tujuan}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 text-xs hover:text-primary-700 hover:underline font-medium truncate flex items-center gap-1"
                                  title={service.url_tujuan}
                                >
                                  <span className="truncate">
                                    {(() => {
                                      try {
                                        return new URL(service.url_tujuan).hostname
                                      } catch {
                                        return service.url_tujuan
                                      }
                                    })()}
                                  </span>
                                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                                </a>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Salin URL"
                                  onClick={() => handleCopyUrl(service.url_tujuan, service.nama)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>

                            {/* Status Column */}
                            <TableCell className="py-3">
                              {service.is_active ? (
                                <Badge
                                  variant="outline"
                                  className="text-[11px] border-emerald-200 text-emerald-700 bg-emerald-50/80 font-medium inline-flex items-center gap-1 py-0.5 px-2 rounded-full"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Aktif
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

                            {/* Actions Column */}
                            <TableCell className="text-right py-3 pr-4">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Edit Layanan"
                                  className="h-8 w-8 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                                  onClick={() => openEditService(service)}
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
                                      onClick={() => openEditService(service)}
                                      className="cursor-pointer text-xs"
                                    >
                                      <Pencil className="h-3.5 w-3.5 mr-2" />
                                      Edit Layanan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleCopyUrl(service.url_tujuan, service.nama)}
                                      className="cursor-pointer text-xs"
                                    >
                                      <Copy className="h-3.5 w-3.5 mr-2" />
                                      Salin URL
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => window.open(service.url_tujuan, '_blank')}
                                      className="cursor-pointer text-xs"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 mr-2" />
                                      Kunjungi URL
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setDeletingService(service)
                                        setServiceDeleteDialogOpen(true)
                                      }}
                                      className="cursor-pointer text-xs text-red-600 focus:text-red-700 focus:bg-red-50"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                                      Hapus Layanan
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                              <FolderOpen className="h-9 w-9 stroke-[1.5] text-slate-300" />
                              <p className="text-sm font-medium text-slate-600">
                                Tidak ada layanan yang sesuai
                              </p>
                              <p className="text-xs text-slate-400 max-w-xs">
                                Coba ubah kata kunci pencarian atau sesuaikan filter kategori/status.
                              </p>
                              {hasActiveFilters && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleResetFilters}
                                  className="mt-2 text-xs border-slate-200"
                                >
                                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                  Reset Semua Filter
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
          )}

          {/* TAB 2: KATEGORI LAYANAN */}
          {activeTab === 'kategori' && (
            <div className="space-y-4">
              {/* Category Search & Filter Toolbar */}
              <div className="bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    value={categorySearch}
                    onChange={e => setCategorySearch(e.target.value)}
                    placeholder="Cari kategori..."
                    className="pl-9 bg-slate-50/70 focus:bg-white border-slate-200 text-xs sm:text-sm h-9.5 rounded-xl"
                  />
                  {categorySearch && (
                    <button
                      onClick={() => setCategorySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-500 self-start sm:self-auto">
                  Setiap kategori digunakan untuk mengelompokkan layanan pada portal SmartJabar.
                </p>
              </div>

              {/* Category Cards Grid */}
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredCategories.map(cat => {
                  const count = getCategoryUsageCount(cat.id)
                  return (
                    <StaggerItem key={cat.id}>
                      <Card className="bg-white border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-primary-300 transition-all duration-200 group">
                        <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-primary-600">
                                <Tag className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-slate-900 font-semibold text-sm truncate">
                                  {cat.nama}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] py-0 px-2 bg-slate-100 text-slate-600 font-medium"
                                  >
                                    {count} Layanan
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit Kategori"
                                className="h-8 w-8 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                                onClick={() => openEditCategory(cat)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Hapus Kategori"
                                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                onClick={() => {
                                  setDeletingCategory(cat)
                                  setCategoryDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Quick Link to filter services */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-400">ID #{cat.id}</span>
                            <button
                              onClick={() => handleViewCategoryServices(cat.id)}
                              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1 text-xs hover:underline cursor-pointer"
                            >
                              Lihat Layanan ({count})
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>

              {filteredCategories.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
                  Tidak ada kategori yang cocok dengan "{categorySearch}".
                </div>
              )}
            </div>
          )}
        </Tabs>
      </FadeInView>

      {/* SERVICE: Create/Edit Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kelola informasi layanan yang ditampilkan pada portal administrasi SmartJabar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Nama Layanan */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">
                Nama Layanan <span className="text-red-500">*</span>
              </Label>
              <Input
                value={serviceForm.nama}
                onChange={e => setServiceForm(f => ({ ...f, nama: e.target.value }))}
                placeholder="Contoh: JABAR SMART ASN"
                className="h-9.5 rounded-xl border-slate-200"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">
                Kategori Layanan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={String(serviceForm.category_id)}
                onValueChange={val => setServiceForm(f => ({ ...f, category_id: Number(val) }))}
              >
                <SelectTrigger className="w-full bg-white border-slate-200 h-9.5 rounded-xl text-xs">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)} className="text-xs">
                      {cat.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* URL Tujuan */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">
                URL Tujuan / Tautan Aplikasi <span className="text-red-500">*</span>
              </Label>
              <Input
                value={serviceForm.url_tujuan}
                onChange={e => setServiceForm(f => ({ ...f, url_tujuan: e.target.value }))}
                placeholder="https://layanan.jabarprov.go.id"
                className="h-9.5 rounded-xl border-slate-200"
              />
              <p className="text-[10px] text-slate-400">
                Gunakan format lengkap dengan awalan https://
              </p>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Deskripsi Layanan</Label>
              <Textarea
                value={serviceForm.deskripsi}
                onChange={e => setServiceForm(f => ({ ...f, deskripsi: e.target.value }))}
                className="min-h-[80px] resize-none rounded-xl border-slate-200 text-xs"
                placeholder="Ringkasan fungsi dan manfaat layanan bagi ASN/publik..."
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={serviceForm.icon_url}
              onChange={url => setServiceForm(f => ({ ...f, icon_url: url }))}
              onRemove={() => setServiceForm(f => ({ ...f, icon_url: '' }))}
              label="Logo / Ikon Layanan"
              aspectRatio="square"
              maxSizeMB={5}
            />

            {/* Toggle Aktif */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-0.5">
                <Label className="text-slate-800 text-xs font-semibold cursor-pointer">
                  Status Layanan Aktif
                </Label>
                <p className="text-slate-500 text-[11px]">
                  Jika aktif, layanan akan langsung tampil pada dashboard ASN.
                </p>
              </div>
              <Switch
                checked={serviceForm.is_active}
                onCheckedChange={checked => setServiceForm(f => ({ ...f, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setServiceDialogOpen(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveService}
              disabled={!serviceForm.nama.trim() || !serviceForm.url_tujuan.trim()}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs h-9 rounded-xl shadow-xs"
            >
              {editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SERVICE: Delete Confirmation Dialog */}
      <Dialog open={serviceDeleteDialogOpen} onOpenChange={setServiceDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Hapus Layanan?
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 my-2">
            Layanan <strong className="text-slate-900 font-semibold">{deletingService?.nama}</strong> akan dihapus secara permanen dari katalog portal.
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setServiceDeleteDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs h-9 rounded-xl shadow-xs"
            >
              Hapus Layanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CATEGORY: Create/Edit Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kategori digunakan untuk mengelompokkan katalog layanan di portal SmartJabar.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-2">
            <Label className="text-slate-700 text-xs font-semibold">
              Nama Kategori <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formCategoryNama}
              onChange={e => setFormCategoryNama(e.target.value)}
              placeholder="Contoh: Kepegawaian, Dokumen, Keuangan..."
              className="h-9.5 rounded-xl border-slate-200 text-xs"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={!formCategoryNama.trim()}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs h-9 rounded-xl shadow-xs"
            >
              {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CATEGORY: Delete Dialog */}
      <Dialog open={categoryDeleteDialogOpen} onOpenChange={setCategoryDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Hapus Kategori?
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Konfirmasi penghapusan kategori
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 my-2 space-y-2">
            <p>
              Kategori <strong className="text-slate-900 font-semibold">{deletingCategory?.nama}</strong> akan dihapus dari daftar kategori.
            </p>
            {deletingCategory && getCategoryUsageCount(deletingCategory.id) > 0 && (
              <p className="text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60 font-medium">
                Peringatan: Saat ini ada {getCategoryUsageCount(deletingCategory.id)} layanan yang terhubung dengan kategori ini.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setCategoryDeleteDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs h-9 rounded-xl shadow-xs"
            >
              Hapus Kategori
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
