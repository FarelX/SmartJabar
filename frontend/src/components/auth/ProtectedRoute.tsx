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
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="glass-card p-8 animate-glow-pulse">
          <p className="text-white/70">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
