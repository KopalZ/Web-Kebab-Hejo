<!--
  ==================================================================
  DashboardLayout.vue — Layout Utama (Wrapper) Seluruh Halaman Admin
  ==================================================================

  FUNGSI HALAMAN INI:
  Sebagai "bungkus" (layout) yang menampilkan:
  1. Header atas — Logo Kebab Hejo + judul + tombol Keluar
  2. Sidebar kiri — Menu navigasi ke setiap modul dashboard
  3. Area konten kanan — Menampilkan halaman yang sedang aktif (<RouterView>)

  SEMUA HALAMAN ADMIN menggunakan layout ini sebagai wrapper,
  kecuali halaman Login (LoginView.vue punya layout sendiri).

  STRUKTUR TAMPILAN:
  ┌──────────────────────────────────────────────────────────┐
  │  HEADER: Logo + Judul + Tombol Keluar                    │
  ├────────────┬─────────────────────────────────────────────┤
  │            │                                             │
  │  SIDEBAR   │   KONTEN HALAMAN                            │
  │  - Dashboard│   (berubah-ubah tergantung menu yang       │
  │  - Hero     │    dipilih di sidebar)                     │
  │  - Tentang  │                                             │
  │  - Menu     │   Diisi oleh <RouterView /> yang           │
  │  - Jangkauan│   me-render view sesuai route aktif       │
  │  - Galeri   │                                             │
  │            │                                             │
  └────────────┴─────────────────────────────────────────────┘

  NAVIGASI SIDEBAR (Route yang tersedia):
  ┌────────────────┬──────────┬──────────────────────────────┐
  │ Label          │ Route    │ View yang di-render          │
  ├────────────────┼──────────┼──────────────────────────────┤
  │ Dashboard      │ /        │ HomeView.vue                 │
  │ Hero Page      │ /hero    │ HeroView.vue                 │
  │ Tentang        │ /tentang │ TentangView.vue              │
  │ Katalog Menu   │ /menu    │ MenuView.vue                 │
  │ Jangkauan      │ /lokasi  │ LokasiView.vue               │
  │ Galeri         │ /galeri  │ GaleriView.vue               │
  └────────────────┴──────────┴──────────────────────────────┘

  FITUR LOGOUT:
  - Klik tombol "Keluar" → muncul konfirmasi
  - Jika admin konfirmasi, token dihapus dari localStorage & sessionStorage
  - Admin diarahkan kembali ke halaman /login

  TIDAK ADA KONEKSI LANGSUNG KE BACKEND:
  Layout ini tidak melakukan fetch data ke API.
  Yang melakukan fetch adalah masing-masing View di dalam <RouterView>.
-->
<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Image,
  UtensilsCrossed,
  MapPin,
  Images,
  LogOut
} from 'lucide-vue-next'
import logoImg from '@/assets/logo.jpeg'

const router = useRouter()

// Daftar menu navigasi yang tampil di sidebar
// Setiap item punya: route tujuan, nama route, label tampil, icon, dan flag exact
const navItems = [
  { to: '/', name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/hero', name: 'hero', label: 'Hero Page', icon: Image },
  { to: '/menu', name: 'menu', label: 'Katalog Menu', icon: UtensilsCrossed },
  { to: '/lokasi', name: 'lokasi', label: 'Jangkauan', icon: MapPin },
  { to: '/galeri', name: 'galeri', label: 'Galeri', icon: Images }
]

function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    localStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_token')
    router.push('/login')
  }
}
</script>

<template>
  <div class="dashboard-page">
    <header class="dashboard-header">
      <div class="dashboard-header__logo-container">
        <img :src="logoImg" alt="Kebab Hejo Logo" class="dashboard-header__logo-img" />
        <span class="dashboard-header__logo-text">
          Kebab <span class="text-yellow">Hejo</span>
        </span>
      </div>
      <h1 class="dashboard-header__title">
        Selamat Datang di Dashboard Grand Kebab Hejo
      </h1>
      <button type="button" class="btn-logout" @click="handleLogout">
        <LogOut :size="18" style="display: inline; vertical-align: middle; margin-right: 6px" />
        Keluar
      </button>
    </header>

    <div class="dashboard-body">
      <aside class="dashboard-sidebar">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="sidebar-link"
          :class="{
            'sidebar-link--active': $route.name === item.name,
            'sidebar-link--dashboard': item.name === 'dashboard'
          }"
        >
          <component :is="item.icon" :size="item.name === 'dashboard' ? 24 : 20" />
          {{ item.label }}
        </RouterLink>
      </aside>

      <main class="dashboard-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
