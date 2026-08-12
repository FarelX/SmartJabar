import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/auth-context'
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
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
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
              className="h-14 w-14 rounded-2xl border border-slate-200/80 shadow-md shadow-primary-500/10"
            />
            <div>
              <h1 className="text-slate-900 font-bold text-2xl tracking-tight">
                SMART <span className="text-gradient font-extrabold">JABAR</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Portal Administrasi Pemerintahan Jawa Barat
              </p>
            </div>
          </div>

          {/* Welcome heading */}
         

          {/* SSO Action Box */}
          <div className="p-6 sm:p-7 mb-6 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl">
             <div className="mb-6">
            <h2 className="text-slate-900 text-2xl font-bold mb-2">
              Selamat Datang
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Masuk menggunakan akun Single Sign-On (SSO) Jawa Barat untuk mengakses seluruh layanan administrasi pemerintahan.
            </p>
          </div>
            <Button
              onClick={handleSSOLogin}
              className="w-full h-12 bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md shadow-primary-500/25 hover:shadow-primary-500/35 transition-all duration-300 group cursor-pointer"
            >
              <Shield className="mr-2.5 h-4 w-4 sm:h-5 sm:w-5" />
              Masuk dengan SSO
              <ArrowRight className="ml-2.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-slate-500 text-xs text-center leading-relaxed font-medium">
                Autentikasi aman melalui Single Sign-On
                <br />
                <span className="text-slate-400">Dinas Komunikasi dan Informatika Provinsi Jawa Barat</span>
              </p>
            </div>
          </div>

          {/* Help link & Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <a
              href="https://sso.jabarprov.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary-600 transition-colors font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Lupa akun? Hubungi admin SSO Jabar
            </a>
            <span className="text-slate-400 text-[11px]">
              © 2026 Pemprov Jawa Barat
            </span>
          </div>
        </div>

        {/* Panel Kanan — Info/Branding Card (5 cols) */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="p-7 relative overflow-hidden bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl">
            {/* Subtle glow inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
              <span className="text-gradient">Satu Login</span> untuk
              <br />semua Layanan
            </h3>
            <p className="text-primary-700 text-xs font-semibold mb-3">
              Administrasi Pemerintahan Jawa Barat
            </p>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Web portal dengan satu akses login yang menghubungkan berbagai
              Layanan Administrasi Pemerintahan dan dapat diakses oleh seluruh
              Aparatur Sipil Negara (ASN) Pemerintah Provinsi Jawa Barat.
            </p>

            <div className="flex flex-wrap gap-2">
              {['JABAR SMART ASN', 'SIDEBAR', 'DASHBOARD JABAR', 'SINGAKOTA', 'SATU DATA JABAR'].map((name) => (
                <span
                  key={name}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200/80 shadow-2xs"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

