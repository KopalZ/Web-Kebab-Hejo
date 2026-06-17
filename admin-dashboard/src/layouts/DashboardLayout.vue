<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Image,
  Info,
  UtensilsCrossed,
  MapPin,
  Images,
  LogOut
} from 'lucide-vue-next'
import logoImg from '@/assets/logo.jpeg'

const router = useRouter()

const navItems = [
  { to: '/', name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/hero', name: 'hero', label: 'Hero Page', icon: Image },
  { to: '/tentang', name: 'tentang', label: 'Tentang', icon: Info },
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
