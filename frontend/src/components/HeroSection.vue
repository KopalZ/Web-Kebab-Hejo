<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ShieldCheck, MapPin } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import ScrollReveal from './ScrollReveal.vue'
import logo from '@/assets/logo.jpeg'

const floatingBadges = [
  { icon: ShieldCheck, text: "Halal Certified", delay: 0 },
  { icon: MapPin, text: "Produk Lokal Indonesia", delay: 200 },
]

// Variabel API
const franchiseLink = ref('https://wa.me/6281289222234')
const slides = ref([])
const currentSlideIndex = ref(0)
let slideInterval = null

onMounted(async () => {
  try {
    const resLink = await fetch('http://localhost:3000/api/settings/franchise-link')
    const dataLink = await resLink.json()
    if (dataLink && dataLink.value) franchiseLink.value = dataLink.value
  } catch (e) { console.error("Gagal ambil link", e) }

  try {
    const resSlides = await fetch('http://localhost:3000/api/hero-slides')
    const dataSlides = await resSlides.json()
    if (dataSlides.length > 0) slides.value = dataSlides
  } catch (e) { console.error("Gagal ambil slide", e) }

  startAutoSlide()
})

onUnmounted(() => { clearInterval(slideInterval) })

function nextSlide() {
  if (slides.value.length <= 1) return
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length
  resetAutoSlide()
}

function prevSlide() {
  if (slides.value.length <= 1) return
  currentSlideIndex.value = (currentSlideIndex.value - 1 + slides.value.length) % slides.value.length
  resetAutoSlide()
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    if (slides.value.length > 1) {
      currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length
    }
  }, 3000)
}

function resetAutoSlide() {
  clearInterval(slideInterval)
  startAutoSlide()
}

const currentImage = computed(() => {
  if (slides.value.length === 0) return logo
  return '/' + slides.value[currentSlideIndex.value].image_url
})
</script>

