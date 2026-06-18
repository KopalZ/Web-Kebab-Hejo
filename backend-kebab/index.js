const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient(); 
const app = express();

app.use(cors());
app.use(express.json());

// --- API 1: Buat ambil data menu ---
app.get('/api/menus', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { products: true } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// --- API 2: Buat ambil data lokasi cabang (INI YANG BIKIN ERROR KALAU NGGAK ADA) ---
app.get('/api/outlets', async (req, res) => {
  try {
    const citiesAndOutlets = await prisma.city.findMany({
      include: { outlets: true },
    });
    res.json(citiesAndOutlets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data outlet" });
  }
});

// --- API 3: Buat nambah lokasi baru dari Admin ---
app.post('/api/outlets', async (req, res) => {
  try {
    // Ngambil data yang dikirim dari Vue Admin
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

// --- API 4: Buat ngapus lokasi dari Admin ---
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

// --- API 5: Buat nambah Menu baru dari Admin ---
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, categoryId, image_url } = req.body;
    const newProduct = await prisma.product.create({
      data: { 
        name: name, 
        price: parseInt(price), 
        categoryId: parseInt(categoryId), 
        image_url: image_url || 'placeholder.jpg'
      }
    });
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambah menu" });
  }
});

// --- API 6: Buat ngapus Menu dari Admin ---
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

// --- API 6b: Buat edit Menu dari Admin ---
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, price, categoryId, image_url } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
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

// --- API 7: Ambil data Galeri ---
app.get('/api/gallery', async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data galeri" });
  }
});

// --- API 8: Nambah foto ke Galeri ---
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

// --- API 9: Ngapus foto dari Galeri ---
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

// --- API 10: Ambil data Hero Slide ---
app.get('/api/hero-slides', async (req, res) => {
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { id: 'asc' } });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil hero slide" });
  }
});

// --- API 11: Tambah Hero Slide ---
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

// --- API 12: Hapus Hero Slide ---
app.delete('/api/hero-slides/:id', async (req, res) => {
  try {
    const slideId = parseInt(req.params.id);
    await prisma.heroSlide.delete({ where: { id: slideId } });
    res.json({ message: "Slide berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus slide" });
  }
});

// --- API 13: Ambil Link Franchise ---
app.get('/api/settings/franchise-link', async (req, res) => {
  try {
    let link = await prisma.setting.findUnique({ where: { key: 'franchise_link' } });
    // Kalau belum ada di database, kita kasih nilai default
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

// --- API 14: Update Link Franchise dari Admin ---
app.post('/api/settings/franchise-link', async (req, res) => {
  try {
    const { value } = req.body;
    const link = await prisma.setting.upsert({
      where: { key: 'franchise_link' },
      update: { value: value },
      create: { key: 'franchise_link', value: value },
    });
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: "Gagal update link franchise" });
  }
});

async function initAdmin() {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      await prisma.admin.create({
        data: { username: 'admin', password: 'password123' }
      });
      console.log('✅ Akun admin default otomatis dibuat! (username: admin, password: password123)');
    }
  } catch (error) {
    console.error("Gagal inisialisasi admin", error);
  }
}
initAdmin();

// API Login untuk mengecek kecocokan data
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Cari admin di database berdasarkan username
    const admin = await prisma.admin.findUnique({ where: { username } });

    // Cek apakah admin ada dan passwordnya cocok
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Username atau password salah!" });
    }

    // Kalau cocok, kasih token (bisa dikembangkan jadi JWT nantinya)
    res.json({ message: "Login sukses", token: "token-resmi-kebab-hejo-123" });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// Menyalakan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Backend kebab nyala di http://localhost:' + PORT);
});