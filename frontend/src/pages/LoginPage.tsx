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
    <div className="min-h-screen flex">
      {/* Panel Kiri — Login Form */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center px-8 sm:px-12 lg:px-16 relative z-10">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-10">
            <img
              src="/logo-smart-jabar.webp"
              alt="SMART JABAR"
              className="h-14 w-14 rounded-full ring-2 ring-white/10"
            />
            <div>
              <h1 className="text-white font-bold text-2xl">
                SMART <span className="text-gradient">JABAR</span>
              </h1>
              <p className="text-white/40 text-xs">
                Portal Administrasi Pemerintahan
              </p>
            </div>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h2 className="text-white text-xl font-semibold mb-2">
              Selamat Datang
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Masuk menggunakan akun SSO Jawa Barat untuk mengakses seluruh layanan administrasi pemerintahan.
            </p>
          </div>

          {/* SSO Login Button */}
          <GlassCard className="p-6 mb-6">
            <Button
              onClick={handleSSOLogin}
              className="w-full h-12 bg-gradient-to-r from-primary-500 to-teal-600 hover:from-primary-400 hover:to-teal-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 group"
            >
              <Shield className="mr-2 h-5 w-5" />
              Masuk dengan SSO
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-white/30 text-xs text-center mt-4">
              Autentikasi aman melalui Single Sign-On
              <br />
              Dinas Komunikasi dan Informatika Jawa Barat
            </p>
          </GlassCard>

          {/* Info */}
          <div className="space-y-3">
            <a
              href="https://sso.jabarprov.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/30 text-xs hover:text-white/50 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Lupa akun? Hubungi admin SSO Jabar
            </a>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-white/5">
            <p className="text-white/20 text-[10px]">
              © 2026 Dinas Komunikasi dan Informatika Provinsi Jawa Barat
            </p>
          </div>
        </div>
      </div>

      {/* Panel Kanan — Hero/Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-lg px-12">
          <GlassCard strong className="p-10">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
              <span className="text-gradient-warm">Satu Login</span> untuk semua Layanan
            </h2>
            <h3 className="text-xl text-white/70 mb-6 leading-tight">
              Administrasi Pemerintahan Jawa Barat
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Web portal dengan satu akses login yang menghubungkan berbagai
              Layanan Administrasi Pemerintahan dan dapat diakses oleh seluruh
              Aparatur Sipil Negara (ASN) Pemerintah Provinsi Jawa Barat.
            </p>

            {/* Service logos preview */}
            <div className="flex flex-wrap gap-2">
              {['JABAR SMART ASN', 'SIDEBAR', 'DASHBOARD JABAR', 'SINGAKOTA', 'SATU DATA JABAR'].map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-medium text-white/50 bg-white/5 border border-white/5"
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
