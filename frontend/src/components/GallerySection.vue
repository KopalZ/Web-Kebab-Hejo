<script setup>
import ScrollReveal from './ScrollReveal.vue'

// Kita tambahkan properti 'image' yang mengarah ke file di folder public
const galleryImages = [
  { id: 1, title: "Booth Modern", image: "/galeri1.jpeg" },
  { id: 2, title: "Menu Kebab", image: "/galeri2.jpeg" },
  { id: 3, title: "Happy Partner", image: "/galeri3.jpeg" },
  { id: 4, title: "Grand Opening", image: "/galeri4.jpeg" },
  { id: 5, title: "Kebab Jumbo", image: "/galeri5.jpeg" },
  { id: 6, title: "Team Training", image: "/galeri6.jpeg" },
  { id: 7, title: "Customer Happy", image: "/galeri7.jpeg" },
  { id: 8, title: "Outlet Malam", image: "/galeri8.jpeg" },
  { id: 9, title: "Franchise Event", image: "/galeri9.jpeg" },
  { id: 10, title: "Produk Fresh", image: "/galeri10.jpeg" },
]
</script>

<template>
  <section id="gallery" class="section-brand py-16 lg:py-24 border-t-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up" :duration="600" class="mb-10">
        <h2 class="section-brand-title tracking-tight">Galeri Grand Kebab Hejo</h2>
      </ScrollReveal>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        <ScrollReveal
          v-for="(image, index) in galleryImages"
          :key="image.id"
          animation="fade-up"
          :delay="index * 60"
          :duration="500"
        >
          <div class="group relative aspect-[251/230] rounded-3xl overflow-hidden border-2 border-black shadow-[0_8px_4px_rgba(0,0,0,0.25)] cursor-pointer">
            <img
              :src="image.image"
              :alt="image.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-[#65be3e]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p class="text-white font-semibold text-sm sm:text-base px-2 text-center">{{ image.title }}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>