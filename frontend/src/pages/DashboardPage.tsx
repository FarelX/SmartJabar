import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { QuickAccessCard } from '@/components/services/QuickAccessCard'
import { ServiceCard } from '@/components/services/ServiceCard'
import { ServiceListItem } from '@/components/services/ServiceListItem'
import { NewsPopup } from '@/components/news/NewsPopup'
import { GreetingHeader } from '@/components/dashboard/GreetingHeader'
import { FadeInView } from '@/components/motion'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { mockServices, getTopServices } from '@/lib/mock/services'
import { mockCategories } from '@/lib/mock/categories'
import { getStoredNews, getActiveNews } from '@/lib/mock/news'
import { LayoutGrid, List, Layers, Trash2, Search, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Service, ServiceFormData } from '@/types'

const emptyForm: ServiceFormData = {
  nama: '',
  deskripsi: '',
  icon_url: '',
  url_tujuan: '',
  category_id: 1,
  is_active: true,
}

export function DashboardPage() {
  const { user } = useAuth()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = localStorage.getItem('smartjabar_services_view_mode')
      return saved === 'list' ? 'list' : 'grid'
    } catch {
      return 'grid'
    }
  })

  const handleSetViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    try {
      localStorage.setItem('smartjabar_services_view_mode', mode)
    } catch {}
  }

  // State dialog Edit / Delete
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceFormData>(emptyForm)

  // Quick access — top 3 layanan berdasarkan usage_count
  const topServices = useMemo(() => getTopServices(services, 3), [services])

  // Active news for popup
  const activeNews = useMemo(() => getActiveNews(getStoredNews()), [])

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== null

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
  }

  // Filtered services — Layanan favorit disematkan di paling atas daftar layanan
  const filteredServices = useMemo(() => {
    let result = services.filter(s => s.is_active)

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        s =>
          s.nama.toLowerCase().includes(query) ||
          s.deskripsi.toLowerCase().includes(query)
      )
    }

    // Category filter (Single select)
    if (selectedCategory !== null) {
      result = result.filter(s => s.category_id === selectedCategory)
    }

    // Sorting: Layanan favorit selalu diposisikan di paling atas
    return [...result].sort((a, b) => {
      const aFav = favorites.includes(a.id)
      const bFav = favorites.includes(b.id)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      if (aFav && bFav) {
        return favorites.indexOf(a.id) - favorites.indexOf(b.id)
      }
      return 0
    })
  }, [services, searchQuery, selectedCategory, favorites])

  // Handle service click — log usage & open URL
  const handleServiceClick = (service: Service) => {
    // Nanti: POST ke /api/service-usage-logs
    console.log(`[Usage Log] Service clicked: ${service.nama}`)
    window.open(service.url_tujuan, '_blank', 'noopener,noreferrer')
  }

  // Handle Open Edit Modal
  const handleOpenEdit = (service: Service) => {
    setActiveService(service)
    setForm({
      nama: service.nama,
      deskripsi: service.deskripsi,
      icon_url: service.icon_url || '',
      url_tujuan: service.url_tujuan,
      category_id: service.category_id,
      is_active: service.is_active,
    })
    setEditDialogOpen(true)
  }

  // Handle Save Edit
  const handleSaveEdit = () => {
    if (!activeService) return
    setServices(prev =>
      prev.map(s =>
        s.id === activeService.id
          ? {
              ...s,
              ...form,
              icon_url: form.icon_url || null,
              category: mockCategories.find(c => c.id === form.category_id),
              updated_at: new Date().toISOString(),
            }
          : s
      )
    )
    setEditDialogOpen(false)
    toast.success(`Layanan "${form.nama}" berhasil diperbarui!`)
    setActiveService(null)
  }

  // Handle Open Delete Modal
  const handleOpenDelete = (service: Service) => {
    setActiveService(service)
    setDeleteDialogOpen(true)
  }

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeService) return
    setServices(prev => prev.filter(s => s.id !== activeService.id))
    setDeleteDialogOpen(false)
    toast.success(`Layanan "${activeService.nama}" berhasil dihapus.`)
    setActiveService(null)
  }

  return (
    <div className="space-y-0">
      {/* News Popup */}
      <NewsPopup news={activeNews} />

      {/* =========================================================================
          HERO SECTION — Full-width with raw Gedung Sate background (No overlay)
          ========================================================================= */}
      <section
        className="relative w-full overflow-hidden text-white pt-16 sm:pt-20 pb-6 sm:pb-8 bg-cover bg-bottom sm:bg-[center_bottom] bg-no-repeat shadow-xs"
        style={{
          backgroundImage: "url('/backgrounds/hero-background.png')",
          backgroundPosition: 'center bottom',
        }}
      >
        {/* Hero Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-2 sm:pb-4 space-y-6 sm:space-y-7">
          {/* Greeting & Identity Banner */}
          <GreetingHeader user={user} />

          {/* Quick Access — Top 3 Layanan Terpopuler */}
          <div>
            <FadeInView direction="down">
              <div className="flex items-center justify-center gap-2 mb-3.5">
                <h2 className="text-white font-bold text-lg drop-shadow-xs">Layanan Terpopuler</h2>
              </div>
            </FadeInView>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 xl:max-w-[75%] mx-auto">
              {topServices.map((service, index) => (
                <FadeInView
                  key={service.id}
                  direction="up"
                  delay={index * 0.08}
                  amount={0.15}
                  margin="0px 0px -30px 0px"
                  className="h-full"
                >
                  <QuickAccessCard
                    service={service}
                    onServiceClick={handleServiceClick}
                  />
                </FadeInView>
              ))}
            </div>
          </div>

          {/* Search & Filter Section (Frosted Glass Style) */}
          <FadeInView direction="down">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-white font-bold text-lg drop-shadow-xs">Semua Layanan</h2>
                <span className="text-xs text-white/80 font-medium">
                  ({filteredServices.length} dari {services.filter(s => s.is_active).length} layanan)
                </span>
              </div>

              {/* Grid vs List View Toggle — frosted glass pill */}
              <div
                className="flex items-center p-1 rounded-xl shadow-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.82)',
                  backdropFilter: 'blur(16px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <button
                  onClick={() => handleSetViewMode('grid')}
                  title="Tampilan Grid Kartu"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    viewMode === 'grid'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Grid</span>
                </button>
                <button
                  onClick={() => handleSetViewMode('list')}
                  title="Tampilan Tabel/List Ramping"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    viewMode === 'list'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">List</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar — Frosted Glass, more solid white */}
            <div
              className="p-3 sm:p-4 rounded-2xl shadow-lg transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Search input */}
                <div className="sm:col-span-8 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari layanan berdasarkan nama atau deskripsi..."
                    className="pl-10 pr-8 bg-white/60 hover:bg-white/80 focus:bg-white border-slate-200/70 focus:border-slate-300 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm h-11 rounded-xl transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      title="Hapus pencarian"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Kategori */}
                <div className="sm:col-span-4">
                  <Select
                    value={selectedCategory !== null ? String(selectedCategory) : 'all'}
                    onValueChange={val => setSelectedCategory(val === 'all' ? null : Number(val))}
                  >
                    <SelectTrigger className="w-full bg-white/60 hover:bg-white/80 focus:bg-white border-slate-200/70 text-slate-700 text-xs sm:text-sm h-11 rounded-xl">
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border border-slate-200 text-slate-800 shadow-2xl rounded-xl">
                      <SelectItem value="all" className="text-slate-700 hover:bg-slate-50 focus:bg-slate-50 cursor-pointer">
                        Semua Kategori
                      </SelectItem>
                      {mockCategories.map(cat => (
                        <SelectItem
                          key={cat.id}
                          value={String(cat.id)}
                          className="text-slate-700 hover:bg-slate-50 focus:bg-slate-50 cursor-pointer"
                        >
                          {cat.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* =========================================================================
          CONTENT SECTION — 19 Solid White Cards Grid & List (Directly touching)
          ========================================================================= */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pb-14 space-y-8">
        <section>
          {filteredServices.length > 0 ? (
            viewMode === 'grid' ? (
              <div
                key={`grid-${selectedCategory !== null ? `cat-${selectedCategory}` : `search-${searchQuery}`}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredServices.map((service, index) => (
                  <FadeInView
                    key={service.id}
                    direction="up"
                    delay={(index % 4) * 0.05}
                    amount={0.12}
                    margin="0px 0px -40px 0px"
                    className="h-full"
                  >
                    <ServiceCard
                      service={service}
                      onServiceClick={handleServiceClick}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                      isFavorite={isFavorite(service.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </FadeInView>
                ))}
              </div>
            ) : (
              <div
                key={`list-${selectedCategory !== null ? `cat-${selectedCategory}` : `search-${searchQuery}`}`}
                className="space-y-2.5"
              >
                {filteredServices.map((service, index) => (
                  <FadeInView
                    key={service.id}
                    direction="up"
                    delay={(index % 8) * 0.04}
                    amount={0.1}
                    margin="0px 0px -40px 0px"
                  >
                    <ServiceListItem
                      service={service}
                      onServiceClick={handleServiceClick}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                      isFavorite={isFavorite(service.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </FadeInView>
                ))}
              </div>
            )
          ) : (
            <FadeInView>
              <div className="p-12 text-center bg-white/70 rounded-2xl border border-slate-200/80 shadow-2xs">
                <Layers className="h-10 w-10 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                <p className="text-slate-600 font-semibold text-sm">Tidak ada layanan yang ditemukan</p>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                  Coba gunakan kata kunci pencarian yang lain atau ubah kategori filter.
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="mt-3 text-xs border-slate-200"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset Filter
                  </Button>
                )}
              </div>
            </FadeInView>
          )}
        </section>
      </div>

      {/* Edit Service Modal (shadcn/ui Dialog) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Edit Layanan
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Perbarui data layanan SmartJabar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Nama Layanan *</Label>
              <Input
                value={form.nama}
                onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                placeholder="Contoh: SIAP Jabar"
                className="h-9.5 rounded-xl border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Deskripsi Layanan</Label>
              <Textarea
                value={form.deskripsi}
                onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                placeholder="Deskripsi singkat mengenai layanan..."
                className="min-h-[80px] resize-none rounded-xl border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">URL Tujuan Layanan *</Label>
              <Input
                value={form.url_tujuan}
                onChange={e => setForm(f => ({ ...f, url_tujuan: e.target.value }))}
                placeholder="https://..."
                className="h-9.5 rounded-xl border-slate-200 text-xs"
              />
            </div>
            <ImageUpload
              value={form.icon_url}
              onChange={url => setForm(f => ({ ...f, icon_url: url }))}
              onRemove={() => setForm(f => ({ ...f, icon_url: '' }))}
              label="Ikon / Logo Layanan"
              aspectRatio="square"
              maxSizeMB={2}
            />
            <div className="space-y-1.5">
              <Label className="text-slate-700 text-xs font-semibold">Kategori Layanan *</Label>
              <Select
                value={String(form.category_id)}
                onValueChange={val => setForm(f => ({ ...f, category_id: Number(val) }))}
              >
                <SelectTrigger className="w-full h-9.5 rounded-xl border-slate-200 text-xs">
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
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-0.5">
                <Label className="text-slate-800 text-xs font-semibold cursor-pointer">
                  Status Layanan Aktif
                </Label>
                <p className="text-slate-500 text-[11px]">
                  Tampilkan layanan di dashboard ASN.
                </p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={checked => setForm(f => ({ ...f, is_active: checked }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!form.nama.trim() || !form.url_tujuan.trim()}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Confirmation Dialog (shadcn/ui) */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-xl rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 shrink-0">
                <Trash2 className="h-5 w-5 text-red-600" />
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
            Layanan <strong className="text-slate-900 font-semibold">{activeService?.nama}</strong> akan dihapus secara permanen dari katalog portal.
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
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs h-9 rounded-xl shadow-xs"
            >
              Hapus Layanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

