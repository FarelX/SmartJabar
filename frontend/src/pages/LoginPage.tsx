import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/auth-context'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Shield, ArrowRight, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  // Jika sudah login, redirect ke dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSSOLogin = () => {
    // Nanti: window.location.href = buildSSOLoginURL()
    // Mock: langsung login
    login()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
      {/* Decorative background orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Container */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Panel Kiri — Login Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Logo & Header */}
          <div className="flex items-center gap-3.5 mb-8">
            <img
              src="/logo-smart-jabar.webp"
              alt="SMART JABAR"
              className="h-14 w-14 rounded-xl ring-1 ring-white/10 shadow-lg shadow-primary-500/10"
            />
            <div>
              <h1 className="text-white font-bold text-2xl tracking-tight">
                SMART <span className="text-gradient">JABAR</span>
              </h1>
              <p className="text-white/40 text-xs mt-0.5">
                Portal Administrasi Pemerintahan
              </p>
            </div>
          </div>

          {/* Welcome heading */}
         

          {/* SSO Action Box */}
          <GlassCard strong className="p-6 sm:p-7 mb-6">
             <div className="mb-6">
            <h2 className="text-white text-xl font-semibold mb-2">
              Selamat Datang
            </h2>
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
              Masuk menggunakan akun SSO Jawa Barat untuk mengakses seluruh layanan administrasi pemerintahan.
            </p>
          </div>
            <Button
              onClick={handleSSOLogin}
              className="w-full h-12 bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 group"
            >
              <Shield className="mr-2.5 h-4 w-4 sm:h-5 sm:w-5" />
              Masuk dengan SSO
              <ArrowRight className="ml-2.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-white/40 text-xs text-center leading-relaxed">
                Autentikasi aman melalui Single Sign-On
                <br />
                Dinas Komunikasi dan Informatika Jawa Barat
              </p>
            </div>
          </GlassCard>

          {/* Help link & Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <a
              href="https://sso.jabarprov.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Lupa akun? Hubungi admin SSO Jabar
            </a>
            <span className="text-white/20 text-[11px]">
              © 2026 Pemprov Jawa Barat
            </span>
          </div>
        </div>

        {/* Panel Kanan — Info/Branding Card (5 cols) */}
        <div className="lg:col-span-5 hidden lg:block">
          <GlassCard strong className="p-7 relative overflow-hidden">
            {/* Subtle glow inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
              <span className="text-gradient-warm">Satu Login</span> untuk
              <br />semua Layanan
            </h3>
            <p className="text-white/70 text-xs font-medium mb-4">
              Administrasi Pemerintahan Jawa Barat
            </p>
            <p className="text-white/40 text-xs leading-relaxed mb-6">
              Web portal dengan satu akses login yang menghubungkan berbagai
              Layanan Administrasi Pemerintahan dan dapat diakses oleh seluruh
              Aparatur Sipil Negara (ASN) Pemerintah Provinsi Jawa Barat.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {['JABAR SMART ASN', 'SIDEBAR', 'DASHBOARD JABAR', 'SINGAKOTA', 'SATU DATA JABAR'].map((name) => (
                <span
                  key={name}
                  className="px-2.5 py-1 rounded-md text-[10px] font-medium text-white/50 bg-white/5 border border-white/5"
                >
                  {name}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
