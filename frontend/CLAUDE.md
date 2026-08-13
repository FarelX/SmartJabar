# Redesign Portal SMART JABAR & Integrasi SSO Keycloak

> Dokumen ini adalah brief teknis untuk tugas magang di **Diskominfo Jawa Barat**: redesign Portal Administrasi Pemerintahan **SMART JABAR** beserta penambahan fitur baru, dan pembuatan halaman login yang terintegrasi dengan **Keycloak SSO** (instance Keycloak sudah tersedia, tinggal dihubungkan).
>
> Dokumen ini ditulis agar bisa dipakai sebagai konteks kerja oleh AI coding agent (Antigravity) maupun oleh anggota tim manusia.

---

## 1. Latar Belakang

Diskominfo Jabar memiliki portal **SMART JABAR** yang berfungsi sebagai _single entry point_ bagi ASN Pemprov Jabar untuk mengakses berbagai layanan administrasi pemerintahan, antara lain:

- **JABAR SMART ASN** — super apps kepegawaian
- **SIDEBAR** — sistem informasi dokumen elektronik (E-Office)
- **DASHBOARD JABAR** — visualisasi data untuk pengambilan kebijakan
- **SINGAKOTA** — sistem informasi pengawasan koperasi digital
- **SATU DATA JABAR** — platform berbagi pakai data antar OPD

Portal saat ini menggunakan login berbasis **NIP + Kata Sandi** dan menampilkan layanan dalam bentuk kartu statis. Tugas tim adalah melakukan **redesign UI/UX**, **menambah fitur baru**, dan **mengganti/menghubungkan alur login ke Keycloak SSO** yang sudah disediakan oleh tim infrastruktur.

Referensi tampilan lama ada di folder `docs/reference-screenshots/` (portal utama & halaman login).

## 2. Tujuan Proyek

1. Merancang ulang tampilan portal agar lebih modern, konsisten, dan mudah digunakan (menggunakan `shadcn/ui`).
2. Menambahkan fitur pengelolaan layanan oleh admin (CRUD layanan).
3. Menambahkan _quick access_ untuk 3 layanan yang paling sering digunakan.
4. Menambahkan fitur pencarian dan filter kategori layanan.
5. Menampilkan informasi identitas pengguna (nama, foto, jabatan, dinas) yang lebih lengkap dari sebelumnya.
6. Menambahkan fitur pop-up berita yang dapat dikelola admin (gambar/teks).
7. Mengintegrasikan proses login dengan **Keycloak** sebagai Identity Provider (SSO), menggantikan autentikasi manual.

## 3. Ruang Lingkup Pekerjaan

### 3.1 Halaman Portal (Dashboard Layanan)

Redesign halaman utama pasca-login yang menampilkan daftar layanan, quick access, pencarian, dan profil pengguna.

### 3.2 Halaman Login

Redesign halaman login, alur autentikasi dialihkan sepenuhnya ke Keycloak (bukan lagi validasi NIP/password langsung ke backend Laravel).

### Di luar cakupan (out of scope)

- Konfigurasi/administrasi realm Keycloak (sudah disiapkan tim lain).
- Pengembangan ulang aplikasi-aplikasi layanan itu sendiri (SIDEBAR, DASHBOARD JABAR, dst) — portal hanya menampilkan & menautkan ke aplikasi tersebut.

## 4. Teknologi yang Digunakan

| Layer             | Teknologi                                       |
| ----------------- | ----------------------------------------------- |
| Frontend          | React (+ Vite/Next, sesuaikan dengan setup tim) |
| UI Components     | shadcn/ui + Tailwind CSS                        |
| Backend           | Laravel (REST API)                              |
| Database          | PostgreSQL                                      |
| Autentikasi / SSO | Keycloak (OpenID Connect)                       |

## 5. Spesifikasi Fitur

### 5.1 Manajemen Layanan (khusus Role Admin)

- Admin dapat **menambah**, **mengubah**, dan **menghapus** layanan (nama, deskripsi, ikon/logo, URL tujuan, kategori).
- User biasa (role ASN) hanya dapat **melihat** daftar layanan, tidak melihat tombol kelola.
- Setiap layanan minimal memiliki: `nama`, `deskripsi`, `icon/logo`, `url`, `kategori`, `status aktif/nonaktif`.

**Acceptance criteria:**

- [ ] Endpoint API CRUD layanan hanya bisa diakses role `admin` (proteksi di backend, bukan hanya disembunyikan di UI).
- [ ] Perubahan layanan langsung terlihat di daftar layanan tanpa reload penuh.

### 5.2 Quick Access — Top 3 Layanan Terbanyak Digunakan

