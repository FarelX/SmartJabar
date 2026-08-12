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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />

              {/* Admin routes */}
              <Route
                path="/admin/layanan"
                element={
                  <AdminRoute>
                    <AdminServicesPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/berita"
                element={
                  <AdminRoute>
                    <AdminNewsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/kategori"
                element={
                  <AdminRoute>
                    <AdminCategoriesPage />
                  </AdminRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App


