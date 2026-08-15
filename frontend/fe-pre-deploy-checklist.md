# Frontend Pre-Deployment Checklist

## 1. Security
- [ ] Input validation & sanitization diterapkan (client-side untuk UX, tapi tidak diandalkan sebagai satu-satunya lapisan validasi)
- [ ] Output di-escape dengan benar untuk mencegah XSS
- [ ] Tidak ada API key, token, atau secret ter-hardcode di source code / bundle
- [ ] Content Security Policy (CSP) header sudah diset
- [ ] Semua request menggunakan HTTPS, tidak ada mixed content
- [ ] Konfigurasi CORS sudah benar (origin tidak terlalu permisif / `*`)
- [ ] Dependency di-audit (`npm audit` / `yarn audit` / Snyk) untuk cek CVE
- [ ] Tidak ada data sensitif di localStorage/sessionStorage (token JWT idealnya di httpOnly cookie)
- [ ] Clickjacking protection aktif (`X-Frame-Options` / `frame-ancestors`)

## 2. Performance
- [ ] Bundle size sudah diaudit (code splitting, tree shaking, lazy loading)
- [ ] Image optimization (format modern: WebP/AVIF, lazy load, responsive images)
- [ ] Minifikasi CSS/JS aktif
- [ ] Caching strategy sudah diatur (cache headers, service worker jika PWA)
- [ ] Lighthouse score dicek (Performance, Accessibility, Best Practices, SEO)
- [ ] Tidak ada memory leak (event listener/timer yang tidak di-cleanup)

## 3. Error Handling
- [ ] Error boundary (React) atau global error handler terpasang
- [ ] Fallback UI untuk state loading/error/empty
- [ ] Tidak menampilkan stack trace / error teknis ke user di production
- [ ] Logging & monitoring error terintegrasi (Sentry, LogRocket, dll)

## 4. Environment & Config
- [ ] Environment variables sudah benar (bukan config staging/dev)
- [ ] Feature flags dicek, fitur yang belum siap di-disable
- [ ] API endpoint mengarah ke production, bukan staging
- [ ] Source map tidak ter-expose publik (atau diupload privat ke error tracking saja)

## 5. Testing & QA
- [ ] Unit test & integration test pass
- [ ] E2E test (Cypress/Playwright) untuk flow kritikal (login, checkout, dll)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Responsive testing di berbagai device/breakpoint
- [ ] Accessibility check (kontras warna, ARIA label, keyboard navigation)

## 6. SEO & Meta
- [ ] Meta tags (title, description, OG tags) sudah sesuai
- [ ] robots.txt dan sitemap.xml tersedia (jika relevan)
- [ ] Canonical URL sudah benar

## 7. Deployment Readiness
- [ ] Build production berhasil tanpa warning/error
- [ ] Rollback plan tersedia jika deploy bermasalah
- [ ] Health check / smoke test dilakukan setelah deploy
