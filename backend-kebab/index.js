/**
 * =============================================
 * BACKEND SERVER - Grand Kebab Hejo
 * =============================================
 *
 * File ini adalah server utama (entry point) untuk backend aplikasi Grand Kebab Hejo.
 * Backend ini dibangun pakai Express.js (framework web Node.js) dan Prisma (ORM database).
 *
 * FUNGSI UTAMA:
 * - Menyediakan API (Application Programming Interface) untuk frontend
 * - Menghubungkan frontend ke database PostgreSQL (hosted di Railway)
 * - Menangani semua operasi CRUD (Create, Read, Update, Delete)
 *
 * SIAPA YANG PAKAI BACKEND INI:
 * 1. Landing Page (frontend) - website publik yang dilihat visitor
 *    → Cuma pakai GET endpoints (baca data menu, galeri, hero slides, outlet, franchise link)
 * 2. Admin Dashboard - halaman admin untuk kelola konten
 *    → Pakai semua endpoints (GET, POST, PUT, DELETE)
 *
 * CARA KONEKSI DARI FRONTEND KE BACKEND:
 * - Frontend kirim HTTP request ke URL backend (contoh: https://backend-kebab-production.up.railway.app)
 * - URL base backend disimpan di file `src/api.js` sebagai variabel API_BASE
 * - Frontend panggil fetch(API_BASE + '/api/menus') untuk ambil data menu
 * - Backend terima request, ambil data dari database pakai Prisma, kirim balik sebagai JSON
 *
 * TEKNOLOGI:
 * - Express.js  → framework web server (routing, middleware)
 * - Prisma      → ORM buat komunikasi ke database PostgreSQL (tanpa tulis SQL manual)
 * - CORS        → middleware biar frontend beda domain bisa akses backend ini
 * - dotenv      → baca variabel environment dari file .env (contoh: DATABASE_URL, PORT)
 *
 * CARA JALANIN LOKAL:
 *   cd backend-kebab
 *   npm install
 *   npx prisma db push        ← sync schema ke database
 *   node index.js             ← start server di localhost:3000
 *
 * DATABASE:
 * - PostgreSQL (hosted di Railway)
 * - Schema ada di file prisma/schema.prisma
 * - Tabel: Category, Product, City, Outlet, Gallery, HeroSlide, Setting, Admin
 */

// ============================================
// IMPORT MODULE & SETUP
// ============================================

// Express: framework web server buat bikin API endpoints
const express = require('express');
// CORS: middleware biar frontend (Vercel) bisa akses backend (Railway) yang domain-nya beda
const cors = require('cors');
// PrismaClient: ORM buat query database tanpa tulis SQL manual
const { PrismaClient } = require('@prisma/client');
// dotenv: baca file .env yang isinya DATABASE_URL dan PORT
require('dotenv').config();

// Inisialisasi Prisma (koneksi ke database PostgreSQL)
const prisma = new PrismaClient();
// Inisialisasi Express (web server)
const app = express();

// Middleware CORS: izinkan semua domain akses backend ini
// Penting karena frontend (Vercel) dan backend (Railway) punya domain berbeda
// Tanpa ini, browser akan blokir request dari frontend ke backend
app.use(cors());

// Middleware JSON: otomatis parse body request yang formatnya JSON
// Tanpa ini, req.body akan undefined saat frontend kirim data JSON
app.use(express.json());

// ============================================
// API ENDPOINTS - DATA MENU
// ============================================

/**
 * GET /api/menus
 * Ambil semua kategori beserta produknya dari database.
 *
 * DIPAKAI OLEH:
 * - Landing Page → Menu Section (tampil daftar menu + harga ke visitor)
 * - Admin Dashboard → Katalog Menu (tampil semua produk buat dikelola admin)
 *
 * CARA FRONTEND PANGGIL:
 *   const res = await fetch(API_BASE + '/api/menus')
 *   const data = await res.json()
 *   // data = [{ id, name, products: [{ id, name, price, image_url, categoryId }] }, ...]
 *
 * CONTOH RESPONSE:
 *   [
 *     { "id": 1, "name": "Kebab Pot", "products": [
 *         { "id": 1, "name": "Kebab Pot", "price": 20000, "image_url": "kebab-pot.png", "categoryId": 1 }
 *     ]},
 *     { "id": 2, "name": "Kebab", "products": [...] }
 *   ]
 */
