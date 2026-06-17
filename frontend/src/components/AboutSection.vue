<script setup>
import { UtensilsCrossed, Store, BadgeDollarSign } from 'lucide-vue-next'
import ScrollReveal from './ScrollReveal.vue'
import gerobakImg from '@/assets/gerobak.png'

const highlights = [
  { icon: UtensilsCrossed, title: "Menu Beragam", desc: "Berbagai pilihan menu favorit" },
  { icon: Store, title: "Outlet Menarik", desc: "Desain menarik & eyecatching" },
  { icon: BadgeDollarSign, title: "Harga Terjangkau", desc: "Cocok untuk semua kalangan" },
]
</script>

<template>
  <section id="about" class="section-brand py-16 lg:py-24 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Left - Feature image card -->
        <ScrollReveal animation="fade-left" :duration="800" class="relative">
          <div class="card-brand p-4 lg:p-6">
            <div class="relative overflow-hidden rounded-3xl border-2 border-black aspect-[4/3] bg-[#ffca10]">
              <img
                :src="gerobakImg"
                alt="Gerobak Grand Kebab Hejo"
                class="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </ScrollReveal>

        <!-- Right - Content -->
        <ScrollReveal animation="fade-right" :duration="800">
          <span class="section-brand-label">Tentang Kami</span>

          <h2 class="mt-3 text-[32px] sm:text-[40px] font-bold text-[#f5f5f5] leading-[1.2]">
            Grand Kebab Hejo<br />
            Rasa Lokal Indonesia
          </h2>

          <p class="mt-6 text-base text-white leading-relaxed max-w-[484px]">
            Grand Kebab Hejo hadir sebagai franchise makanan modern dengan sentuhan cita rasa Indonesia.
            Kami menyediakan berbagai menu kebab, burger, hotdog, pizza, dan masih banyak lagi dengan
            harga yang terjangkau dan kualitas terjamin.
          </p>

          <!-- USP rows -->
          <div class="mt-8 space-y-5">
            <div
              v-for="(item, index) in highlights"
              :key="index"
              class="flex items-center gap-3"
            >
              <div class="icon-box-brand">
                <component :is="item.icon" class="w-5 h-5 text-[#1e1e1e]" />
              </div>
              <div>
                <h4 class="font-semibold text-[#f5f5f5] text-xl leading-tight">{{ item.title }}</h4>
                <p class="text-sm text-white/90 leading-snug">{{ item.desc }}</p>
              </div>
              <div
                v-if="index === 2"
                class="ml-auto w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shrink-0"
              >
                <span class="text-[10px] font-bold text-white">Rp</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>
