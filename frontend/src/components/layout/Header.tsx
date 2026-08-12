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
import { LogOut, Settings, Shield, ChevronDown } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export function Header() {
  const { user, isAdmin, logout, toggleMockRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  // Inisial nama untuk avatar fallback
  const initials = user.nama
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const isActivePath = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
            <img
              src="/logo-smart-jabar.webp"
              alt="SMART JABAR"
              className="h-9 w-9 rounded-xl shadow-2xs"
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

          {/* Admin nav links */}
          {isAdmin && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActivePath('/')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/layanan"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActivePath('/admin/layanan')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Kelola Layanan
              </Link>
              <Link
                to="/admin/berita"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActivePath('/admin/berita')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Kelola Berita
              </Link>
              <Link
                to="/admin/kategori"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActivePath('/admin/kategori')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Kategori
              </Link>
            </nav>
          )}

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 bg-white border border-slate-200/90 shadow-2xs rounded-full pl-1.5 pr-3.5 py-1 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src={user.foto_url || undefined} alt={user.nama} />
                  <AvatarFallback className="bg-primary-600 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-slate-800 text-xs font-semibold leading-tight truncate max-w-[150px]">
                    {user.nama.split(',')[0]}
                  </p>
                  <p className="text-slate-400 text-[10px] leading-tight truncate max-w-[150px]">
                    {user.opd}
                  </p>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
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
    </header>
  )
}

