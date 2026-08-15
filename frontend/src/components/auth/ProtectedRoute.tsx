import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute — Redirect ke /login jika user belum login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white/90 border border-slate-200 shadow-lg rounded-2xl p-8 animate-pulse">
          <p className="text-slate-600 font-medium">Memuat portal...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