<template>
  <section class="relative min-h-screen bg-[#65be3e] overflow-hidden pt-16 lg:pt-20">
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none" 
         :style="{ backgroundImage: `url(${logo})`, backgroundSize: '200px', backgroundRepeat: 'repeat', mixBlendMode: 'multiply' }">
    </div>

    <svg class="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1000 1000">
      <path d="M0,0 L380,0 C600,300 200,700 400,1000 L0,1000 Z" fill="#ffd339" stroke="black" stroke-width="3" vector-effect="non-scaling-stroke"/>
    </svg>
    <div class="lg:hidden absolute top-0 left-0 w-full h-[65%] bg-[#ffd339] border-b-[3px] border-black z-0"></div>

    <div class="relative w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 h-full min-h-[calc(100vh-5rem)] flex items-center z-10 lg:max-w-none lg:mx-0">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center w-full py-12">
        
        <!-- Kiri -->
        <ScrollReveal animation="fade-right" :duration="800" class="text-center lg:text-left pt-10 lg:pt-0 lg:max-w-[480px] xl:max-w-[500px]">
          <div class="flex flex-wrap gap-3 justify-center lg:justify-start mb-5">
            <ScrollReveal v-for="(badge, index) in floatingBadges" :key="index" animation="fade-up" :delay="badge.delay" :duration="500">
              <div class="inline-flex items-center gap-2 bg-[#02a554] text-white text-sm font-medium px-4 py-2.5 rounded-full border-2 border-black shadow-[0_4px_0_rgba(0,0,0,1)]">
                <component :is="badge.icon" size="16" />
                <span>{{ badge.text }}</span>
              </div>
            </ScrollReveal>
          </div>

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

          <ScrollReveal animation="fade-up" :delay="700" :duration="800">
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button as="a" :href="franchiseLink" target="_blank" class="inline-flex items-center justify-center h-[48px] px-8 bg-[#65be3e] hover:bg-[#5aad38] text-white font-medium rounded-2xl border-[3px] border-black shadow-[0_4px_0_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                Gabung Franchise
              </Button>
              <Button as="a" href="#menu" class="inline-flex items-center justify-center h-[48px] px-8 bg-[#65be3e] hover:bg-[#5aad38] text-white font-medium rounded-2xl border-[3px] border-black shadow-[0_4px_0_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                Jelajahi Menu
              </Button>
            </div>
          </ScrollReveal>
        </ScrollReveal>

        <!-- Kanan - Gerobak -->
        <ScrollReveal animation="zoom-in" :delay="400" :duration="800" class="relative flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
          
          <!-- Tambahin margin-left (ml-8) biar pegangannya ga kepotong di layar kecil -->
          <div class="gerobak-illustration relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] pb-12 sm:pb-16 ml-8">
            
            <!-- Atap -->
            <div class="relative z-30 -mx-[5%] h-10 sm:h-11 bg-[#ffd339] border-[3px] border-black rounded-t-[10px]" style="box-shadow: 0 16px 4px rgba(0, 0, 0, 0.25)" />

            <!-- Badan utama (Papan Iklan) -->
            <div class="relative z-20 bg-[#ffd339] border-x-[3px] border-black min-h-[240px] sm:min-h-[280px] flex flex-col items-center justify-center px-3 py-6">
              
              <!-- Bingkai Foto -->
              <div class="relative z-30 w-[88%] sm:w-[84%] max-w-[400px] h-[160px] sm:h-[190px] bg-white border-[4px] border-black rounded-xl p-1 shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)]">
                <transition name="fade" mode="out-in">
                  <img :key="currentSlideIndex" :src="currentImage" alt="Promo Kebab Hejo" class="w-full h-full object-cover rounded-lg" />
                </transition>
              </div>
              
              <!-- Garis merah zigzag DI BAWAH foto -->
              <svg class="w-[88%] sm:w-[84%] h-5 sm:h-6 mt-5 z-20 pointer-events-none opacity-90" viewBox="0 0 420 24" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <polyline points="0,12 28,4 56,20 84,4 112,20 140,4 168,20 196,4 224,20 252,4 280,20 308,4 336,20 364,4 392,20 420,12" stroke="#e53935" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <!-- Panel bawah + Tombol Kiri Kanan -->
            <div class="relative z-20 bg-[#ffd339] border-x-[3px] border-b-[3px] border-black h-14 sm:h-16 rounded-b-2xl flex items-center justify-center gap-16 sm:gap-24" style="box-shadow: 0 16px 4px rgba(0, 0, 0, 0.25)">
              <button @click="prevSlide" class="cursor-pointer hover:scale-110 active:scale-95 transition-transform drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] focus:outline-none z-30">
                <svg width="38" height="30" viewBox="0 0 38 30" aria-hidden="true">
                  <polygon points="38,0 38,30 0,15" fill="#65be3e" stroke="#1e1e1e" stroke-width="2.5" stroke-linejoin="round" />
                </svg>
              </button>
              <button @click="nextSlide" class="cursor-pointer hover:scale-110 active:scale-95 transition-transform drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] focus:outline-none z-30">
                <svg width="38" height="30" viewBox="0 0 38 30" aria-hidden="true">
                  <polygon points="0,0 0,30 38,15" fill="#65be3e" stroke="#1e1e1e" stroke-width="2.5" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <!-- Pegangan Gerobak (Kiri Tengah) -->
            <div class="absolute z-10 top-[45%] left-[-35px] sm:left-[-45px] w-[40px] sm:w-[50px] h-[10px] bg-[#1e1e1e] border-y-[2px] border-black" aria-hidden="true">
               <!-- Ujung Grip Vertikal -->
               <div class="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[16px] h-[50px] bg-[#1e1e1e] rounded-full border-[2px] border-black"></div>
            </div>

            <!-- RODA KIRI (Kecil, Pindah ke sudut kiri bawah) -->
            <div class="absolute z-40 bottom-[-15px] left-[5%] w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] rounded-full bg-[#1e1e1e] border-[4px] sm:border-[5px] border-black flex items-center justify-center" style="box-shadow: 0 8px 4px rgba(0, 0, 0, 0.25)">
              <div class="w-[50%] h-[50%] rounded-full bg-white border-[3px] border-black shadow-inner" />
            </div>

            <!-- RODA KANAN (Besar, di kanan bawah) -->
            <div class="absolute z-40 bottom-[-25px] right-[8%] w-[118px] h-[118px] sm:w-[136px] sm:h-[136px] rounded-full bg-[#1e1e1e] border-[5px] sm:border-[6px] border-black flex items-center justify-center" style="box-shadow: 0 8px 4px rgba(0, 0, 0, 0.25)">
              <div class="w-[65%] h-[65%] rounded-full bg-white border-[4px] border-black shadow-inner" />
            </div>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>