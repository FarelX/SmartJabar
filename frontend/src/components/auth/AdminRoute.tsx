import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/auth-context'

interface AdminRouteProps {
  children: React.ReactNode
}

/**
 * AdminRoute — Redirect ke dashboard jika user bukan admin.
 * Catatan: ini hanya proteksi UI, validasi sesungguhnya WAJIB di backend (CLAUDE.md bagian 6).
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-portal flex items-center justify-center">
        <div className="bg-white/90 border border-slate-200 shadow-lg rounded-2xl p-8 animate-pulse">
          <p className="text-slate-600 font-medium">Memuat halaman admin...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

