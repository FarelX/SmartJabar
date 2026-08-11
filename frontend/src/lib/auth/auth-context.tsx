import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { mockAdminUser, mockAsnUser } from '@/lib/mock/users'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
  toggleMockRole: () => void // Untuk testing: switch antara admin & asn
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider — Mock authentication provider.
 * 
 * Saat backend belum siap, simulasi user yang sudah login.
 * Nanti diganti dengan panggilan API ke backend Laravel (Sanctum session/token).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock: default login sebagai admin untuk demo semua fitur
  const [user, setUser] = useState<User | null>(mockAdminUser)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = user !== null
  const isAdmin = user?.role === 'admin'

  const login = useCallback(() => {
    // Nanti: redirect ke SSO via buildSSOLoginURL()
    // Mock: langsung set user
    setIsLoading(true)
    setTimeout(() => {
      setUser(mockAdminUser)
      setIsLoading(false)
    }, 500)
  }, [])

  const logout = useCallback(() => {
    // Nanti: panggil backend logout + redirect ke SSO logout
    setUser(null)
  }, [])

  const toggleMockRole = useCallback(() => {
    setUser(prev => {
      if (!prev) return mockAdminUser
      return prev.role === 'admin' ? mockAsnUser : mockAdminUser
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
        toggleMockRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