app.get('/api/menus', async (req, res) => {
  try {
    // findMany = ambil semua baris dari tabel Category
    // include: { products: true } = sekalian ambil produk yang terkait kategori ini (JOIN)
    const categories = await prisma.category.findMany({ include: { products: true } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

/**
 * POST /api/products
 * Tambah produk menu baru ke database.
 *
 * DIPAKAI OLEH: Admin Dashboard (fitur "Tambah Menu" - belum diimplementasi di UI)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/products', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ name: 'Menu Baru', price: 15000, categoryId: 1, image_url: 'foto.jpg' })
 *   })
 *
 * BODY YANG DIKIRIM:
 *   { name: string, price: number, categoryId: number, image_url: string }
 */
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, categoryId, image_url } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        price: parseInt(price),       // parseInt karena frontend mungkin kirim sebagai string
        categoryId: parseInt(categoryId),
        image_url: image_url || 'placeholder.jpg'  // fallback kalau ga ada gambar
      }
    });
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambah menu" });
  }
});

/**
 * PUT /api/products/:id
 * Edit produk menu yang sudah ada di database.
 *
 * DIPAKAI OLEH: Admin Dashboard (fitur edit - endpoint tersedia tapi UI edit sudah dihapus)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/products/5', {
 *     method: 'PUT',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ name: 'Nama Baru', price: 25000, categoryId: 2, image_url: 'baru.jpg' })
 *   })
 *
 * PARAMETER URL:
 *   :id → ID produk yang mau diedit (contoh: /api/products/5 = edit produk ID 5)
 */
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, price, categoryId, image_url } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: productId },       // cari produk berdasarkan ID
      data: {                         // data yang mau diupdate
        name: name,
        price: parseInt(price),
        categoryId: parseInt(categoryId),
        image_url: image_url
      }
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengedit menu" });
  }
});

/**
 * DELETE /api/products/:id
 * Hapus produk menu dari database.
 *
 * DIPAKAI OLEH: Admin Dashboard → tombol "Hapus" di kartu katalog menu
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/products/5', { method: 'DELETE' })
 *
 * PARAMETER URL:
 *   :id → ID produk yang mau dihapus
 */
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id: productId }
    });
    res.json({ message: "Menu berhasil dihapus!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menghapus menu" });
  }
});

// ============================================
// API ENDPOINTS - DATA CABANG / OUTLET
// ============================================

/**
 * GET /api/outlets
 * Ambil semua kota beserta cabang/outlet-nya.
 *
 * DIPAKAI OLEH:
 * - Landing Page → Coverage Section (peta jangkauan cabang ke visitor)
 * - Admin Dashboard → halaman Lokasi (kelola cabang)
 *
 * CARA FRONTEND PANGGIL:
 *   const res = await fetch(API_BASE + '/api/outlets')
 *   const data = await res.json()
 *   // data = [{ id, name, outlets: [{ id, name, address, gmaps_url, cityId }] }, ...]
 */
