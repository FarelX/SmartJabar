import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Lock,
  User,
  Eye,
  EyeOff,
  Send,
  CheckCircle2,
  Building,
  KeyRound,
  RotateCcw,
} from 'lucide-react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export function LoginPage() {
  const { isAuthenticated, login, isLoading } = useAuth()
  const navigate = useNavigate()

  // Mode: 'login' | 'forgot-password'
  const [mode, setMode] = useState<'login' | 'forgot-password'>('login')

  // Login form state
  const [nip, setNip] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Forgot password form state
  const [forgotNip, setForgotNip] = useState('')
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false)
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  // Jika sudah login, redirect ke dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleLoginFormSubmit = (e: FormEvent) => {
    e.preventDefault()

    const cleanNip = nip.trim()
    const cleanPassword = password.trim()

    if (!cleanNip) {
      toast.error('Silakan masukkan NIP Anda')
      return
    }

    if (!/^\d+$/.test(cleanNip)) {
      toast.error('NIP hanya boleh berisi angka (digit)')
      return
    }

    if (cleanNip.length < 8 || cleanNip.length > 20) {
      toast.error('Panjang NIP tidak valid (NIP standar ASN terdiri dari 18 digit)')
      return
    }

    if (!cleanPassword) {
      toast.error('Silakan masukkan kata sandi Anda')
      return
    }

    if (cleanPassword.length < 4) {
      toast.error('Kata sandi minimal 4 karakter')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      login()
      setIsSubmitting(false)
      toast.success('Berhasil masuk ke portal SMART JABAR')
    }, 400)
  }

  const handleForgotFormSubmit = (e: FormEvent) => {
    e.preventDefault()

    const cleanNip = forgotNip.trim()

    if (!cleanNip) {
      toast.error('Silakan masukkan NIP Anda')
      return
    }

    if (!/^\d+$/.test(cleanNip)) {
      toast.error('NIP hanya boleh berisi angka (digit)')
      return
    }

    if (cleanNip.length < 8 || cleanNip.length > 20) {
      toast.error('Panjang NIP tidak valid (NIP standar ASN terdiri dari 18 digit)')
      return
    }

    setIsForgotSubmitting(true)
    setTimeout(() => {
      setIsForgotSubmitting(false)
      setForgotSubmitted(true)
      toast.success('Tautan verifikasi berhasil dikirim ke email dinas')
    }, 600)
  }

  const handleResetForgotState = () => {
    setMode('login')
    setForgotSubmitted(false)
    setForgotNip('')
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen min-h-dvh flex items-center justify-center p-3 sm:p-6 lg:p-10 relative">
        {/* Main Glassmorphic Card Container */}
        <m.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Panel Kiri — Login / Forgot Form (7 cols on lg) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Mobile Hero Header Image (Visible only on mobile/tablet) */}
                <div className="relative lg:hidden -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 h-40 sm:h-48 overflow-hidden rounded-t-3xl">
                  <img
                    src="/backgrounds/gedung-sate-art.jpg"
                    alt="Gedung Sate Bandung"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-xs flex items-center gap-1.5 text-[11px] font-semibold text-slate-800">
                    <Building className="h-3.5 w-3.5 text-primary-600" />
                    <span>Gedung Sate Bandung</span>
                  </div>
                </div>

                {/* Logo & Header */}
                <div className="flex items-center justify-between gap-3 mb-6 sm:mb-7">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo-smart-jabar.webp"
                      alt="SMART JABAR"
                      className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl border border-slate-200/80 shadow-md shadow-primary-500/10 shrink-0 bg-white p-0.5"
                    />
                    <div>
                      <h1 className="text-slate-900 font-extrabold text-xl sm:text-2xl tracking-tight">
                        SMART <span className="text-gradient font-black">JABAR</span>
                      </h1>
                      <p className="text-slate-500 text-xs font-medium leading-tight">
                        Portal Administrasi Pemerintahan Jawa Barat
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200/70 text-teal-800 text-xs font-semibold">
                    <span>Single Sign-On (SSO)</span>
                  </div>
                </div>

                {/* Animate View Switch: Login vs Forgot Password */}
                <AnimatePresence mode="wait">
                  {mode === 'login' ? (
                    <m.div
                      key="login-form"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {/* Form Header */}
                      <div>
                        <h2 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
                          Masuk ke Akun
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                          Masukkan NIP dan kata sandi Anda untuk mengakses seluruh layanan administrasi pemerintahan Jawa Barat.
                        </p>
                      </div>

                      {/* Login Form */}
                      <form onSubmit={handleLoginFormSubmit} className="space-y-4 pt-1">
                        {/* NIP Input */}
                        <div className="space-y-1.5">
                          <Label htmlFor="login-nip" className="text-xs font-bold text-slate-700">
                            NIP (Nomor Induk Pegawai)
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <User className="h-4 w-4" />
                            </div>
                            <Input
                              id="login-nip"
                              type="text"
                              inputMode="numeric"
                              maxLength={18}
                              autoComplete="username"
                              placeholder="Masukkan 18 digit NIP"
                              value={nip}
                              onChange={e => setNip(e.target.value.replace(/\D/g, '').slice(0, 18))}
                              className="pl-10 h-11 bg-slate-50/80 border-slate-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
                            />
                          </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                          <Label htmlFor="login-password" className="text-xs font-bold text-slate-700">
                            Kata Sandi
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Lock className="h-4 w-4" />
                            </div>
                            <Input
                              id="login-password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="current-password"
                              placeholder="Masukkan kata sandi akun"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className="pl-10 pr-10 h-11 bg-slate-50/80 border-slate-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="w-full h-11 sm:h-12 bg-gradient-to-r from-primary-600 via-primary-700 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group cursor-pointer"
                        >
                          {isSubmitting || isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Memverifikasi Akun...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Lock className="h-4 w-4" />
                              Masuk ke Portal
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          )}
                        </Button>
                      </form>

                      {/* Link: Pengguna Baru / Lupa Kata Sandi */}
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setMode('forgot-password')}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline transition-all cursor-pointer"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Pengguna Baru / Lupa Kata Sandi?</span>
                        </button>
                      </div>
                    </m.div>
                  ) : (
                    /* FORGOT PASSWORD / PENGGUNA BARU FORM */
                    <m.div
                      key="forgot-form"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {/* Back Link */}
                      <div>
                        <button
                          type="button"
                          onClick={handleResetForgotState}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer group mb-2"
                        >
                          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                          <span>Kembali ke halaman masuk</span>
                        </button>

                        <h2 className="text-slate-900 text-xl sm:text-2xl font-extrabold tracking-tight">
                          Pengguna Baru / Lupa Kata Sandi
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                          Masukkan NIP dan kami akan mengirimkan ke email resmi Anda langkah-langkah untuk membuat atau mereset kata sandi baru.
                        </p>
                      </div>

                      {/* Success Card or Form */}
                      {forgotSubmitted ? (
                        <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200/90 text-teal-900 space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold">Tautan Verifikasi Terkirim!</h4>
                              <p className="text-xs text-teal-700 mt-0.5">
                                NIP: <span className="font-mono font-bold">{forgotNip}</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-teal-800 leading-relaxed">
                            Petunjuk pembuatan kata sandi baru telah dikirimkan ke alamat email kedinasan (@jabarprov.go.id) yang terdaftar di database BKD Provinsi Jawa Barat.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              onClick={handleResetForgotState}
                              className="h-9 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Kembali ke Halaman Masuk
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setForgotSubmitted(false)}
                              className="h-9 px-3 border-teal-300 text-teal-800 hover:bg-teal-100 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                              Kirim Ulang
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleForgotFormSubmit} className="space-y-4 pt-1">
                          {/* NIP Input */}
                          <div className="space-y-1.5">
                            <Label htmlFor="forgot-nip" className="text-xs font-bold text-slate-700">
                              NIP (Nomor Induk Pegawai)
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User className="h-4 w-4" />
                              </div>
                              <Input
                                id="forgot-nip"
                                type="text"
                                inputMode="numeric"
                                maxLength={18}
                                placeholder="Masukkan 18 digit NIP Anda"
                                value={forgotNip}
                                onChange={e => setForgotNip(e.target.value.replace(/\D/g, '').slice(0, 18))}
                                className="pl-10 h-11 bg-slate-50/80 border-slate-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
                              />
                            </div>
                          </div>

                          {/* Submit / SIMPAN Button */}
                          <Button
                            type="submit"
                            disabled={isForgotSubmitting}
                            className="w-full h-11 sm:h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all duration-200 group cursor-pointer"
                          >
                            {isForgotSubmitting ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Mengirim Tautan...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Send className="h-4 w-4" />
                                SIMPAN
                              </span>
                            )}
                          </Button>

                          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                            Pastikan NIP Anda sudah terdaftar secara aktif pada sistem kepegawaian Pemerintah Provinsi Jawa Barat.
                          </p>
                        </form>
                      )}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Links & Copyright */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <a
                  href="https://sso.jabarprov.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-semibold transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  Bantuan & Layanan Akun SSO
                </a>
                <span className="text-slate-400 text-[11px]">
                  © 2026 Pemerintah Provinsi Jawa Barat
                </span>
              </div>
            </div>

            {/* Panel Kanan — Gedung Sate Visual Hero (5 cols, visible on lg) */}
            <div className="lg:col-span-5 relative hidden lg:block min-h-[560px] bg-slate-900 overflow-hidden">
              {/* Background Gedung Sate Artwork */}
              <img
                src="/backgrounds/gedung-sate-art.jpg"
                alt="Ikon Gedung Sate Jawa Barat"
                className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700 ease-out"
              />

              {/* Smooth Gradient Overlays for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-slate-900/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />

              {/* Decorative Content over Gedung Sate Art */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold shadow-md">
                    <Building className="h-3.5 w-3.5 text-amber-300" />
                    <span>Gedung Sate Bandung</span>
                  </div>

                  <span className="text-[11px] font-mono text-white/80 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    Jawa Barat
                  </span>
                </div>

                {/* Bottom Showcase Card */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      <p className="text-teal-200 text-xs font-bold uppercase tracking-wider">
                        Satu Pintu Layanan Digital
                      </p>
                    </div>
                    <h3 className="text-xl font-extrabold text-white leading-snug">
                      Jabar Juara Lahir Batin
                    </h3>
                    <p className="text-slate-200 text-xs mt-2 leading-relaxed font-normal">
                      Menghubungkan seluruh sistem administrasi pemerintahan, kepegawaian, dan kedinasan
                      untuk melayani masyarakat dengan integritas dan kecepatan.
                    </p>
                  </div>

                  {/* App Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {['JABAR SMART ASN', 'SIDEBAR', 'DASHBOARD JABAR', 'SINGAKOTA', 'SATU DATA'].map(name => (
                      <span
                        key={name}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-md border border-white/15"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </LazyMotion>
  )
}
