import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { SearchBar } from '@/components/search/SearchBar'
import { CategoryFilter } from '@/components/search/CategoryFilter'
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
import { TrendingUp, LayoutGrid, List, Layers, Trash2, Star } from 'lucide-react'
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
    <div className="space-y-8">
      {/* News Popup */}
      <NewsPopup news={activeNews} />

      {/* Greeting Header */}
      <GreetingHeader user={user} />

      {/* Quick Access — Top 3 Layanan Terpopuler */}
      <section>
        <FadeInView direction="down">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h2 className="text-slate-900 font-bold text-lg">Layanan Terpopuler</h2>
          </div>
        </FadeInView>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                rank={index + 1}
                onServiceClick={handleServiceClick}
                isFavorite={isFavorite(service.id)}
                onToggleFavorite={toggleFavorite}
              />
            </FadeInView>
          ))}
        </div>
      </section>

      {/* Search & Filter */}
      <FadeInView direction="down">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary-600" />
              <h2 className="text-slate-900 font-bold text-lg">Semua Layanan</h2>
            </div>
            {favorites.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-300/70 shadow-2xs flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                {favorites.length} Favorit di Atas
              </span>
            )}
          </div>

          {/* Grid vs List View Toggle */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => handleSetViewMode('grid')}
              title="Tampilan Grid Kartu"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-white text-primary-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
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
                  ? 'bg-white text-primary-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">List</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari layanan berdasarkan nama atau deskripsi..."
          />
          <CategoryFilter
            categories={mockCategories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
      </FadeInView>

      {/* Services Grid or List */}
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
                  delay={(index % 8) * 0.03}
                  amount={0.1}
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
          <FadeInView className="glass-card p-12 text-center">
            <Layers className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">
              Tidak ada layanan yang sesuai dengan pencarian Anda.
            </p>
          </FadeInView>
        )}
      </section>

      {/* Edit Service Dialog (shadcn/ui) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-lg bg-white border-slate-200 text-slate-900 shadow-xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Edit Layanan
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Perbarui informasi layanan administrasi di portal SmartJabar.
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
            <ImageUpload
              value={form.icon_url}
              onChange={(url) => setForm(f => ({ ...f, icon_url: url }))}
              onRemove={() => setForm(f => ({ ...f, icon_url: '' }))}
              label="Logo / Ikon Layanan"
              aspectRatio="square"
              maxSizeMB={5}
            />
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
              className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-medium shadow-sm"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Confirmation Dialog (shadcn/ui) */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-md bg-white border-slate-200 text-slate-900 shadow-xl">
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
              Layanan <strong className="text-slate-800">{activeService?.nama}</strong> akan dihapus dari daftar layanan portal.
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
              onClick={handleConfirmDelete}
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

