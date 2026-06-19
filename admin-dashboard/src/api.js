// ================================================================
// api.js — Konfigurasi Base URL untuk Koneksi ke Backend
// ================================================================
//
// File ini mengeksport variabel API_BASE yang berisi alamat URL
// backend server (Express.js yang berjalan di Railway).
//
// CARA KERJA:
// - Saat development (lokal): Pakai nilai dari environment variable
//   VITE_API_BASE yang diatur di file .env (misalnya http://localhost:3000)
// - Saat production (deployed): Pakai URL Railway sebagai default fallback
//   → https://backend-kebab-production.up.railway.app
//
// CARA PAKAI di komponen Vue:
//   import { API_BASE } from '@/api.js'
//   const res = await fetch(API_BASE + '/api/products')
//
// CATATAN:
// Prefix VITE_ wajib dipakai agar variabel bisa dibaca oleh Vite
// di browser (import.meta.env.VITE_API_BASE).
// ================================================================

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://backend-kebab-production.up.railway.app'