app.get('/api/outlets', async (req, res) => {
  try {
    // Ambil semua kota, sekalian ambil outlet yang ada di kota tersebut
    const citiesAndOutlets = await prisma.city.findMany({
      include: { outlets: true },
    });
    res.json(citiesAndOutlets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data outlet" });
  }
});

/**
 * POST /api/outlets
 * Tambah cabang baru ke database.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Lokasi (form tambah cabang)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/outlets', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ name: 'Cabang Baru', address: 'Jl. ...', gmaps_url: '...', cityId: 1 })
 *   })
 */
app.post('/api/outlets', async (req, res) => {
  try {
    const { name, address, gmaps_url, cityId } = req.body;

    const newOutlet = await prisma.outlet.create({
      data: {
        name: name,
        address: address,
        gmaps_url: gmaps_url,
        cityId: parseInt(cityId)
      }
    });
    res.json(newOutlet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambah data cabang" });
  }
});

/**
 * DELETE /api/outlets/:id
 * Hapus cabang dari database.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Lokasi (tombol hapus cabang)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/outlets/5', { method: 'DELETE' })
 */
app.delete('/api/outlets/:id', async (req, res) => {
  try {
    const outletId = parseInt(req.params.id);
    await prisma.outlet.delete({
      where: { id: outletId }
    });
    res.json({ message: "Cabang berhasil dihapus!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menghapus data cabang" });
  }
});

// ============================================
// API ENDPOINTS - GALERI FOTO
// ============================================

/**
 * GET /api/gallery
 * Ambil semua foto galeri dari database (diurutkan berdasarkan ID).
 *
 * DIPAKAI OLEH:
 * - Landing Page → Gallery Section (grid foto dokumentasi)
 * - Admin Dashboard → halaman Galeri (kelola foto)
 *
 * CARA FRONTEND PANGGIL:
 *   const res = await fetch(API_BASE + '/api/gallery')
 *   const data = await res.json()
 *   // data = [{ id, image_url, note }, ...]
 */
app.get('/api/gallery', async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { id: 'asc' }   // urutkan dari yang paling lama ke paling baru
    });
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data galeri" });
  }
});

/**
 * POST /api/gallery
 * Upload/tambah foto baru ke galeri.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Galeri (form upload foto)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/gallery', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ image_url: 'foto-baru.jpg', note: 'Deskripsi foto' })
 *   })
 */
app.post('/api/gallery', async (req, res) => {
  try {
    const { image_url, note } = req.body;
    const newGallery = await prisma.gallery.create({
      data: { image_url, note }
    });
    res.json(newGallery);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah galeri" });
  }
});

/**
 * DELETE /api/gallery/:id
 * Hapus foto dari galeri.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Galeri (tombol hapus foto)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/gallery/3', { method: 'DELETE' })
 */
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const galleryId = parseInt(req.params.id);
    await prisma.gallery.delete({
      where: { id: galleryId }
    });
    res.json({ message: "Foto berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus galeri" });
  }
});

// ============================================
// API ENDPOINTS - HERO SLIDES (CAROUSEL BANNER)
// ============================================

/**
 * GET /api/hero-slides
 * Ambil semua slide carousel untuk hero section.
 *
 * DIPAKAI OLEH:
 * - Landing Page → Hero Section (carousel/banner geser otomatis)
 * - Admin Dashboard → halaman Hero (kelola slide banner)
 *
 * CARA FRONTEND PANGGIL:
 *   const res = await fetch(API_BASE + '/api/hero-slides')
 *   const data = await res.json()
 *   // data = [{ id, image_url, note }, ...]
 */
app.get('/api/hero-slides', async (req, res) => {
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { id: 'asc' } });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil hero slide" });
  }
});

/**
 * POST /api/hero-slides
 * Tambah slide banner baru ke hero section.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Hero (form tambah slide)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/hero-slides', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ image_url: 'banner-baru.jpg', note: 'Promo spesial' })
 *   })
 */
app.post('/api/hero-slides', async (req, res) => {
  try {
    const { image_url, note } = req.body;
    const newSlide = await prisma.heroSlide.create({
      data: { image_url, note }
    });
    res.json(newSlide);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah hero slide" });
  }
});

/**
 * DELETE /api/hero-slides/:id
 * Hapus slide banner dari hero section.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Hero (tombol hapus slide)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/hero-slides/2', { method: 'DELETE' })
 */
app.delete('/api/hero-slides/:id', async (req, res) => {
  try {
    const slideId = parseInt(req.params.id);
    await prisma.heroSlide.delete({ where: { id: slideId } });
    res.json({ message: "Slide berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus slide" });
  }
});

// ============================================
// API ENDPOINTS - PENGATURAN (SETTINGS)
// ============================================

