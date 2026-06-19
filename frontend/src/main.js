/**
 * Main Entry Point - Frontend Landing Page
 *
 * File ini adalah titik awal aplikasi Vue.js.
 * Yang dilakukan:
 * 1. Bikin instance Vue app
 * 2. Pasang router (biar bisa navigasi antar halaman)
 * 3. Import CSS global (styling dasar buat semua halaman)
 * 4. Mount app ke elemen <div id="app"> di index.html
 *
 * STRUKTUR FILE:
 *   main.js (file ini) → bikin Vue app
 *   ├── App.vue        → component root (wrapper semua halaman)
 *   ├── router/        → konfigurasi routing (URL → halaman mana)
 *   └── assets/        → CSS global
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/globals.css'

// Bikin instance Vue dan pasang router
const app = createApp(App)
app.use(router)
// Mount ke elemen #app di index.html (semua konten Vue di-render di sini)
app.mount('#app')
