import { useState, useEffect } from 'react'
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
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
      iconColor: 'text-amber-300',
      badgeBg: 'bg-white/15 border-white/25 backdrop-blur-md',
      badgeText: 'text-white',
      period: 'pagi',
    }
  } else if (hour >= 11 && hour < 15) {
    return {
      greeting: 'Selamat Siang',
      subtext: 'Tetap produktif dan semangat dalam mengoptimalkan tata kelola administrasi pemerintahan.',
      icon: Sun,
      iconColor: 'text-yellow-300',
      badgeBg: 'bg-white/15 border-white/25 backdrop-blur-md',
      badgeText: 'text-white',
      period: 'siang',
    }
  } else if (hour >= 15 && hour < 18) {
    return {
      greeting: 'Selamat Sore',
      subtext: 'Pastikan seluruh agenda dan layanan administrasi harian Anda terkoordinasi dengan baik.',
      icon: Sunset,
      iconColor: 'text-orange-300',
      badgeBg: 'bg-white/15 border-white/25 backdrop-blur-md',
      badgeText: 'text-white',
      period: 'sore',
    }
  } else {
    return {
      greeting: 'Selamat Malam',
      subtext: 'Akses seluruh sistem portal SmartJabar tetap aktif dan siap mendukung kebutuhan dinas Anda.',
      icon: Moon,
      iconColor: 'text-sky-300',
      badgeBg: 'bg-white/15 border-white/25 backdrop-blur-md',
      badgeText: 'text-white',
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
        className="flex items-start sm:items-center gap-4 sm:gap-6 py-2"
      >
        {/* User Avatar with verified badge & glass ring */}
        <div className="relative shrink-0">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-white/80 shadow-lg ring-4 ring-white/15">
            <AvatarImage
              src={user?.foto_url || undefined}
              alt={user?.nama || 'User'}
              className="object-cover rounded-2xl"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary-600 to-teal-600 text-white text-lg sm:text-xl font-bold rounded-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900/80 border border-white/30 text-teal-400 shadow-md backdrop-blur-xs">
            <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 fill-teal-400 text-slate-900" />
          </div>
        </div>

        {/* Greeting & Identity Details */}
        <div className="space-y-1.5 min-w-0 flex-1">
          {/* Glass Pill Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${greetingInfo.badgeBg} ${greetingInfo.badgeText} shadow-2xs`}
            >
             
              <span>{greetingInfo.greeting}</span>
            </div>

            {user?.role === 'admin' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-white shadow-2xs backdrop-blur-md">
                
                Administrator
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-white shadow-2xs backdrop-blur-md">
                
                ASN Jabar Juara
              </span>
            )}
          </div>

          {/* Large Bold User Name */}
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center gap-2 flex-wrap">
            <span>{user?.nama || 'Aparatur Sipil Negara'}</span>
          </h1>

          {/* Position, OPD, and NIP with High Contrast */}
          <div className="text-xs sm:text-sm text-white/90 font-medium flex items-center gap-2 flex-wrap">
            <span>{user?.jabatan || 'Aparatur Sipil Negara'}</span>
            <span className="text-white/40">•</span>
            <span className="text-sky-300 font-semibold">{user?.opd || 'Pemerintah Provinsi Jawa Barat'}</span>
            {user?.nip && (
              <>
                <span className="text-white/40">•</span>
                <span className="font-mono text-white/80 text-xs bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                  NIP. {user.nip}
                </span>
              </>
            )}
          </div>

          {/* Subtext description */}
          <p className="text-xs sm:text-sm text-white/80 hidden sm:block max-w-2xl pt-0.5 leading-relaxed drop-shadow-2xs">
            {greetingInfo.subtext}
          </p>
        </div>
      </m.div>
    </LazyMotion>
  )
}

// Re-export as GreetingBanner for backwards compatibility
export const GreetingBanner = GreetingHeader

