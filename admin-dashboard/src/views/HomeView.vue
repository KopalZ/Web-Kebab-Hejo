<!--
  ================================================================
  HomeView.vue — Halaman Utama (Beranda) Dashboard Admin
  ================================================================

  FUNGSI HALAMAN INI:
  Menampilkan kartu navigasi ke setiap modul dashboard admin.
  Ini adalah halaman pertama yang muncul setelah admin login berhasil.

  KARTU MODUL YANG DITAMPILKAN:
  ┌──────────────────────────────────────────────────────────────┐
  │ Modul          │ Route   │ Fungsi                            │
  ├──────────────────────────────────────────────────────────────┤
  │ Hero Page      │ /hero   │ Kelola banner slide & link WA     │
  │ Tentang        │ /tentang│ Kelola halaman tentang kami       │
  │ Katalog Menu   │ /menu   │ Kelola produk menu (tambah/hapus) │
  │ Jangkauan      │ /lokasi │ Kelola kota dan outlet            │
  │ Galeri         │ /galeri │ Kelola foto galeri                │
  └──────────────────────────────────────────────────────────────┘

  TIDAK ADA KONEKSI KE BACKEND:
  Halaman ini murni navigasi, tidak melakukan fetch data ke API.
  Setiap kartu menggunakan <RouterLink> untuk pindah halaman
  tanpa reload (SPA - Single Page Application).

  ICON menggunakan library lucide-vue-next:
  - Image, Info, UtensilsCrossed, MapPin, Images
-->
<script setup>
import { RouterLink } from 'vue-router'
import { Image, UtensilsCrossed, MapPin, Images } from 'lucide-vue-next'

// Daftar kartu navigasi modul dashboard
// Setiap item punya: route tujuan, judul, deskripsi, dan icon
const sections = [
  {
    to: '/hero',
    title: 'Hero Page',
    desc: 'Kelola banner slide & link franchise',
    icon: Image
  },
  {
    to: '/menu',
    title: 'Katalog Menu',
    desc: 'Tambah, edit, hapus produk menu',
    icon: UtensilsCrossed
  },
  {
    to: '/lokasi',
    title: 'Jangkauan',
    desc: 'Kelola kota dan outlet',
    icon: MapPin
  },
  {
    to: '/galeri',
    title: 'Galeri',
    desc: 'Atur foto galeri landing page',
    icon: Images
  }
]
</script>

<template>
  <div>
    <h2 class="page-title">Dashboard</h2>
    <p style="margin: 0 0 24px; opacity: 0.9">
      Pilih modul di bawah untuk mengelola konten website Grand Kebab Hejo.
    </p>
    <div class="overview-grid">
      <RouterLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        class="overview-card"
      >
        <component :is="section.icon" :size="32" />
        <div class="overview-card__title">{{ section.title }}</div>
        <div class="overview-card__desc">{{ section.desc }}</div>
      </RouterLink>
    </div>
  </div>
</template>
