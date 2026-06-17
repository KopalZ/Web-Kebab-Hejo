<script setup>
import {
  UtensilsCrossed,
  BadgeDollarSign,
  Store,
  Headphones,
  Sparkles,
  GraduationCap
} from 'lucide-vue-next'
import ScrollReveal from './ScrollReveal.vue'

const uspItems = [
  { icon: UtensilsCrossed, title: "Menu Beragam", description: "Kebab, Burger, Hotdog, Pizza, Roti Canai, dan masih banyak lagi" },
  { icon: BadgeDollarSign, title: "Harga Terjangkau", description: "Modal kecil, untung besar. Cocok untuk semua kalangan" },
  { icon: Store, title: "Booth Menarik", description: "Desain booth modern dan eye-catching untuk menarik pelanggan" },
  { icon: Headphones, title: "Support Franchise", description: "Dukungan penuh dari tim untuk kesuksesan bisnis Anda" },
  { icon: Sparkles, title: "Bahan Berkualitas", description: "Bahan baku pilihan untuk kualitas rasa terbaik" },
  { icon: GraduationCap, title: "Cocok Pemula", description: "Training lengkap untuk Anda yang baru memulai bisnis" },
]
</script>

<template>
  <section class="section-brand py-16 lg:py-24 border-t-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up" :duration="600" class="text-center max-w-3xl mx-auto mb-12">
        <span class="section-brand-label">Keunggulan Kami</span>
        <h2 class="mt-3 section-brand-title">
          Kenapa Pilih Grand Kebab Hejo?
        </h2>
        <p class="mt-4 text-base text-white/90">
          Berbagai keuntungan menjadi mitra Grand Kebab Hejo yang akan mendukung kesuksesan bisnis Anda
        </p>
      </ScrollReveal>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <ScrollReveal
          v-for="(item, index) in uspItems"
          :key="index"
          animation="fade-up"
          :delay="index * 100"
          :duration="500"
        >
          <div class="card-brand h-full p-6 lg:p-8 flex flex-col gap-4">
            <div class="icon-box-brand">
              <component :is="item.icon" class="w-5 h-5 text-[#1e1e1e]" />
            </div>
            <h3 class="text-xl font-bold text-[#1e1e1e]">{{ item.title }}</h3>
            <p class="text-sm text-[#2c2c2c] leading-relaxed">{{ item.description }}</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>
