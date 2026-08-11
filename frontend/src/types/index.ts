// ================================
// Types sesuai skema database (CLAUDE.md bagian 7)
// ================================

export type UserRole = 'admin' | 'asn'

export interface User {
  id: number
  keycloak_id: string
  nip: string
  nama: string
  email: string
  foto_url: string | null
  jabatan: string
  unit_kerja: string
  opd: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: number
  nama: string
}

export interface Service {
  id: number
  nama: string
  deskripsi: string
  icon_url: string | null
  url_tujuan: string
  category_id: number
  is_active: boolean
  created_by: number
  created_at: string
  updated_at: string
  // Joined fields
  category?: ServiceCategory
  usage_count?: number
}

export interface ServiceUsageLog {
  id: number
  service_id: number
  user_id: number | null
  accessed_at: string
}

export interface News {
  id: number
  judul: string
  isi_teks: string
  gambar_url: string | null
  is_active: boolean
  tanggal_mulai: string | null
  tanggal_selesai: string | null
  created_by: number
  created_at: string
  updated_at: string
}

// ================================
// Form types (untuk CRUD)
// ================================

export interface ServiceFormData {
  nama: string
  deskripsi: string
  icon_url: string
  url_tujuan: string
  category_id: number
  is_active: boolean
}

export interface NewsFormData {
  judul: string
  isi_teks: string
  gambar_url: string
  is_active: boolean
  tanggal_mulai: string
  tanggal_selesai: string
}

export interface CategoryFormData {
  nama: string
}

// ================================
// Auth types
// ================================

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
