<script setup>
/**
 * FranchiseSection.vue - Section Info Franchise
 *
 * Section ini nampilin informasi franchise Grand Kebab Hejo:
 * - Langkah-langkah cara bergabung (4 step)
 * - Isi paket franchise (gerobak, peralatan, bahan baku)
 * - Simulasi keuntungan interaktif (slider penjualan & harga)
 *
 * KONEKSI KE BACKEND:
 *   TIDAK ADA. Semua data di section ini statis/hardcoded.
 *   Tombol "Mulai Bisnis Kebab Anda" langsung link ke WhatsApp (hardcoded).
 *
 * FITUR:
 *   - 4 kartu step cara bergabung (Konsultasi → Kesepakatan → Persiapan → Grand Opening)
 *   - Daftar isi paket franchise (9 item)
 *   - Kalkulator simulasi: slider penjualan/hari & harga rata-rata → hitung omset & profit
 *   - Rumus profit: omset bulanan × 33.7%
 */
import { ref, computed } from 'vue'
import { MessageCircle, FileCheck, Wrench, Rocket, Package, TrendingUp, CheckCircle2 } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import ScrollReveal from './ScrollReveal.vue'

const steps = [
  {
    icon: MessageCircle,
    title: "Konsultasi",
    description: "Hubungi pihak Grand Kebab Hejo untuk konsultasi tentang franchise",
  },
  {
    icon: FileCheck,
    title: "Kesepakatan",
    description: "Calon member franchise sudah menentukan tempat lalu melakukan kesepakatan dan pembayaran dengan Grand Kebab Hejo diikuti dengan penandatanganan MOU",
  },
  {
    icon: Wrench,
    title: "Persiapan",
    description: "Pembuatan gerobak selama kurun waktu kurang lebih 2 minggu",
  },
  {
    icon: Rocket,
    title: "Grand Opening",
    description: "Buka outlet anda dengan dukungan penuh dari Grand Kebab Hejo",
  },
]

const packageContents = [
  "Gerobak Modern",
  "Pan Pizza",
  "Burner Kebab",
  "3 jenis pisau",
  "Kompor Gas 2 Tungku",
  "Tabung Gas 3 Kg",
  "Wajan Kebab",
  "Perlengkapan lain",
  "Gratis bahan baku awal usaha",
]

const salesPerDay = ref(45)
const avgPrice = ref(15000)

const monthlyRevenue = computed(() => salesPerDay.value * avgPrice.value * 25)
const estimatedProfit = computed(() => monthlyRevenue.value * 0.337)

