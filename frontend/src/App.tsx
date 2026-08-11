import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth/auth-context'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AdminServicesPage } from '@/pages/admin/AdminServicesPage'
import { AdminNewsPage } from '@/pages/admin/AdminNewsPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
