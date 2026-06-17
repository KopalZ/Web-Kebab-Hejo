<script setup>
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import ScrollReveal from './ScrollReveal.vue'

const faqs = [
  { question: "Berapa modal awal untuk bergabung franchise Grand Kebab Hejo?", answer: "Modal awal franchise Grand Kebab Hejo mulai dari Rp 20.000.000. Paket ini sudah termasuk gerobak modern, peralatan masak lengkap, bahan baku awal, dan training. Tersedia juga paket premium dengan fasilitas lebih lengkap." },
  { question: "Berapa lama estimasi balik modal (ROI)?", answer: "Berdasarkan data mitra kami, estimasi balik modal berkisar 3-6 bulan tergantung lokasi dan strategi penjualan. Dengan rata-rata penjualan 30-50 pcs per hari, Anda bisa mendapatkan profit yang menarik setiap bulan." },
  { question: "Apakah ada dukungan bisnis dari Grand Kebab Hejo?", answer: "Tentu! Kami menyediakan dukungan penuh meliputi: training operasional lengkap, panduan SOP, template marketing (banner, sosmed), konsultasi bisnis berkala, dan supply bahan baku dengan harga khusus mitra." },
  { question: "Bagaimana sistem training untuk mitra baru?", answer: "Setiap mitra baru akan mendapatkan training selama 2-3 hari yang mencakup: cara pembuatan menu, standar kebersihan, customer service, manajemen stok, dan tips meningkatkan penjualan." },
  { question: "Apakah ada syarat khusus untuk lokasi outlet?", answer: "Lokasi ideal untuk outlet Grand Kebab Hejo adalah area dengan traffic tinggi seperti: depan sekolah/kampus, area perkantoran, pusat perbelanjaan, atau dekat pemukiman padat." },
  { question: "Bagaimana sistem royalty atau biaya bulanan?", answer: "Grand Kebab Hejo tidak menerapkan sistem royalty bulanan. Yang ada hanya kewajiban membeli bahan baku dari supplier resmi kami untuk menjaga kualitas dan konsistensi rasa di semua outlet." },
  { question: "Apakah bisa pindah lokasi jika outlet kurang laris?", answer: "Bisa! Jika dalam 3 bulan pertama penjualan belum sesuai target, kami akan membantu evaluasi dan mendampingi proses relokasi ke tempat yang lebih strategis." },
]

const activeIndex = ref(null)

const toggleFAQ = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="section-brand py-16 lg:py-24 border-t-0">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up" :duration="600" class="text-center mb-12">
        <span class="section-brand-label">FAQ</span>
        <h2 class="mt-3 section-brand-title">Pertanyaan Umum</h2>
        <p class="mt-4 text-base text-white/90">
          Jawaban untuk pertanyaan yang sering ditanyakan calon mitra
        </p>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" :delay="200" :duration="600">
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index">
            <ScrollReveal animation="fade-up" :delay="250 + index * 40" :duration="400">
              <div
                :class="[
                  'card-brand overflow-hidden transition-shadow duration-300',
                  activeIndex === index ? 'shadow-[0_12px_6px_rgba(0,0,0,0.3)]' : ''
                ]"
              >
                <button
                  @click="toggleFAQ(index)"
                  class="flex items-center justify-between w-full text-left text-[#1e1e1e] font-bold py-5 px-6 cursor-pointer group"
                >
                  <span class="pr-4 text-base sm:text-lg">{{ faq.question }}</span>
                  <ChevronDown
                    :class="[
                      'w-5 h-5 shrink-0 transition-transform duration-300',
                      activeIndex === index ? 'rotate-180' : ''
                    ]"
                  />
                </button>
                <div
                  class="grid transition-all duration-300 ease-in-out"
                  :class="activeIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                >
                  <div class="overflow-hidden">
                    <p class="px-6 pb-5 text-[#2c2c2c] leading-relaxed text-sm sm:text-base border-t-2 border-black/10 pt-4 mx-6">
                      {{ faq.answer }}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>