const getSliderStyle = (val, min, max) => {
  const percentage = ((val - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #65be3e ${percentage}%, white ${percentage}%)`
  }
}
</script>

<template>
  <section id="franchise" class="section-brand py-16 lg:py-24 border-t-0 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <ScrollReveal animation="fade-up" :duration="600" class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="section-brand-title">
          <span>Gabung Franchise </span>
          <span class="text-[#ffd339]">Grand Kebab Hejo</span>
        </h2>
        <p class="mt-4 text-base text-white/90">
          Mulai bisnis kuliner Anda dengan sistem franchise yang sudah terbukti sukses
        </p>
      </ScrollReveal>

      <!-- Steps -->
      <div class="mb-14">
        <h3 class="text-2xl font-bold text-white text-center mb-8">Cara Bergabung</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal
            v-for="(step, index) in steps"
            :key="index"
            animation="fade-up"
            :delay="index * 120"
            :duration="500"
          >
            <div class="card-brand p-6 h-full flex flex-col items-center text-center min-h-[280px]">
              <div class="w-[85px] h-[85px] rounded-full bg-[#ffd339] border-2 border-black flex items-center justify-center mb-4 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                <component :is="step.icon" class="w-10 h-10 text-[#1e1e1e]" />
              </div>
              <h4 class="font-bold text-2xl text-[#1e1e1e] mb-2 leading-tight">{{ step.title }}</h4>
              <p class="text-sm text-[#2c2c2c] leading-relaxed">{{ step.description }}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <!-- Package + Calculator -->
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-10">
        <!-- Card 1: Isi Paket Franchise -->
        <ScrollReveal animation="fade-left" :duration="600" class="h-full">
          <div class="bg-[#ffd339] rounded-3xl border-2 border-black p-6 lg:p-8 h-full flex flex-col shadow-[0_8px_0_rgba(0,0,0,1)]">
            <div class="flex items-center gap-3 mb-8">
              <Package class="w-7 h-7 text-[#1e1e1e]" />
              <h3 class="text-2xl font-bold text-[#1e1e1e]">Isi Paket Franchise</h3>
            </div>
            
            <ul class="grid grid-cols-2 gap-y-5 gap-x-4 mb-8 flex-grow">
              <li v-for="(item, index) in packageContents" :key="index" class="flex items-start gap-2 text-[#1e1e1e] font-medium text-sm lg:text-base">
                <CheckCircle2 class="w-5 h-5 text-[#1e1e1e] shrink-0" />
                <span class="leading-tight">{{ item }}</span>
              </li>
            </ul>
            
            <div class="bg-white rounded-3xl border-2 border-black p-6 mt-auto">
              <p class="text-[#2c2c2c] text-sm lg:text-base mb-1 font-medium">Investasi Mulai</p>
              <div class="flex items-baseline gap-2">
                <span class="text-[32px] lg:text-[40px] font-bold text-[#1e1e1e] leading-none">Rp 20.000.000</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <!-- Card 2: Simulasi Keuntungan -->
        <ScrollReveal animation="fade-right" :duration="600" class="h-full">
          <div class="bg-[#ffd339] rounded-3xl border-2 border-black p-6 lg:p-8 h-full flex flex-col shadow-[0_8px_0_rgba(0,0,0,1)]">
            <div class="flex items-center gap-3 mb-8">
              <TrendingUp class="w-7 h-7 text-[#1e1e1e]" />
              <h3 class="text-2xl font-bold text-[#1e1e1e]">Simulasi Keuntungan</h3>
            </div>

            <div class="space-y-8 flex-grow">
              <!-- Slider 1: Penjualan per Hari -->
              <div>
                <div class="flex justify-between text-base font-medium text-[#1e1e1e] mb-3">
                  <span>Penjualan per Hari</span>
                  <span>{{ salesPerDay }}pcs</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  v-model.number="salesPerDay" 
                  :style="getSliderStyle(salesPerDay, 10, 150)"
                  class="w-full appearance-none h-2 rounded-lg outline-none slider-thumb-rect border border-black shadow-inner" 
                />
                <div class="flex justify-between text-sm font-medium text-[#1e1e1e] mt-2">
                  <span>10</span>
                  <span>150</span>
                </div>
              </div>

              <!-- Slider 2: Harga Rata-Rata -->
              <div>
                <div class="flex justify-between text-base font-medium text-[#1e1e1e] mb-3">
                  <span>Harga Rata-Rata</span>
                  <span>Rp {{ avgPrice.toLocaleString('id-ID') }}</span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="22000" 
                  step="1000" 
                  v-model.number="avgPrice" 
                  :style="getSliderStyle(avgPrice, 10000, 22000)"
                  class="w-full appearance-none h-2 rounded-lg outline-none slider-thumb-rect border border-black shadow-inner" 
                />
                <div class="flex justify-between text-sm font-medium text-[#1e1e1e] mt-2">
                  <span>10rb</span>
                  <span>22rb</span>
                </div>
              </div>
              
              <div class="pt-2">
                <div class="flex justify-between items-center text-[#1e1e1e] text-base font-medium mb-6">
                  <span>Omset per Bulan</span>
                  <span class="font-bold text-lg">Rp {{ monthlyRevenue.toLocaleString('id-ID') }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-full border-2 border-black px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-auto">
              <div class="flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-[#1e1e1e]" />
                <span class="font-semibold text-[#1e1e1e] text-sm lg:text-base">Estimasi Profit (33,7%)</span>
              </div>
              <span class="font-bold text-[#1e1e1e] text-xl lg:text-2xl">Rp {{ Math.round(estimatedProfit).toLocaleString('id-ID').replace(/,/g, '.') }}</span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal animation="fade-up" :delay="300" class="text-center mt-12">
        <Button
          as="a"
          href="https://wa.me/6281289222234?text=Halo,%20saya%20tertarik%20dengan%20franchise%20Grand%20Kebab%20Hejo"
          target="_blank"
          class="btn-brand-yellow font-bold text-xl px-10 py-4 h-auto"
        >
          Mulai Bisnis Kebab Anda
        </Button>
        <p class="mt-4 text-sm text-[#1e1e1e] font-medium">
          Konsultasi franchise melalui whatsapp
        </p>
      </ScrollReveal>
    </div>
  </section>
</template>

<style scoped>
.slider-thumb-rect::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 6px;
  height: 20px;
  background: #1e1e1e;
  cursor: pointer;
  border-radius: 2px;
}
.slider-thumb-rect::-moz-range-thumb {
  width: 6px;
  height: 20px;
  background: #1e1e1e;
  cursor: pointer;
  border-radius: 2px;
  border: none;
}
</style>
