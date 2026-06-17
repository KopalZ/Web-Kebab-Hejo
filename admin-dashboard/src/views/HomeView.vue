<script setup>
import { RouterLink } from 'vue-router'
import { Image, Info, UtensilsCrossed, MapPin, Images } from 'lucide-vue-next'

const sections = [
  {
    to: '/hero',
    title: 'Hero Page',
    desc: 'Kelola banner slide & link franchise',
    icon: Image
  },
  {
    to: '/tentang',
    title: 'Tentang',
    desc: 'Ubah media halaman tentang kami',
    icon: Info
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
