# Panduan Deployment & Operasional: SMART JABAR Frontend

Dokumen ini berisi panduan teknis langkah-demi-langkah untuk melakukan build, deployment, pengujian pasca-deploy (smoke test), serta prosedur rollback pada aplikasi frontend **SMART JABAR**.

---

## 1. Opsi Arsitektur Deployment

Frontend SMART JABAR adalah *Single Page Application* (SPA) berbasis React 19 + TypeScript + Vite. Hasil build berupa kumpulan berkas statis (`dist/`) yang dapat disajikan menggunakan web server performa tinggi.

### Opsi A: Menggunakan Docker (Direkomendasikan untuk Server Mandiri / VPS)

1. **Build Docker Image**:
   ```bash
   cd frontend
   docker build -t smartjabar-frontend:latest .
   ```

2. **Jalankan Container**:
   ```bash
   docker run -d \
     --name smartjabar-frontend \
     -p 80:80 \
     --restart unless-stopped \
     smartjabar-frontend:latest
   ```

3. **Verifikasi Container**:
   ```bash
   docker ps
   docker logs smartjabar-frontend
   ```

---

### Opsi B: Menggunakan Nginx Standar (Linux Host / VM On-Premise)

1. **Build Bundle Statis di Lingkungan CI/CD atau Server**:
   ```bash
   cd frontend
   npm ci
   npm run build
   ```

2. **Salin Berkas Konfigurasi Nginx**:
   Salin berkas `nginx.conf` ke konfigurasi site Nginx (misalnya `/etc/nginx/conf.d/smartjabar.conf` atau `/etc/nginx/sites-available/smartjabar`).

3. **Salin Hasil Build ke Direktori Web Server**:
   ```bash
   sudo rm -rf /var/www/smartjabar/dist/*
   sudo cp -r dist/* /var/www/smartjabar/html/
   ```

4. **Uji Konfigurasi & Reload Nginx**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 2. Variabel Lingkungan (Environment Variables)

Pastikan variabel lingkungan telah disesuaikan sebelum proses build dilakukan:

| Variabel | Keterangan | Contoh Produksi |
| :--- | :--- | :--- |
| `VITE_APP_ENV` | Mode lingkungan aplikasi | `production` |
| `VITE_API_BASE_URL` | Base URL REST API Backend Laravel | `https://smart.jabarprov.go.id/api` |
| `VITE_SSO_LOGIN_URL` | URL OAuth2/OIDC Auth Keycloak | `https://sso.jabarprov.go.id/realms/ssojabar/protocol/openid-connect/auth?...` |
| `VITE_ENABLE_MOCK_AUTH` | Fitur switcher mock ASN/Admin (Wajib `false` di prod) | `false` |

> [!CAUTION]
> Jangan pernah menyertakan `client_secret` Keycloak atau kredensial database di dalam berkas environment frontend `.env`. Semua pertukaran token sensitif wajib dieksekusi di backend Laravel.

---

## 3. Checklist Smoke Test Pasca-Deploy (Health Check)

Lakukan pengujian cepat berikut segera setelah proses deploy selesai:

1. **Akses Halaman Utama**:
   - Buka `https://smart.jabarprov.go.id` di browser.
   - Pastikan halaman login atau dashboard termuat tanpa blank screen.
2. **Periksa Console Browser**:
   - Buka DevTools (F12) -> Console.
   - Pastikan tidak ada error JavaScript merah atau CSP violation.
3. **Uji Refresh SPA pada Sub-Rute**:
   - Buka halaman `/login` atau `/ubah-password`.
   - Lakukan hard refresh (Ctrl + F5).
   - Pastikan server mengembalikan halaman aplikasi (bukan 404 Nginx).
4. **Verifikasi Security Headers**:
   - Jalankan `curl -I https://smart.jabarprov.go.id`
   - Pastikan header berikut tertera:
     - `X-Frame-Options: SAMEORIGIN`
     - `X-Content-Type-Options: nosniff`
     - `Content-Security-Policy`
5. **Uji Responsivitas & Dark Mode**:
   - Pastikan toggle tema dan tampilan responsif mobile/desktop berjalan lancar.

---

## 4. Prosedur Rollback Cepat

Jika ditemukan insiden kritis pasca-deploy:

### Jika Menggunakan Docker:
```bash
# Kembalikan ke tag image versi sebelumnya yang stabil
docker stop smartjabar-frontend
docker rm smartjabar-frontend
docker run -d --name smartjabar-frontend -p 80:80 --restart unless-stopped smartjabar-frontend:previous-stable-tag
```

### Jika Menggunakan Nginx Standar:
```bash
# Kembalikan symlink atau backup direktori sebelumnya
sudo rm -rf /var/www/smartjabar/html
sudo cp -r /var/www/smartjabar/html-backup-YYYYMMDD /var/www/smartjabar/html
sudo systemctl reload nginx
```