- Sistem mencatat setiap kali user mengklik/membuka sebuah layanan (log penggunaan).
- Bagian atas dashboard menampilkan **3 layanan dengan jumlah klik terbanyak** (bisa global, atau per-user — putuskan bersama mentor, default: global seluruh ASN).

**Acceptance criteria:**

- [ ] Klik pada layanan tercatat di tabel log.
- [ ] Top 3 dihitung berdasarkan agregasi log (bisa realtime query atau cache/scheduled job).

### 5.3 Search & Kategori

- Search bar untuk mencari layanan berdasarkan nama/deskripsi.
- Filter berdasarkan kategori layanan (misalnya: Kepegawaian, Data, Pengawasan, Dokumen, dll — kategori dikelola admin).

**Acceptance criteria:**

- [ ] Pencarian bersifat _case-insensitive_ dan langsung memfilter tanpa reload.
- [ ] Kategori dapat dipilih lebih dari satu (opsional) atau single-select (tentukan sesuai kebutuhan UX).

### 5.4 Informasi Profil Pengguna

Menampilkan di header/dashboard:

- Nama lengkap
- Foto profil
- Jabatan
- Dinas/OPD

**Sudah dikonfirmasi mentor:** seluruh data ini didapat otomatis dari response endpoint `userinfo` Keycloak setelah login (tidak diinput manual). Detail atribut & mapping-nya ada di bagian **8.1**.

**Acceptance criteria:**

- [ ] Jika foto profil tidak tersedia, tampilkan avatar default/inisial nama.
- [ ] Data profil disinkronkan (upsert) ke tabel `users` lokal setiap kali login, bukan diinput manual.

### 5.5 Pop-up Berita

- Admin dapat menambahkan berita berupa **gambar dan/atau teks**.
- Berita muncul sebagai **pop-up/modal** kepada ASN, misalnya saat pertama kali membuka portal dalam sesi tersebut.
- Admin dapat mengatur berita aktif/nonaktif dan urutan tampil (jika lebih dari satu).

**Acceptance criteria:**

- [ ] Pop-up dapat ditutup oleh user (tombol close / klik di luar modal).
- [ ] Admin dapat CRUD berita (judul, isi/teks, gambar, status aktif, tanggal mulai-selesai tayang — opsional).

### 5.6 Autentikasi via Keycloak SSO

- Halaman login didesain ulang, namun proses autentikasi aktual didelegasikan ke Keycloak.
- Setelah login berhasil di Keycloak, user diarahkan kembali ke portal dengan sesi aktif (token JWT).

**Acceptance criteria:**

- [ ] Tidak ada password ASN yang disimpan/divalidasi langsung oleh backend Laravel.
- [ ] Logout dari portal juga mengakhiri sesi di Keycloak (single logout), bukan hanya menghapus token di frontend.

## 6. Role & Hak Akses

| Role               | Hak Akses                                           |
| ------------------ | --------------------------------------------------- |
| `admin`            | CRUD layanan, CRUD berita, lihat semua fitur ASN    |
| `asn` (user biasa) | Lihat layanan, quick access, search, profil, berita |

**Sudah dikonfirmasi mentor:** role **tidak** diambil dari klaim Keycloak — role diatur/dikelola sendiri oleh sistem kita (disimpan di tabel `users` lokal, kolom `role`).

Alur yang disarankan:

- Saat user login via SSO untuk pertama kali dan belum ada di tabel `users` lokal, sistem otomatis membuatkan record baru dengan `role` default `asn`.
- Untuk menjadikan seseorang `admin`, ubah kolom `role` di database secara manual (misal lewat seeder untuk admin pertama), atau buat halaman "Manajemen User" khusus admin untuk mengubah role user lain (bisa jadi fitur tambahan jika diperlukan).
- Karena bukan dari Keycloak, cek role ini **wajib divalidasi di backend** pada setiap endpoint yang butuh akses admin (jangan cuma disembunyikan di UI).

## 7. Rancangan Skema Database (Draft)

> Ini hanya usulan awal, sesuaikan dengan diskusi tim/mentor.

```
users
- id
- keycloak_id (dari field "sub", unique)
- nip (dari field "preferred_username")
- nama (dari field "name" / "given_name")
- email (dari field "email")
- foto_url (dari field "foto")
- jabatan (dari field "jabatan")
- unit_kerja (dari field "unit_kerja" / bidang)
- opd (dari field "opd" — ini yang dipakai untuk info "Dinas")
- role (dikelola lokal, bukan dari Keycloak — default "asn")
- created_at / updated_at

services (layanan)
- id
- nama
- deskripsi
- icon_url
- url_tujuan
- category_id (FK)
- is_active
- created_by (FK users)
- created_at / updated_at

service_categories
- id
- nama

service_usage_logs
- id
- service_id (FK)
- user_id (FK, nullable jika ingin agregat global)
- accessed_at

news (berita)
- id
- judul
- isi_teks
- gambar_url
- is_active
- tanggal_mulai
- tanggal_selesai
- created_by (FK users)
```

