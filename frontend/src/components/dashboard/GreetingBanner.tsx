import { useState, useEffect } from 'react'
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  BadgeCheck,
} from 'lucide-react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/types'

interface GreetingHeaderProps {
  user: User | null
  totalServices?: number
  favoriteCount?: number
}

interface TimeGreeting {
  greeting: string
  subtext: string
  icon: typeof Sun
  iconColor: string
  badgeBg: string
  badgeText: string
  period: 'pagi' | 'siang' | 'sore' | 'malam'
}

function getTimeGreeting(date: Date): TimeGreeting {
  const hour = date.getHours()

  if (hour >= 4 && hour < 11) {
    return {
      greeting: 'Selamat Pagi',
      subtext: 'Awali hari dengan integritas dan dedikasi terbaik untuk melayani masyarakat Jawa Barat.',
      icon: Sunrise,
      iconColor: 'text-amber-500',
      badgeBg: 'bg-amber-50 border-amber-200/80',
      badgeText: 'text-amber-700',
      period: 'pagi',
    }
  } else if (hour >= 11 && hour < 15) {
    return {
      greeting: 'Selamat Siang',
      subtext: 'Tetap produktif dan semangat dalam mengoptimalkan tata kelola administrasi pemerintahan.',
      icon: Sun,
      iconColor: 'text-yellow-600',
      badgeBg: 'bg-yellow-50 border-yellow-200/80',
      badgeText: 'text-yellow-800',
      period: 'siang',
    }
  } else if (hour >= 15 && hour < 18) {
    return {
      greeting: 'Selamat Sore',
      subtext: 'Pastikan seluruh agenda dan layanan administrasi harian Anda terkoordinasi dengan baik.',
      icon: Sunset,
      iconColor: 'text-orange-500',
      badgeBg: 'bg-orange-50 border-orange-200/80',
      badgeText: 'text-orange-700',
      period: 'sore',
    }
  } else {
    return {
      greeting: 'Selamat Malam',
      subtext: 'Akses seluruh sistem portal SmartJabar tetap aktif dan siap mendukung kebutuhan dinas Anda.',
      icon: Moon,
      iconColor: 'text-indigo-500',
      badgeBg: 'bg-indigo-50 border-indigo-200/80',
      badgeText: 'text-indigo-700',
      period: 'malam',
    }
  }
}

export function GreetingHeader({ user }: GreetingHeaderProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const greetingInfo = getTimeGreeting(currentTime)
  const GreetingIcon = greetingInfo.icon

  const initials = user?.nama
    ? user.nama
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'SJ'

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start sm:items-center gap-4 sm:gap-5 py-1"
      >
        {/* User Avatar with verified badge */}
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border-2 border-white shadow-sm ring-2 ring-primary-100">
            <AvatarImage
              src={user?.foto_url || undefined}
              alt={user?.nama || 'User'}
              className="object-cover rounded-2xl"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary-600 to-teal-600 text-white text-base sm:text-lg font-bold rounded-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white border border-slate-200 text-teal-600 shadow-2xs">
            <BadgeCheck className="h-4 w-4 fill-teal-500 text-white" />
          </div>
        </div>

        {/* Greeting & Identity Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${greetingInfo.badgeBg} ${greetingInfo.badgeText}`}
            >
              <GreetingIcon className={`h-3.5 w-3.5 ${greetingInfo.iconColor}`} />
              <span>{greetingInfo.greeting}</span>
            </div>

            {user?.role === 'admin' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 border border-purple-200 text-purple-700">
                <Sparkles className="h-3 w-3 text-purple-600" />
                Administrator
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 border border-blue-200 text-blue-700">
                ASN Jabar Juara
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 flex-wrap">
            <span>{user?.nama || 'Aparatur Sipil Negara'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2 flex-wrap">
            <span>{user?.jabatan || 'Aparatur Sipil Negara'}</span>
            <span className="text-slate-300">•</span>
            <span className="text-primary-700 font-semibold">{user?.opd || 'Pemerintah Provinsi Jawa Barat'}</span>
            {user?.nip && (
              <>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-500 text-xs">NIP. {user.nip}</span>
              </>
            )}
          </p>

          <p className="text-xs text-slate-500 hidden sm:block max-w-2xl pt-0.5 leading-relaxed">
            {greetingInfo.subtext}
          </p>
        </div>
      </m.div>
    </LazyMotion>
  )
}

// Re-export as GreetingBanner for backwards compatibility
export const GreetingBanner = GreetingHeader
