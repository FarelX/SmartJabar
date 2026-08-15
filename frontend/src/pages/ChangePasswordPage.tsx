import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Sparkles,
  Check,
  Info,
} from 'lucide-react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export function ChangePasswordPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Form states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Show/hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Criteria validation checks
  const hasMinLength = newPassword.length >= 8
  const hasUpper = /[A-Z]/.test(newPassword)
  const hasLower = /[a-z]/.test(newPassword)
  const hasNumberOrSymbol = /[\d\W_]/.test(newPassword)
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  // Calculate password strength score (0 to 4)
  const strengthScore = [
    hasMinLength,
    hasUpper && hasLower,
    hasNumberOrSymbol,
    newPassword.length >= 12,
  ].filter(Boolean).length

  const getStrengthLabel = () => {
    if (!newPassword) return { label: 'Belum diisi', color: 'text-slate-400', barColor: 'bg-slate-200' }
    if (strengthScore <= 1) return { label: 'Sangat Lemah', color: 'text-red-600', barColor: 'bg-red-500' }
    if (strengthScore === 2) return { label: 'Cukup', color: 'text-amber-600', barColor: 'bg-amber-500' }
    if (strengthScore === 3) return { label: 'Kuat', color: 'text-teal-600', barColor: 'bg-teal-500' }
    return { label: 'Sangat Kuat', color: 'text-emerald-600', barColor: 'bg-emerald-500' }
  }

  const strength = getStrengthLabel()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!currentPassword.trim()) {
      toast.error('Silakan masukkan kata sandi saat ini')
      return
    }

    if (!newPassword) {
      toast.error('Silakan masukkan kata sandi baru')
      return
    }

    if (!hasMinLength) {
      toast.error('Kata sandi baru minimal harus 8 karakter')
      return
    }

    if (!(hasUpper && hasLower)) {
      toast.error('Kata sandi baru harus memuat kombinasi huruf besar dan huruf kecil')
      return
    }

    if (!hasNumberOrSymbol) {
      toast.error('Kata sandi baru harus memuat angka atau simbol karakter khusus')
      return
    }

    if (newPassword === currentPassword) {
      toast.error('Kata sandi baru tidak boleh sama dengan kata sandi saat ini')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok')
      return
    }

    setIsSubmitting(true)

    // Simulasi panggilan API update password
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      toast.success('Kata sandi Anda berhasil diperbarui!')
    }, 900)
  }

  const handleResetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsSuccess(false)
  }

  const initials = user?.nama
    ? user.nama
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'ASN'

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-9 w-9 p-0 rounded-xl hover:bg-slate-200/60 text-slate-600 transition-colors"
              title="Kembali ke halaman sebelumnya"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Perubahan Kata Sandi
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-[11px] bg-teal-50 text-teal-700 border-teal-200/80 font-semibold gap-1">
                  <ShieldCheck className="h-3 w-3 text-teal-600" />
                  Keamanan Akun
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Perbarui kata sandi secara berkala untuk melindungi akses layanan administrasi Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500">
            <Link to="/" className="hover:text-primary-600 font-medium transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Ubah Password</span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Security Graphic & Guidance Card */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Primary Security Hero Card */}
            <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Bespoke Vector Illustration for Security / Lock */}
              <div className="relative flex items-center justify-center py-3 sm:py-5">
                <div className="relative w-full max-w-[280px] aspect-[4/3] flex items-center justify-center">
                  {/* Outer glowing ripple */}
                  <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-teal-500/10 via-primary-500/10 to-amber-500/5 blur-lg" />
                  
                  {/* Central Security Art */}
                  <svg
                    viewBox="0 0 320 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-md select-none"
                  >
                    {/* Device / Laptop Base */}
                    <rect x="50" y="55" width="220" height="135" rx="14" fill="#0f172a" fillOpacity="0.04" />
                    <rect x="52" y="57" width="216" height="131" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                    
                    {/* Laptop Screen Header */}
                    <path d="M52 69C52 62.3726 57.3726 57 64 57H256C262.627 57 268 62.3726 268 69V75H52V69Z" fill="#f1f5f9" />
                    <circle cx="68" cy="66" r="3.5" fill="#cbd5e1" />
                    <circle cx="78" cy="66" r="3.5" fill="#cbd5e1" />
                    <circle cx="88" cy="66" r="3.5" fill="#cbd5e1" />

                    {/* Content Wireframe Lines */}
                    <rect x="72" y="92" width="65" height="7" rx="3.5" fill="#e2e8f0" />
                    <rect x="72" y="106" width="45" height="5" rx="2.5" fill="#f1f5f9" />
                    <rect x="72" y="125" width="55" height="30" rx="6" fill="#f8fafc" stroke="#e2e8f0" />

                    {/* Shield Backdrop */}
                    <circle cx="195" cy="125" r="46" fill="#0d9488" fillOpacity="0.08" />
                    <circle cx="195" cy="125" r="36" fill="#2563eb" fillOpacity="0.06" />

                    {/* Central Shield / Security Symbol */}
                    <path
                      d="M195 90L224 103V127C224 145.2 211.6 162 195 167C178.4 162 166 145.2 166 127V103L195 90Z"
                      fill="url(#shield-grad)"
                      stroke="#0d9488"
                      strokeWidth="2"
                    />

                    {/* Padlock inside shield */}
                    <rect x="184" y="123" width="22" height="18" rx="4" fill="#ffffff" />
                    <path
                      d="M188 123V117C188 113.134 191.134 110 195 110C198.866 110 202 113.134 202 117V123"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="195" cy="131" r="2.5" fill="#0f766e" />
                    <path d="M195 133.5V136.5" stroke="#0f766e" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Guard ASN Character Silhouette on Left */}
                    <ellipse cx="90" cy="180" rx="35" ry="4" fill="#0f172a" fillOpacity="0.1" />
                    {/* Head */}
                    <circle cx="82" cy="100" r="10" fill="#1e293b" />
                    <path d="M74 98C74 93.58 77.58 90 82 90C86.42 90 90 93.58 90 98H74Z" fill="#0f172a" />
                    {/* Body */}
                    <path d="M73 113C73 110 76 108 82 108C88 108 91 110 91 113L93 140H71L73 113Z" fill="#334155" />
                    {/* Hand holding shield */}
                    <path d="M88 120L102 124" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                    <path d="M74 122L66 136" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                    {/* Character Shield */}
                    <path
                      d="M102 112L118 119V135C118 145 111 154 102 157C93 154 86 145 86 135V119L102 112Z"
                      fill="#10b981"
                      stroke="#059669"
                      strokeWidth="1.5"
                    />
                    <path d="M98 134L101 137L107 131" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Laptop Bottom Bar */}
                    <rect x="36" y="190" width="248" height="7" rx="3.5" fill="#cbd5e1" />
                    <rect x="135" y="190" width="50" height="3" rx="1.5" fill="#94a3b8" />

                    <defs>
                      <linearGradient id="shield-grad" x1="166" y1="90" x2="224" y2="167" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#14b8a6" />
                        <stop offset="1" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Main Guidance Text from Reference */}
              <div className="text-center space-y-1.5 mt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  Keamanan Terjamin
                </div>
                <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
                  Masukkan kata sandi baru untuk keamanan akun Anda.
                </p>
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                  Kata sandi baru akan langsung disinkronkan ke seluruh portal aplikasi terintegrasi SMART JABAR.
                </p>
              </div>

              {/* Logged in User Meta pill */}
              {user && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/60">
                  <Avatar className="h-9 w-9 border border-slate-200 shrink-0">
                    <AvatarImage src={user.foto_url || undefined} alt={user.nama} />
                    <AvatarFallback className="bg-primary-600 text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-900 text-xs font-bold truncate leading-tight">
                      {user.nama}
                    </p>
                    <p className="text-slate-500 text-[11px] truncate leading-tight mt-0.5">
                      NIP: {user.nip} • {user.opd}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Best Practices Tips Card */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                <Info className="h-4 w-4 text-primary-600" />
                <span>Tips Keamanan Kata Sandi</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>Kombinasikan huruf besar, huruf kecil, angka, dan karakter khusus.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>Jangan gunakan informasi pribadi yang mudah ditebak seperti tanggal lahir atau NIP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>Hindari menggunakan kata sandi yang sama dengan akun pribadi lainnya.</span>
                </li>
              </ul>
            </div>
          </m.div>

          {/* RIGHT COLUMN: Change Password Form */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  /* Success State View */
                  <m.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8 px-4 space-y-5"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="text-xl font-bold text-slate-900">
                        Kata Sandi Berhasil Diperbarui!
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Perubahan kata sandi Anda telah berhasil disimpan. Gunakan kata sandi baru saat masuk kembali ke portal SMART JABAR.
                      </p>
                    </div>
                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handleResetForm}
                        className="w-full sm:w-auto rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold"
                      >
                        Ubah Lagi
                      </Button>
                      <Button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/20"
                      >
                        Kembali ke Dashboard
                      </Button>
                    </div>
                  </m.div>
                ) : (
                  /* Password Form View */
                  <form key="change-password-form" onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Header Info */}
                    <div className="pb-3 border-b border-slate-100">
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary-600" />
                        Formulir Perubahan Kata Sandi
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Lengkapi formulir di bawah ini untuk memperbarui kata sandi akun Anda.
                      </p>
                    </div>

                    {/* Field 1: Kata Sandi Saat Ini */}
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Kata Sandi Saat Ini</span>
                        <span className="text-[11px] text-slate-400 font-normal">Wajib diisi</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Masukkan kata sandi saat ini"
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 bg-slate-50/70 border-slate-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title={showCurrentPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Field 2: Kata Sandi Baru */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="new-password" className="text-xs font-bold text-slate-700">
                          Kata Sandi Baru
                        </Label>
                        {newPassword && (
                          <span className={`text-[11px] font-semibold ${strength.color}`}>
                            Kekuatan: {strength.label}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="h-4 w-4" />
                        </div>
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="masukan Kata sandi baru anda"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 bg-slate-50/70 border-slate-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title={showNewPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password Strength Progress Bars */}
                      {newPassword.length > 0 && (
                        <div className="pt-1 space-y-1">
                          <div className="grid grid-cols-4 gap-1.5 h-1.5">
                            <div className={`rounded-full transition-all duration-300 ${strengthScore >= 1 ? strength.barColor : 'bg-slate-200'}`} />
                            <div className={`rounded-full transition-all duration-300 ${strengthScore >= 2 ? strength.barColor : 'bg-slate-200'}`} />
                            <div className={`rounded-full transition-all duration-300 ${strengthScore >= 3 ? strength.barColor : 'bg-slate-200'}`} />
                            <div className={`rounded-full transition-all duration-300 ${strengthScore >= 4 ? strength.barColor : 'bg-slate-200'}`} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Field 3: Konfirmasi Kata Sandi Baru */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="confirm-password" className="text-xs font-bold text-slate-700">
                          Konfirmasi Kata Sandi Baru
                        </Label>
                        {confirmPassword.length > 0 && (
                          <span className={`text-[11px] font-semibold flex items-center gap-1 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                            {passwordsMatch ? (
                              <>
                                <Check className="h-3 w-3" />
                                Cocok
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Belum Cocok
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="konfirmasi kata sandi baru anda"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className={`pl-10 pr-10 h-11 bg-slate-50/70 border-slate-200 focus:bg-white rounded-xl text-sm font-medium transition-all ${
                            confirmPassword && !passwordsMatch ? 'border-red-300 focus:ring-red-200' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Criteria Checklist */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Kriteria Kata Sandi Baru
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          {hasMinLength ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 shrink-0">1</span>
                          )}
                          <span>Minimal 8 karakter</span>
                        </div>

                        <div className={`flex items-center gap-2 ${hasUpper && hasLower ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          {hasUpper && hasLower ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 shrink-0">2</span>
                          )}
                          <span>Huruf besar & kecil</span>
                        </div>

                        <div className={`flex items-center gap-2 ${hasNumberOrSymbol ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          {hasNumberOrSymbol ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 shrink-0">3</span>
                          )}
                          <span>Angka atau simbol</span>
                        </div>

                        <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                          {passwordsMatch ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 shrink-0">4</span>
                          )}
                          <span>Konfirmasi kata sandi cocok</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Matching the Reference (Kembali & Simpan Perubahan) */}
                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="h-11 px-5 rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all"
                      >
                        Kembali
                      </Button>

                      <Button
                        type="submit"
                        disabled={isSubmitting || !hasMinLength || !passwordsMatch}
                        className="h-11 px-6 bg-gradient-to-r from-teal-600 via-primary-600 to-primary-700 hover:from-teal-500 hover:to-primary-600 text-white font-bold text-sm rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Menyimpan...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            <span>Simpan Perubahan</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </m.div>

        </div>
      </div>
    </LazyMotion>
  )
}