## 8. Arsitektur & Alur Integrasi Keycloak

> Alur ini mengikuti **Manual Book Teknis Bergabung dengan SSO v1.0** dari Diskominfo Jabar (bukan Authorization Code + PKCE generik — di sini pertukaran token pakai `client_secret`, jadi prosesnya **wajib dilakukan di backend Laravel**, bukan di frontend, supaya `client_secret` tidak bocor ke browser).

Realm SSO yang dipakai: `ssojabar` di `https://sso.jabarprov.go.id`.

**Langkah-langkah:**

1. **Tombol "Login with SSO"** di halaman login (frontend) mengarahkan user ke URL berikut (bisa berupa link langsung, tidak perlu library khusus):

   ```
   GET https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/auth
     ?response_type=code
     &client_id={client_id}
     &redirect_uri={redirect_uri}
   ```

   `redirect_uri` di sini **harus mengarah ke endpoint backend Laravel** (controller auth), bukan ke halaman frontend — karena backend yang akan menukar `code` dengan token.

2. Setelah user berhasil login di halaman SSO, Keycloak akan redirect ke `redirect_uri` dengan membawa query param `code` dan `session_state`:

   ```
   {redirect_uri}?session_state=...&code=...
   ```

3. Backend (controller auth) menukar `code` tersebut menjadi `access_token` dengan memanggil:

   ```
   POST https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=authorization_code
   client_id={client_id}
   client_secret={client_secret}
   code={code}
   redirect_uri={redirect_uri}
   ```

   Response JSON berisi: `access_token`, `expires_in`, `refresh_token`, `refresh_expires_in`, `token_type` (bearer), dll.

4. Backend memanggil endpoint **userinfo** untuk mengambil data ASN yang login:

   ```
   GET https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/userinfo
   Authorization: Bearer {access_token}
   ```

   Response berisi `sub`, `unit_kerja`, `opd`, `foto`, `jabatan`, `name`, `preferred_username` (NIP), `email`, dll — lihat mapping lengkap di **8.1**.

5. Backend melakukan **upsert** ke tabel `users` lokal berdasarkan `keycloak_id` (= `sub`). Jika user baru, `role` diset default `asn` (lihat bagian 6).

6. Backend membuat sesi/token aplikasi sendiri untuk frontend (misalnya Sanctum token atau session cookie) dan redirect user ke dashboard portal dalam keadaan sudah login. `access_token` & `refresh_token` dari Keycloak sebaiknya disimpan di sisi backend (bukan dikirim ke frontend), untuk dipakai ulang saat perlu refresh token (langkah 7) atau logout.

7. **(Opsional) Refresh token**, dipakai kalau `access_token` sudah kedaluwarsa tapi sesi SSO masih aktif:

   ```
   POST https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=refresh_token
   client_id={client_id}
   client_secret={client_secret}
   refresh_token={refresh_token}
   ```

### 8.1 Atribut Data dari Keycloak (`userinfo`)

| Field dari Keycloak   | Keterangan                   | Mapping ke tabel `users` lokal                 |
| --------------------- | ---------------------------- | ---------------------------------------------- |
| `sub`                 | ID user di Keycloak          | `keycloak_id`                                  |
| `preferred_username`  | Nomor Induk Pegawai (NIP)    | `nip`                                          |
| `name` / `given_name` | Nama lengkap (beserta gelar) | `nama`                                         |
| `email`               | Email user                   | `email`                                        |
| `email_verified`      | Status verifikasi email      | _(opsional, tidak wajib disimpan)_             |
| `foto`                | URL foto user                | `foto_url`                                     |
| `jabatan`             | Jabatan user                 | `jabatan`                                      |
| `unit_kerja`          | Unit kerja / bidang          | `unit_kerja`                                   |
| `opd`                 | OPD user                     | `opd` (dipakai sebagai info **"Dinas"** di UI) |

### 8.2 Yang masih perlu ditindaklanjuti (action items tim)

- [x] **Redirect URI diusulkan:** `GET /api/auth/sso/callback` di backend Laravel — misalnya `http://localhost:8000/api/auth/sso/callback` untuk development dan `https://{domain-production}/api/auth/sso/callback` untuk production/staging. Infokan kedua-duanya ke mentor (tanyakan apakah Keycloak bisa daftar lebih dari satu redirect_uri per client, karena biasanya harus persis sama dengan yang dipakai saat request).
- [x] `client_id` & `client_secret` sudah diterima dari mentor (Pa Reza Aptika) — **simpan hanya di `.env` backend, jangan pernah commit ke git atau taruh di frontend.**
- [ ] Konfirmasi ulang ke mentor: username/password yang diberikan itu untuk apa (dugaan sementara: akun test/dummy ASN untuk coba login di form SSO).
- [ ] Cek ke mentor apakah ada mekanisme _single logout_ dari sisi SSO, atau logout cukup dilakukan dengan menghapus sesi lokal + `access_token`/`refresh_token` di backend.

