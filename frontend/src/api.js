/**
 * API Configuration - Frontend Landing Page
 *
 * File ini nyimpen URL base backend yang dipake buat komunikasi sama server.
 * Semua component yang butuh data dari backend (MenuSection, GallerySection, dll)
 * import variabel API_BASE dari file ini.
 *
 * CARA KERJA:
 * - Kalau jalan di lokal (development): VITE_API_BASE bisa diset di file .env
 * - Kalau ga diset: pakai URL default backend yang udah di-deploy di Railway
 * - Frontend tinggal panggil: fetch(API_BASE + '/api/menus')
 *
 * CONTOH PAKAI DI COMPONENT:
 *   import { API_BASE } from '@/api.js'
 *   const res = await fetch(API_BASE + '/api/menus')
 *
 * GANTI URL BACKEND:
 * - Bikin file .env di folder frontend/
 * - Isi: VITE_API_BASE=https://url-backend-baru.com
 */
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://backend-kebab-production.up.railway.app'
