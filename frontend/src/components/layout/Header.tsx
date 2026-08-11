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
import { LogOut, Settings, Shield, User, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const { user, isAdmin, logout, toggleMockRole } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  // Inisial nama untuk avatar fallback
  const initials = user.nama
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-50 glass-static border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo-smart-jabar.webp"
              alt="SMART JABAR"
              className="h-9 w-9 rounded-full"
            />
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg leading-tight">
                SMART <span className="text-gradient">JABAR</span>
              </h1>
              <p className="text-white/40 text-[10px] leading-tight">
                Portal Administrasi Pemerintahan
              </p>
            </div>
          </Link>

          {/* Admin nav links */}
          {isAdmin && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/layanan"
                className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                Kelola Layanan
              </Link>
              <Link
                to="/admin/berita"
                className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                Kelola Berita
              </Link>
              <Link
                to="/admin/kategori"
                className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                Kategori
              </Link>
            </nav>
          )}

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 glass-static rounded-full pl-1 pr-3 py-1 hover:bg-white/10 transition-all">
                <Avatar className="h-8 w-8 border border-white/20">
                  <AvatarImage src={user.foto_url || undefined} alt={user.nama} />
                  <AvatarFallback className="bg-primary-600 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-white text-sm font-medium leading-tight truncate max-w-[150px]">
                    {user.nama.split(',')[0]}
                  </p>
                  <p className="text-white/50 text-[10px] leading-tight truncate max-w-[150px]">
                    {user.opd}
                  </p>
                </div>
                <ChevronDown className="h-3 w-3 text-white/50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 glass-strong border-white/10 bg-primary-950/95 backdrop-blur-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-white">{user.nama}</p>
                  <p className="text-xs text-white/50">{user.nip}</p>
                  <p className="text-xs text-white/50">{user.jabatan}</p>
                  <p className="text-xs text-white/50">{user.opd}</p>
                  <Badge variant="outline" className="w-fit mt-1 text-[10px] border-primary-500/50 text-primary-400">
                    {user.role === 'admin' ? 'Administrator' : 'ASN'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {isAdmin && (
                <>
                  <DropdownMenuItem
                    className="text-white/70 hover:text-white focus:text-white focus:bg-white/10 cursor-pointer md:hidden"
                    onClick={() => navigate('/admin/layanan')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Kelola Layanan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 md:hidden" />
                </>
              )}
              {/* Mock role toggle — hapus di production */}
              <DropdownMenuItem
                className="text-white/70 hover:text-white focus:text-white focus:bg-white/10 cursor-pointer"
                onClick={toggleMockRole}
              >
                <Shield className="mr-2 h-4 w-4" />
                <span>Switch Role (Mock: {user.role})</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
