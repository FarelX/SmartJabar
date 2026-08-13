import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { GridBackgroundLayer } from '@/components/shared/GridBackground'

export function MainLayout() {
  return (
    <div className="min-h-screen relative flex flex-col bg-slate-50">
      {/* Fixed Grid Background Layer across all portal pages */}
      <GridBackgroundLayer fixed showTechAccents={false} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

