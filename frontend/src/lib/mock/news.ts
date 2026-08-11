import type { News } from '@/types'

export const mockNews: News[] = [
  {
    id: 1,
    judul: 'Pemutakhiran Data Kepegawaian 2026',
    isi_teks: 'Kepada seluruh ASN Pemprov Jawa Barat, dimohon untuk segera melakukan pemutakhiran data kepegawaian melalui aplikasi JABAR SMART ASN paling lambat 31 Agustus 2026. Data yang perlu diperbarui meliputi: riwayat pendidikan, riwayat jabatan, dan data keluarga.',
    gambar_url: null,
    is_active: true,
    tanggal_mulai: '2026-08-01',
    tanggal_selesai: '2026-08-31',
    created_by: 1,
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 2,
    judul: 'Peluncuran Portal SMART JABAR Versi Baru',
    isi_teks: 'Dengan bangga kami mengumumkan peluncuran Portal SMART JABAR versi terbaru dengan tampilan yang lebih modern dan fitur-fitur baru. Nikmati kemudahan akses layanan administrasi pemerintahan melalui satu pintu yang terintegrasi dengan Single Sign-On (SSO).',
    gambar_url: null,
    is_active: true,
    tanggal_mulai: '2026-08-11',
    tanggal_selesai: '2026-09-11',
    created_by: 1,
    created_at: '2026-08-11T08:00:00Z',
    updated_at: '2026-08-11T08:00:00Z',
  },
  {
    id: 3,
    judul: 'Maintenance Server 15 Agustus',
    isi_teks: 'Diberitahukan bahwa pada tanggal 15 Agustus 2026 pukul 22:00 - 02:00 WIB akan dilakukan maintenance server. Selama periode tersebut, beberapa layanan mungkin tidak dapat diakses. Mohon maaf atas ketidaknyamanannya.',
    gambar_url: null,
    is_active: false,
    tanggal_mulai: '2026-08-14',
    tanggal_selesai: '2026-08-15',
    created_by: 1,
    created_at: '2026-08-10T08:00:00Z',
    updated_at: '2026-08-10T08:00:00Z',
  },
]

export function getActiveNews(news: News[]): News[] {
  const now = new Date()
  return news.filter(n => {
    if (!n.is_active) return false
    if (n.tanggal_mulai && new Date(n.tanggal_mulai) > now) return false
    if (n.tanggal_selesai && new Date(n.tanggal_selesai) < now) return false
    return true
  })
}
