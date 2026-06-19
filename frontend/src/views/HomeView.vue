<script setup>
/**
 * HomeView.vue - Halaman Utama Landing Page
 *
 * File ini adalah halaman utama yang dilihat visitor.
 * Isinya cuma ngumpulin dan nyusun semua section component dari atas ke bawah:
 *
 *   1. Navbar          → navigasi atas (link ke section lain)
 *   2. HeroSection     → banner utama + carousel + CTA
 *   3. AboutSection    → tentang brand + keunggulan
 *   4. MenuSection     → daftar menu dari API backend (GET /api/menus)
 *   5. FranchiseSection → info franchise + kalkulator keuntungan
 *   6. CoverageSection → lokasi cabang dari API backend (GET /api/outlets)
 *   7. GallerySection  → galeri foto dokumentasi
 *   8. Footer          → info brand + kontak
 *   9. WhatsAppButton  → floating WA button
 *
 * KONEKSI KE BACKEND:
 *   Section yang pakai backend: MenuSection, CoverageSection, HeroSection
 *   Section yang statis: Navbar, AboutSection, FranchiseSection, GallerySection, Footer
 *
 * TAMBAH SECTION BARU:
 *   1. Bikin component baru di folder components/
 *   2. Import di sini
 *   3. Taruh di urutan yang diinginkan
 */
import Navbar from '@/components/Navbar.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import MenuSection from '@/components/MenuSection.vue'
import FranchiseSection from '@/components/FranchiseSection.vue'
import CoverageSection from '@/components/CoverageSection.vue'
import GallerySection from '@/components/GallerySection.vue'
import Footer from '@/components/Footer.vue'
import WhatsAppButton from '@/components/WhatsAppButton.vue'
</script>

<template>
  <main class="min-h-screen overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <MenuSection />
    <FranchiseSection />
    <CoverageSection />
    <GallerySection />
    <Footer />
    <WhatsAppButton />
  </main>
</template>
