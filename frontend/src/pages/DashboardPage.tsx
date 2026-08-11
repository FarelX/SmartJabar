import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { GlassCard } from '@/components/shared/GlassCard'
import { SearchBar } from '@/components/search/SearchBar'
import { CategoryFilter } from '@/components/search/CategoryFilter'
import { QuickAccessCard } from '@/components/services/QuickAccessCard'
import { ServiceCard } from '@/components/services/ServiceCard'
import { NewsPopup } from '@/components/news/NewsPopup'
import { mockServices, getTopServices } from '@/lib/mock/services'
import { mockCategories } from '@/lib/mock/categories'
import { mockNews, getActiveNews } from '@/lib/mock/news'
import { TrendingUp, LayoutGrid } from 'lucide-react'
import type { Service } from '@/types'

export function DashboardPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  // Quick access — top 3 layanan
  const topServices = useMemo(() => getTopServices(mockServices, 3), [])

  // Active news for popup
  const activeNews = useMemo(() => getActiveNews(mockNews), [])

  // Filtered services
  const filteredServices = useMemo(() => {
    let result = mockServices.filter(s => s.is_active)

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        s =>
          s.nama.toLowerCase().includes(query) ||
          s.deskripsi.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(s => selectedCategories.includes(s.category_id))
    }

    return result
  }, [searchQuery, selectedCategories])

  // Handle service click — log usage & open URL
  const handleServiceClick = (service: Service) => {
    // Nanti: POST ke /api/service-usage-logs
    console.log(`[Usage Log] Service clicked: ${service.nama}`)
    window.open(service.url_tujuan, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* News Popup */}
      <NewsPopup news={activeNews} />

      {/* Welcome Section */}
      <section>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Selamat datang, <span className="text-gradient">{user?.nama.split(',')[0]}</span>
            </h1>
            <p className="text-white/40 text-sm">
              {user?.jabatan} · {user?.opd}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access — Top 3 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="text-white font-semibold text-lg">Layanan Terpopuler</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topServices.map((service, index) => (
            <QuickAccessCard
              key={service.id}
              service={service}
              rank={index + 1}
              onServiceClick={handleServiceClick}
            />
          ))}
        </div>
      </section>

      {/* Search & Filter */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="h-5 w-5 text-primary-400" />
          <h2 className="text-white font-semibold text-lg">Semua Layanan</h2>
        </div>

        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari layanan berdasarkan nama atau deskripsi..."
          />
          <CategoryFilter
            categories={mockCategories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
      </section>

      {/* Services Grid */}
      <section>
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onServiceClick={handleServiceClick}
                onEdit={(s) => console.log('Edit:', s.nama)}
                onDelete={(s) => console.log('Delete:', s.nama)}
              />
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center">
            <p className="text-white/40 text-sm">
              Tidak ada layanan yang sesuai dengan pencarian Anda.
            </p>
          </GlassCard>
        )}
      </section>
    </div>
  )
}
