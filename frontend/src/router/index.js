/**
 * Router Configuration - Frontend Landing Page
 *
 * File ini ngatur routing: URL mana nampilin halaman mana.
 * Saat ini cuma ada 1 halaman (HomeView) yang berisi semua section.
 *
 * CARA KERJA:
 * - Visitor buka https://domain.com/ → tampilkan HomeView (landing page)
 * - HomeView berisi semua section: Hero, Menu, About, Gallery, dll
 * - Navigasi antar section pakai scroll (anchor link #menu, #about, dll)
 *
 * TAMBAH HALAMAN BARU:
 *   import HalamanBaru from '../views/HalamanBaru.vue'
 *   const routes = [
 *     { path: '/', component: HomeView },
 *     { path: '/halaman-baru', component: HalamanBaru }  ← tambah di sini
 *   ]
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Daftar route: mapping URL → component Vue yang ditampilkan
const routes = [
  {
    path: '/',           // URL: / (root/homepage)
    name: 'home',
    component: HomeView  // Component yang di-render
  }
]

// Bikin router instance
// createWebHistory = pakai URL tanpa hash (#), contoh: /about bukan /#/about
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