### 8.3 Testing Manual Alur Login

Karena sesi SSO tersimpan di cookie browser (`sso.jabarprov.go.id`), begitu login sekali, browser akan auto-login pakai sesi lama saat flow login SSO diulang. Untuk mengetes ulang dari awal (form login muncul lagi), buka URL berikut di browser sebelum mengulang test:

```
https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/logout
```

Berguna untuk bergantian testing antar anggota tim tanpa harus clear cookies manual.

## 9. Struktur Folder (Usulan)

```
frontend/
  src/
    components/       # komponen UI (termasuk berbasis shadcn/ui)
    pages/
      Login.tsx
      Dashboard.tsx
    features/
      services/        # CRUD layanan (admin) + list layanan
      news/             # pop-up berita
      profile/
    lib/
      auth/             # helper untuk sesi/token aplikasi (bukan oidc client, karena token exchange ada di backend)
    hooks/

backend/
  app/
    Http/Controllers/
      AuthController.php       # redirect ke SSO, handle callback, exchange code, refresh token
      ServiceController.php
      NewsController.php
      UserController.php
    Models/
    Middleware/
      IsAdmin.php               # cek kolom role di tabel users lokal
  routes/api.php
  database/migrations/
```

## 10. Environment Variables (contoh)

```
# Frontend
VITE_API_BASE_URL=
VITE_SSO_LOGIN_URL=          # URL tombol "Login with SSO", lihat bagian 8 langkah 1

# Backend (Laravel)
DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

KEYCLOAK_REALM=ssojabar
KEYCLOAK_AUTH_URL=https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/auth
KEYCLOAK_TOKEN_URL=https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/token
KEYCLOAK_USERINFO_URL=https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/userinfo
KEYCLOAK_CLIENT_ID=              # dari mentor
KEYCLOAK_CLIENT_SECRET=          # dari mentor, JANGAN taruh di frontend
KEYCLOAK_REDIRECT_URI=http://localhost:8000/api/auth/sso/callback   # ganti sesuai domain saat production, infokan ke mentor
```

## 11. Cara Menjalankan Proyek (Getting Started)

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend
cd frontend
npm install
npm run dev
```

> Pastikan instance Keycloak sudah bisa diakses dan client ID/realm sudah dikonfirmasi ke mentor sebelum mengetes alur login.

## 12. Pembagian Tugas Tim (isi sesuai kesepakatan)

| Nama             | Fokus |
| ---------------- | ----- |
| [Nama Anda]      | ...   |
| [Nama Anggota 2] | ...   |
| [Nama Anggota 3] | ...   |

## 13. Catatan untuk AI Agent (Antigravity)

Ketika membantu mengembangkan proyek ini, prioritaskan:

1. Konsistensi desain menggunakan komponen `shadcn/ui` (jangan membuat komponen UI dari nol jika sudah ada di shadcn).
2. Ikuti alur integrasi Keycloak persis seperti di bagian 8 (Authorization Code + `client_secret`, bukan PKCE) — pertukaran `code` menjadi `access_token` **wajib** di backend Laravel, `client_secret` tidak boleh ada di kode frontend.
3. Role admin **tidak** berasal dari token Keycloak — validasi role selalu terhadap kolom `role` di tabel `users` lokal (lihat bagian 6), dan validasi ini **selalu di backend**, jangan hanya menyembunyikan tombol di frontend.
4. Jangan menyimpan/memvalidasi password ASN secara manual — semua autentikasi lewat Keycloak.
5. Data profil (nama, jabatan, opd/dinas, unit kerja, foto) selalu disinkronkan dari response `userinfo` Keycloak (bagian 8.1), jangan dibuat form input manual untuk data tersebut.
6. Ikuti struktur folder & skema database di atas sebagai baseline, boleh disesuaikan bila ada alasan teknis yang jelas (jelaskan alasannya).
7. Tulis migration Laravel untuk setiap tabel baru di bagian 7 sebelum membuat model/controller-nya.

## 14. Referensi Desain

Screenshot tampilan portal & login lama tersedia terlampir sebagai acuan awal desain (sebelum redesign). Gunakan sebagai referensi struktur informasi, bukan acuan visual final.

---

_Dokumen ini adalah working draft — perbarui sesuai arahan mentor dan hasil diskusi tim selama pengerjaan._
