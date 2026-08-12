import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth/auth-context'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { LoadingFallback } from '@/components/shared/LoadingFallback'
import { Toaster } from '@/components/ui/sonner'

// Code splitting — Lazy load each page on demand
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage').then(m => ({ default: m.AdminServicesPage })))
const AdminNewsPage = lazy(() => import('@/pages/admin/AdminNewsPage').then(m => ({ default: m.AdminNewsPage })))
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })))

/**
 * Thin Suspense wrapper for per-route granular loading.
 * Falls back to LoadingFallback only while the route's chunk is being fetched —
 * other parts of the layout (navbar, etc.) remain stable during navigation.
 */
function RouteSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <RouteSuspense>
                  <LoginPage />
                </RouteSuspense>
              }
            />
          </Route>

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={
                <RouteSuspense>
                  <DashboardPage />
                </RouteSuspense>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/layanan"
              element={
                <AdminRoute>
                  <RouteSuspense>
                    <AdminServicesPage />
                  </RouteSuspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/berita"
              element={
                <AdminRoute>
                  <RouteSuspense>
                    <AdminNewsPage />
                  </RouteSuspense>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/kategori"
              element={
                <AdminRoute>
                  <RouteSuspense>
                    <AdminCategoriesPage />
                  </RouteSuspense>
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
