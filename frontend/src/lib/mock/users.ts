import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 1,
    keycloak_id: 'kc-001-admin',
    nip: '198501012010011001',
    nama: 'Dr. H. Ahmad Suryadi, M.Si.',
    email: 'ahmad.suryadi@jabarprov.go.id',
    foto_url: null,
    jabatan: 'Kepala Bidang Teknologi Informasi',
    unit_kerja: 'Bidang TI',
    opd: 'Dinas Komunikasi dan Informatika',
    role: 'admin',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 2,
    keycloak_id: 'kc-002-asn',
    nip: '199003152015022001',
    nama: 'Siti Nurhaliza, S.Kom.',
    email: 'siti.nurhaliza@jabarprov.go.id',
    foto_url: null,
    jabatan: 'Analis Data',
    unit_kerja: 'Seksi Pengelolaan Data',
    opd: 'Dinas Komunikasi dan Informatika',
    role: 'asn',
    created_at: '2026-03-20T08:00:00Z',
    updated_at: '2026-08-05T09:00:00Z',
  },
]

export const mockAdminUser = mockUsers[0]
export const mockAsnUser = mockUsers[1]
