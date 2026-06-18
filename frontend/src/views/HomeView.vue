<script setup>
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
