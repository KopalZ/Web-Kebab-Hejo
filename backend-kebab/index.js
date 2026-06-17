const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

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

// Menyalakan server
app.listen(3000, () => {
  console.log('Backend kebab nyala di http://localhost:3000');
});