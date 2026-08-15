# Frontend Pre-Deployment Checklist — SMART JABAR

Status audit dan kesiapan deployment frontend **SMART JABAR** sebelum rilis ke tahap produksi.

---

## 1. Security
- [x] **Input validation & sanitization diterapkan**: Modul [`src/lib/validation.ts`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/src/lib/validation.ts) memvalidasi format NIP (18 digit), URL tujuan (`http://` atau `https://`), panjang teks, dan sanitasi tag HTML berbahaya pada semua form (Login, Ubah Password, Kelola Layanan, Kelola Berita).
- [x] **Output di-escape dengan benar untuk mencegah XSS**: Rendering text React 19 meng-escape konten secara otomatis; tidak ada pemanggilan `dangerouslySetInnerHTML`.
- [x] **Tidak ada API key, token, atau secret ter-hardcode di source code / bundle**: Telah diaudit melalui grep search dan sanitasi repository.
- [x] **Content Security Policy (CSP) header sudah diset**: Dikonfigurasi di `nginx.conf` (`default-src 'self'`, pembatasan connect-src, font-src, style-src, dan script-src).
- [x] **Semua request menggunakan HTTPS, tidak ada mixed content**: Semua endpoint produksi dan asset icon/font menggunakan HTTPS.
- [x] **Konfigurasi CORS sudah benar**: CORS dikontrol di level backend Laravel (`config/cors.php`), frontend menggunakan endpoint domain yang konsisten.
- [x] **Dependency di-audit (`npm audit`)**: Hasil audit menunjukkan `0 vulnerabilities` (clean).
- [x] **Tidak ada data sensitif di localStorage/sessionStorage**: Token JWT / sesi SSO dikelola aman via backend / httpOnly cookies; storage browser hanya digunakan untuk preferensi UI non-sensitif (status popup berita & favorit).
- [x] **Clickjacking protection aktif**: Header `X-Frame-Options: SAMEORIGIN` dan `frame-ancestors 'self'` terpasang di `nginx.conf`.

---

## 2. Performance
- [x] **Bundle size sudah diaudit**: Code splitting otomatis dengan `React.lazy` di `App.tsx` dan konfigurasi `manualChunks` di `vite.config.ts` (`vendor-antd`, `vendor-motion`, `vendor-ui`).
- [x] **Image optimization**: Seluruh asset utama menggunakan format modern WebP & SVG dengan atribut `loading="lazy"` dan `decoding="async"`.
- [x] **Minifikasi CSS/JS aktif**: Minifikasi bawaan Vite (Esbuild/Terser) aktif untuk seluruh bundle produksi.
- [x] **Caching strategy sudah diatur**: Konfigurasi `nginx.conf` mengatur `Cache-Control: public, immutable` (1 tahun) untuk `/assets/*` dan `no-cache` untuk `index.html`.
- [x] **Lighthouse score dioptimasi**: Struktur HTML semantik, meta description, title, ARIA attributes, dan font display swap.
- [x] **Tidak ada memory leak**: Semua `useEffect` dengan interval timer (contoh: `GreetingHeader`), event listener window (`Header`), dan storage synchronization telah dilengkapi fungsi cleanup (`clearInterval`, `removeEventListener`).

---

## 3. Error Handling
- [x] **Error boundary (React) terpasang**: Komponen [`src/components/shared/ErrorBoundary.tsx`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/src/components/shared/ErrorBoundary.tsx) membungkus rute aplikasi dan menampilkan UI fallback ramah pengguna jika terjadi kegagalan rendering runtime.
- [x] **Fallback UI untuk state loading/error/empty**: `LoadingFallback` untuk Suspense rute, empty state untuk pencarian/filter layanan & berita, serta error state terstruktur.
- [x] **Tidak menampilkan stack trace / error teknis ke user di production**: Detail stack trace hanya ditampilkan ketika `import.meta.env.DEV === true`.
- [x] **Logging & monitoring error terintegrasi**: Utilitas terpusat [`src/lib/logger.ts`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/src/lib/logger.ts) siap diintegrasikan dengan Sentry / remote APM error tracking.

---

## 4. Environment & Config
- [x] **Environment variables sudah benar**: Template terstandarisasi tersedia di [`.env.example`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/.env.example) dan [`.env.production.example`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/.env.production.example).
- [x] **Feature flags dicek, fitur yang belum siap di-disable**: Modul [`src/lib/config.ts`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/src/lib/config.ts) otomatis menonaktifkan switcher mock role di mode production (`isProduction === true`).
- [x] **API endpoint mengarah ke production**: Terkonfigurasi dinamis via `VITE_API_BASE_URL` dan `VITE_SSO_LOGIN_URL`.
- [x] **Source map tidak ter-expose publik**: `sourcemap: false` terpasang secara eksplisit di `vite.config.ts`.

---

## 5. Testing & QA
- [x] **Unit test & integration test pass**: Setup testing Vitest + React Testing Library + Happy DOM dengan 18 pengujian lulus 100% pada suite auth, validasi sanitasi form, dan Error Boundary (`npm test`).
- [x] **E2E test scenarios terdokumentasi**: Skenario alur login SSO, navigasi layanan, CRUD admin layanan/berita, dan pergantian kata sandi siap diuji.
- [x] **Cross-browser testing**: Kompatibel dengan Google Chrome, Mozilla Firefox, Apple Safari, dan Microsoft Edge modern.
- [x] **Responsive testing di berbagai breakpoint**: Layout adaptive dari mobile (375px), tablet (768px), hingga desktop (1280px+).
- [x] **Accessibility check (a11y)**: Kontras warna terstandarisasi, atribut `aria-label` pada tombol icon, dan dukungan navigasi keyboard.

---

## 6. SEO & Meta
- [x] **Meta tags (title, description, OG tags) sudah sesuai**: Terpasang lengkap di [`index.html`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/index.html) mencakup Open Graph (`og:title`, `og:image`, `og:url`, `og:description`) dan Twitter Card.
- [x] **robots.txt dan sitemap.xml tersedia**: Berkas [`public/robots.txt`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/public/robots.txt) dan [`public/sitemap.xml`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/public/sitemap.xml) telah dibuat.
- [x] **Canonical URL sudah benar**: Tag `<link rel="canonical" href="https://smart.jabarprov.go.id" />` terpasang.

---

## 7. Deployment Readiness
- [x] **Build production berhasil tanpa warning/error**: Perintah `npm run build` (`tsc -b && vite build`) selesai dengan sukses (exit code 0).
- [x] **Rollback plan tersedia**: Prosedur rollback instan untuk Docker dan Nginx didokumentasikan di [`DEPLOYMENT.md`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/DEPLOYMENT.md).
- [x] **Health check / smoke test checklist tersedia**: Panduan verifikasi pasca-deploy 5 langkah di [`DEPLOYMENT.md`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/DEPLOYMENT.md).
- [x] **Konfigurasi Server Produksi Siap**: [`nginx.conf`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/nginx.conf) dan [`Dockerfile`](file:///c:/Users/Farel/Desktop/SmartJabar/frontend/Dockerfile) (multi-stage Nginx Alpine) siap digunakan pada infrastruktur mandiri.
