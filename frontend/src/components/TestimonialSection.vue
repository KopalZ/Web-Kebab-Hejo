<script setup>
/**
 * TestimonialSection.vue - Section Testimoni
 *
 * Carousel testimoni dari partner/franchisee Grand Kebab Hejo.
 * Ada tombol navigasi kiri/kanan dan auto-slide.
 *
 * KONEKSI KE BACKEND: TIDAK ADA (data testimoni hardcoded)
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import ScrollReveal from './ScrollReveal.vue'

const testimonials = [
  { name: "Budi Santoso", location: "Tangerang", image: "BS", rating: 5, text: "Alhamdulillah, dalam 3 bulan sudah balik modal. Tim Grand Kebab Hejo sangat supportif dan selalu siap membantu kapanpun dibutuhkan.", highlight: "3 bulan balik modal" },
  { name: "Siti Rahayu", location: "Bandung", image: "SR", rating: 5, text: "Awalnya ragu karena belum punya pengalaman bisnis kuliner. Tapi dengan training dari Grand Kebab Hejo, sekarang outlet saya sudah punya 2 karyawan!", highlight: "Pemula sukses" },
  { name: "Ahmad Fadli", location: "Bekasi", image: "AF", rating: 5, text: "Menu yang beragam membuat pelanggan selalu kembali. Rasa kebab-nya memang beda, cocok dengan lidah orang Indonesia.", highlight: "Pelanggan loyal" },
  { name: "Dewi Lestari", location: "Bogor", image: "DL", rating: 5, text: "Support marketing-nya luar biasa! Ada template sosmed, banner, dan selalu ada promo menarik untuk mitra.", highlight: "Support lengkap" },
  { name: "Hendra Wijaya", location: "Cikarang", image: "HW", rating: 4, text: "Booth-nya eye catching banget, banyak yang tertarik langsung beli. Lokasi saya di depan kampus, laris manis!", highlight: "Booth eye-catching" },
]

const sectionRef = ref(null)
const scrollRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const activeIndex = ref(0)
const isInView = ref(false)

const checkScroll = () => {
  if (!scrollRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollRef.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
  const cardWidth = 360 + 24
  activeIndex.value = Math.min(Math.round(scrollLeft / cardWidth), testimonials.length - 1)
}

const scroll = (direction) => {
  if (!scrollRef.value) return
  scrollRef.value.scrollBy({ left: direction === 'left' ? -380 : 380, behavior: 'smooth' })
  setTimeout(checkScroll, 300)
}

const scrollToCard = (index) => {
  if (!scrollRef.value) return
  scrollRef.value.scrollTo({ left: index * 384, behavior: 'smooth' })
  setTimeout(checkScroll, 300)
}

let intervalId = null

onMounted(() => {
  checkScroll()
  const observer = new IntersectionObserver(([entry]) => { isInView.value = entry.isIntersecting }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
  intervalId = setInterval(() => {
    if (!isInView.value) return
    if (scrollRef.value && canScrollRight.value) scroll('right')
    else if (scrollRef.value) { scrollRef.value.scrollTo({ left: 0, behavior: 'smooth' }); setTimeout(checkScroll, 300) }
  }, 5000)
})

onUnmounted(() => { if (intervalId) clearInterval(intervalId) })
</script>

<template>
  <section id="testimonial" ref="sectionRef" class="section-brand py-16 lg:py-24 border-t-0 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <ScrollReveal animation="fade-up" :duration="600" class="text-center max-w-3xl mx-auto mb-12">
        <span class="section-brand-label">Testimoni</span>
        <h2 class="mt-3 section-brand-title">Kata Mitra Kami</h2>
        <p class="mt-4 text-base text-white/90">
          Cerita sukses dari para mitra Grand Kebab Hejo di berbagai kota
        </p>
      </ScrollReveal>

      <div class="relative">
        <div class="hidden lg:flex justify-end gap-2 mb-4">
          <Button variant="outline" size="icon" @click="scroll('left')" :disabled="!canScrollLeft" class="pill-brand w-10 h-10 p-0 disabled:opacity-40 border-2">
            <ChevronLeft class="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" @click="scroll('right')" :disabled="!canScrollRight" class="pill-brand w-10 h-10 p-0 disabled:opacity-40 border-2">
            <ChevronRight class="w-5 h-5" />
          </Button>
        </div>

        <div
          ref="scrollRef"
          @scroll="checkScroll"
          class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
          style="scrollbar-width: none;"
        >
          <div v-for="(t, index) in testimonials" :key="index" class="snap-start shrink-0 w-[300px] lg:w-[360px]">
            <ScrollReveal animation="fade-up" :delay="index * 80" :duration="500">
              <div class="card-brand p-6 h-full flex flex-col">
                <Quote class="w-8 h-8 text-[#1e1e1e]/30 mb-3" />
                <span class="inline-flex self-start px-3 py-1 bg-white border border-[#02a554] rounded-full text-xs font-medium text-[#1e1e1e] mb-3">
                  {{ t.highlight }}
                </span>
                <div class="flex gap-1 mb-3">
                  <Star v-for="i in 5" :key="i" :class="['w-4 h-4', i <= t.rating ? 'text-[#ffca10] fill-[#ffca10]' : 'text-[#cac4d0]']" />
                </div>
                <p class="text-[#2c2c2c] leading-relaxed mb-6 flex-1">"{{ t.text }}"</p>
                <div class="flex items-center gap-3 pt-4 border-t-2 border-black/10">
                  <div class="w-11 h-11 rounded-full bg-white border-2 border-black flex items-center justify-center">
                    <span class="font-bold text-[#1e1e1e] text-sm">{{ t.image }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-[#1e1e1e]">{{ t.name }}</p>
                    <p class="text-sm text-[#2c2c2c]">Mitra {{ t.location }}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_, index) in testimonials"
            :key="index"
            @click="scrollToCard(index)"
            :class="['h-2 rounded-full transition-all duration-300 cursor-pointer border border-black', index === activeIndex ? 'w-8 bg-[#ffd339]' : 'w-2 bg-white/50']"
            aria-label="Go to slide"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
</style>
