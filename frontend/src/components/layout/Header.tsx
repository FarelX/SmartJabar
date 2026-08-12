import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { LogOut, Settings, Shield, ChevronDown, Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LazyMotion, domAnimation, m } from 'framer-motion'

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard' },
  { path: '/admin/layanan', label: 'Kelola Layanan' },
  { path: '/admin/berita', label: 'Kelola Berita' },
  { path: '/admin/kategori', label: 'Kategori' },
]

export function Header() {
  const { user, isAdmin, logout, toggleMockRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const updatePillPosition = () => {
    const activeIdx = NAV_ITEMS.findIndex(item => item.path === location.pathname)
    if (activeIdx !== -1 && itemRefs.current[activeIdx] && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect()
      const itemRect = itemRefs.current[activeIdx]!.getBoundingClientRect()
      setPillStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        opacity: 1,
      })
    } else {
      setPillStyle(prev => ({ ...prev, opacity: 0 }))
    }
  }

  useEffect(() => {
    updatePillPosition()
    window.addEventListener('resize', updatePillPosition)
    return () => window.removeEventListener('resize', updatePillPosition)
  }, [location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  if (!user) return null

  // Inisial nama untuk avatar fallback
  const initials = user.nama
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">

            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 hover:opacity-85 transition-opacity shrink-0">
              <img
                src="/logo-smart-jabar.webp"
                alt="SMART JABAR"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl shadow-2xs"
              />
              <div className="hidden sm:block">
                <h1 className="text-slate-900 font-bold text-lg leading-tight">
                  SMART <span className="text-gradient font-extrabold">JABAR</span>
                </h1>
                <p className="text-slate-400 text-[10px] leading-tight font-medium">
                  Portal Administrasi Pemerintahan
                </p>
              </div>
            </Link>

            {/* Admin nav links — desktop only (md+) with horizontally-locked sliding pill */}
            {isAdmin && (
              <LazyMotion features={domAnimation} strict>
                <nav
                  ref={navRef}
                  className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1 rounded-xl border border-slate-200/60 backdrop-blur-xs relative"
                >
                  {/* Sliding active pill indicator */}
                  <m.div
                    className="absolute top-1 bottom-1 bg-gradient-to-r from-primary-600 to-teal-600 rounded-lg shadow-sm shadow-primary-500/25 pointer-events-none"
                    animate={{
                      left: pillStyle.left,
                      width: pillStyle.width,
                      opacity: pillStyle.opacity,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />

                  {NAV_ITEMS.map((item, index) => {
                    const active = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        ref={el => { itemRefs.current[index] = el }}
                        to={item.path}
                        className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 z-10 select-none ${
                          active ? 'text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </LazyMotion>
            )}

            {/* Right side: mobile menu button + user profile */}
            <div className="flex items-center gap-2">
              {/* Mobile hamburger — visible only on < md when admin */}
              {isAdmin && (
                <button
                  onClick={() => setMobileMenuOpen(v => !v)}
                  className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              )}

              {/* User Profile Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 sm:gap-2.5 bg-white border border-slate-200/90 shadow-2xs rounded-full pl-1.5 pr-2.5 sm:pr-3.5 py-1 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-slate-200 shrink-0">
                      <AvatarImage src={user.foto_url || undefined} alt={user.nama} />
                      <AvatarFallback className="bg-primary-600 text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-slate-800 text-xs font-semibold leading-tight truncate max-w-[120px] lg:max-w-[150px]">
                        {user.nama.split(',')[0]}
                      </p>
                      <p className="text-slate-400 text-[10px] leading-tight truncate max-w-[120px] lg:max-w-[150px]">
                        {user.opd}
                      </p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-xl text-slate-800">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-900">{user.nama}</p>
                      <p className="text-xs text-slate-500">NIP: {user.nip}</p>
                      <p className="text-xs text-slate-500">{user.jabatan}</p>
                      <p className="text-xs text-slate-500 font-medium">{user.opd}</p>
                      <Badge variant="outline" className="w-fit mt-1 text-[10px] border-primary-200 text-primary-700 bg-primary-50 font-semibold">
                        {user.role === 'admin' ? 'Administrator' : 'ASN'}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem
                        className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer md:hidden"
                        onClick={() => navigate('/admin/layanan')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Kelola Layanan
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100 md:hidden" />
                    </>
                  )}
                  {/* Mock role toggle */}
                  <DropdownMenuItem
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                    onClick={toggleMockRole}
                  >
                    <Shield className="mr-2 h-4 w-4 text-primary-600" />
                    <span>Switch Role (Mock: {user.role})</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer font-medium"
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer — slides in below header on < md */}
      {isAdmin && mobileMenuOpen && (
        <div className="md:hidden sticky top-14 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md">
          <nav className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {NAV_ITEMS.map(item => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
