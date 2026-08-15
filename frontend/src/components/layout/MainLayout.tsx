import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'

export function MainLayout() {
  const location = useLocation()
  const isDashboard = location.pathname === '/'

  return (
    <div className="min-h-screen relative flex flex-col bg-slate-50">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className={cn('flex-1', !isDashboard && 'container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8')}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