/**
 * GET /api/settings/franchise-link
 * Ambil link franchise dari database (biasanya link WhatsApp).
 *
 * DIPAKAI OLEH:
 * - Landing Page → tombol "Gabung Franchise" di Hero Section (link ke WA)
 * - Admin Dashboard → halaman Settings (ubah link franchise)
 *
 * CARA FRONTEND PANGGIL:
 *   const res = await fetch(API_BASE + '/api/settings/franchise-link')
 *   const data = await res.json()
 *   // data = { id, key: "franchise_link", value: "https://wa.me/6281289222234" }
 *
 * CATATAN:
 * Kalau setting belum ada di database, otomatis dibuat dengan nilai default.
 */
app.get('/api/settings/franchise-link', async (req, res) => {
  try {
    // findUnique = cari berdasarkan field yang unique (key)
    let link = await prisma.setting.findUnique({ where: { key: 'franchise_link' } });
    // Kalau belum ada di database, buat otomatis dengan nilai default
    if (!link) {
      link = await prisma.setting.create({
        data: { key: 'franchise_link', value: 'https://wa.me/6281289222234' }
      });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil link franchise" });
  }
});

/**
 * POST /api/settings/franchise-link
 * Update link franchise di database.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Settings (form ubah link franchise)
 *
 * CARA FRONTEND PANGGIL:
 *   await fetch(API_BASE + '/api/settings/franchise-link', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ value: 'https://wa.me/628123456789' })
 *   })
 *
 * CATATAN:
 * Pakai upsert = update kalau sudah ada, create kalau belum ada.
 * Jadi ga perlu cek manual apakah setting sudah ada atau belum.
 */
app.post('/api/settings/franchise-link', async (req, res) => {
  try {
    const { value } = req.body;
    // upsert = UPDATE kalau sudah ada, inSERT (create) kalau belum
    const link = await prisma.setting.upsert({
      where: { key: 'franchise_link' },
      update: { value: value },      // data yang diupdate kalau sudah ada
      create: { key: 'franchise_link', value: value },  // data baru kalau belum ada
    });
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: "Gagal update link franchise" });
  }
});

// ============================================
// INISIALISASI AKUN ADMIN DEFAULT
// ============================================

/**
 * Fungsi ini jalan otomatis saat server start.
 * Cek apakah sudah ada akun admin di database.
 * Kalau belum ada, buat akun admin default:
 *   username: admin
 *   password: password123
 *
 * PENTING: Setelah pertama kali deploy, segera ganti password default ini!
 */
async function initAdmin() {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      await prisma.admin.create({
        data: { username: 'admin', password: 'password123' }
      });
      console.log('Akun admin default otomatis dibuat! (username: admin, password: password123)');
    }
  } catch (error) {
    console.error("Gagal inisialisasi admin", error);
  }
}
initAdmin();

// ============================================
// API ENDPOINT - LOGIN (AUTENTIKASI ADMIN)
// ============================================

/**
 * POST /api/login
 * Cek kecocokan username dan password untuk login admin.
 *
 * DIPAKAI OLEH: Admin Dashboard → halaman Login (LoginView.vue)
 *
 * CARA FRONTEND PANGGIL:
 *   const res = await fetch(API_BASE + '/api/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ username: 'admin', password: 'password123' })
 *   })
 *   // Sukses: { message: "Login sukses", token: "..." }
 *   // Gagal:  status 401, { error: "Username atau password salah!" }
 *
 * CATATAN KEAMANAN:
 * - Saat ini password disimpan plain text (belum di-hash) → harus diperbaiki
 * - Token yang dikirim masih statis → harus diganti JWT yang proper
 */
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari admin di database berdasarkan username
    const admin = await prisma.admin.findUnique({ where: { username } });

    // Cek apakah admin ada dan passwordnya cocok
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Username atau password salah!" });
    }

    // Kalau cocok, kirim token (seharusnya pakai JWT, tapi masih statis untuk sekarang)
    res.json({ message: "Login sukses", token: "token-resmi-kebab-hejo-123" });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// ============================================
// START SERVER
// ============================================

/**
 * Jalankan server di port yang ditentukan.
 * - Di lokal: pakai port 3000 (default)
 * - Di Railway: pakai port dari environment variable PORT (otomatis diatur Railway)
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Backend kebab nyala di http://localhost:' + PORT);
});
