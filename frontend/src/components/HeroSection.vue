<script setup>
import { ShieldCheck, MapPin } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import ScrollReveal from './ScrollReveal.vue'
import logo from '@/assets/logo.jpeg'

const floatingBadges = [
  { icon: ShieldCheck, text: "Halal Certified", delay: 0 },
  { icon: MapPin, text: "Produk Lokal Indonesia", delay: 200 },
]
</script>

<template>
  <section class="relative min-h-screen bg-[#65be3e] overflow-hidden pt-16 lg:pt-20">
    <!-- Green pattern background -->
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none" 
         :style="{ backgroundImage: `url(${logo})`, backgroundSize: '200px', backgroundRepeat: 'repeat', mixBlendMode: 'multiply' }">
    </div>

    <!-- Desktop Wavy Yellow -->
    <svg class="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1000 1000">
      <!-- M0,0 to L400,0 then curve to L0,1000 -->
      <path d="M0,0 L380,0 C600,300 200,700 400,1000 L0,1000 Z" fill="#ffd339" stroke="black" stroke-width="3" vector-effect="non-scaling-stroke"/>
    </svg>
    <!-- Mobile Solid Yellow -->
    <div class="lg:hidden absolute top-0 left-0 w-full h-[65%] bg-[#ffd339] border-b-[3px] border-black z-0"></div>

    <div class="relative w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 h-full min-h-[calc(100vh-5rem)] flex items-center z-10 lg:max-w-none lg:mx-0">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center w-full py-12">
        <!-- Left Content -->
        <ScrollReveal animation="fade-right" :duration="800" class="text-center lg:text-left pt-10 lg:pt-0 lg:max-w-[480px] xl:max-w-[500px]">
          <!-- Badges -->
          <div class="flex flex-wrap gap-3 justify-center lg:justify-start mb-5">
            <ScrollReveal
              v-for="(badge, index) in floatingBadges"
              :key="index"
              animation="fade-up"
              :delay="badge.delay"
              :duration="500"
            >
              <div class="inline-flex items-center gap-2 bg-[#02a554] text-white text-sm font-medium px-4 py-2.5 rounded-full border-2 border-black shadow-[0_4px_0_rgba(0,0,0,1)]">
                <component :is="badge.icon" size="16" />
                <span>{{ badge.text }}</span>
              </div>
            </ScrollReveal>
          </div>

          <!-- Title -->
          <ScrollReveal animation="fade-up" :delay="300" :duration="800">
            <h1 class="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#1e1e1e] leading-[1.2] mb-5">
              Franchise Kebab <br/>
              Modern Cita Rasa Indonesia
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" :delay="500" :duration="800">
            <p class="text-sm sm:text-base text-[#1e1e1e] max-w-[440px] mx-auto lg:mx-0 leading-[1.5] mb-6 font-medium">
              Investasi terjangkau, menu beragam, dukungan <br class="hidden sm:block" />
              bisnis penuh. Cocok untuk pemula yang ingin <br class="hidden sm:block" />
              memulai bisnis kuliner.
            </p>
          </ScrollReveal>

          <!-- Buttons -->
          <ScrollReveal animation="fade-up" :delay="700" :duration="800">
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                as="a"
                href="#franchise"
                class="inline-flex items-center justify-center h-[48px] px-8 bg-[#65be3e] hover:bg-[#5aad38] text-white font-medium rounded-2xl border-[3px] border-black shadow-[0_4px_0_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
              >
                Gabung Franchise
              </Button>
              <Button
                as="a"
                href="#menu"
                class="inline-flex items-center justify-center h-[48px] px-8 bg-[#65be3e] hover:bg-[#5aad38] text-white font-medium rounded-2xl border-[3px] border-black shadow-[0_4px_0_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
              >
                Jelajahi Menu
              </Button>
            </div>
          </ScrollReveal>
        </ScrollReveal>

        <!-- Right Content - Gerobak -->
        <ScrollReveal
          animation="zoom-in"
          :delay="400"
          :duration="800"
          class="relative flex items-center justify-center lg:justify-end mt-6 lg:mt-0"
        >
          <div class="gerobak-illustration relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] pb-10 sm:pb-12">
            <!-- Atap -->
            <div
              class="relative z-30 -mx-[5%] h-10 sm:h-11 bg-[#ffd339] border-[3px] border-black rounded-t-[10px]"
              style="box-shadow: 0 16px 4px rgba(0, 0, 0, 0.25)"
            />

            <!-- Badan utama -->
            <div class="relative z-20 bg-[#ffd339] border-x-[3px] border-black min-h-[240px] sm:min-h-[280px] flex items-center justify-center px-3 py-4">
              <img
                :src="logo"
                alt="Grand Kebab Hejo"
                class="relative z-10 w-[78%] sm:w-[72%] max-w-[360px] object-contain"
              />

              <!-- Garis zigzag horizontal -->
              <svg
                class="absolute left-[3%] right-[3%] top-[54%] -translate-y-1/2 w-[94%] h-7 z-20 pointer-events-none"
                viewBox="0 0 420 24"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <polyline
                  points="0,12 28,4 56,20 84,4 112,20 140,4 168,20 196,4 224,20 252,4 280,20 308,4 336,20 364,4 392,20 420,12"
                  stroke="#e53935"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <!-- Panel bawah + tombol segitiga -->
            <div
              class="relative z-20 bg-[#ffd339] border-x-[3px] border-b-[3px] border-black h-14 sm:h-16 rounded-b-2xl flex items-center justify-center gap-16 sm:gap-24"
              style="box-shadow: 0 16px 4px rgba(0, 0, 0, 0.25)"
            >
              <svg width="38" height="30" viewBox="0 0 38 30" class="drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" aria-hidden="true">
                <polygon points="38,0 38,30 0,15" fill="#65be3e" stroke="#1e1e1e" stroke-width="2.5" stroke-linejoin="round" />
              </svg>
              <svg width="38" height="30" viewBox="0 0 38 30" class="drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" aria-hidden="true">
                <polygon points="0,0 0,30 38,15" fill="#65be3e" stroke="#1e1e1e" stroke-width="2.5" stroke-linejoin="round" />
              </svg>
            </div>

            <!-- Roda Kanan (outer black tire, inner white hub cap to match Desktop1.vue) -->
            <div
              class="absolute z-40 bottom-0 right-[8%] w-[118px] h-[118px] sm:w-[136px] sm:h-[136px] rounded-full bg-[#1e1e1e] border-[5px] sm:border-[6px] border-black flex items-center justify-center"
              style="box-shadow: 0 8px 4px rgba(0, 0, 0, 0.25)"
            >
              <div class="w-[65%] h-[65%] rounded-full bg-white border-[4px] border-black shadow-inner" />
            </div>

            <!-- Pegangan kiri -->
            <div
              class="absolute z-10 bottom-[52px] sm:bottom-[58px] left-[-18px] sm:left-[-28px] w-[88px] sm:w-[108px] h-[5px] bg-[#1e1e1e] rotate-[34deg] origin-right rounded-full"
              aria-hidden="true"
            />
            <div
              class="absolute z-20 bottom-[22px] sm:bottom-[26px] left-[-30px] sm:left-[-40px] w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-[3px] border-black"
              aria-hidden="true"
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gerobak-illustration {
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.2));
}
</style>
