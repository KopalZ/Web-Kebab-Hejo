<script setup>
import { ref, computed, onMounted } from 'vue'
import ScrollReveal from './ScrollReveal.vue'

const cityRows = ref([])
const activeCity = ref('')
const outletsByCity = ref({})

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/outlets')
    const data = await response.json()

    const cities = []
    const outletsMap = {}

    data.forEach(city => {
      if (!cities.includes(city.name)) {
        cities.push(city.name)
        outletsMap[city.name] = []
      }
      
      const formattedOutlets = city.outlets.map(outlet => ({
        name: outlet.name,
        supporting: outlet.address, 
        gmaps_url: outlet.gmaps_url 
      }))

      outletsMap[city.name].push(...formattedOutlets)
    })

    const chunked = []
    for (let i = 0; i < cities.length; i += 5) {
      chunked.push(cities.slice(i, i + 5))
    }
    cityRows.value = chunked
    outletsByCity.value = outletsMap

    if (cities.length > 0) {
      activeCity.value = cities[0]
    }

  } catch (error) {
    console.error("Gagal ambil data:", error)
  }
})

const visibleOutlets = computed(() => {
  return outletsByCity.value[activeCity.value] || []
})

// Fungsi untuk bikin URL Google Maps dinamis berdasarkan kota yang dipilih
const googleMapsEmbedUrl = computed(() => {
  if (!activeCity.value) return ''
  // Format URL Embed gratisan dari Google Maps
  return `https://maps.google.com/maps?q=${activeCity.value},Jawa Barat,Indonesia&t=&z=11&ie=UTF8&iwloc=&output=embed`
})
</script>

<template>
  <section id="coverage" class="section-brand py-12 lg:py-16 border-t-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up" :duration="600" class="text-center mb-8 lg:mb-10">
        <p class="section-brand-label">Jangkauan Kami</p>
        <h2 class="mt-2 section-brand-title">Tersebar di berbagai kota</h2>
      </ScrollReveal>

      <div class="grid lg:grid-cols-2 gap-6 lg:gap-10 lg:max-h-[550px]">
        
        <ScrollReveal animation="fade-left" :duration="600" class="h-full">
          <div class="card-brand p-4 h-full min-h-[400px] lg:h-[550px] flex">
            <div class="relative flex-1 rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
              <iframe
                v-if="googleMapsEmbedUrl"
                :title="`Peta area ${activeCity}`"
                class="absolute inset-0 w-full h-full border-0"
                :src="googleMapsEmbedUrl"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <div v-else class="flex items-center justify-center w-full h-full">
                <span class="animate-pulse text-gray-500 font-medium">Memuat peta...</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-right" :duration="600" class="h-full flex flex-col lg:h-[550px]">
          <h3 class="text-[28px] sm:text-[32px] font-bold text-[#1e1e1e] text-center mb-5 leading-tight">
            Cari Area Mu
          </h3>

          <div class="space-y-2.5 mb-4">
            <div
              v-for="(row, rowIndex) in cityRows"
              :key="rowIndex"
              class="grid grid-cols-3 sm:grid-cols-5 gap-2"
            >
              <button
                v-for="city in row"
                :key="city"
                type="button"
                class="pill-brand text-sm cursor-pointer px-3 py-1.5 text-center whitespace-nowrap transition-colors"
                :class="activeCity === city ? 'bg-[#ffd339] text-[#1e1e1e] ring-2 ring-black font-bold' : 'hover:bg-[#e8e0c8]'"
                @click="activeCity = city"
              >
                {{ city }}
              </button>
            </div>
          </div>

          <div
            class="flex-1 rounded-2xl bg-[#f7f2fa] overflow-y-auto custom-scrollbar flex flex-col border border-black/10"
            style="box-shadow: 0 4px 8px 3px rgba(0,0,0,0.15)"
          >
            <div
              v-for="(outlet, index) in visibleOutlets"
              :key="index"
              class="border-b border-[#cac4d0] last:border-b-0 hover:bg-white/50 transition-colors"
            >
              <div class="px-4 py-4 min-h-[48px] flex flex-col justify-center">
                <p
                  class="text-[#1d1b20] text-base leading-5 mb-1"
                  :class="index === 0 ? 'font-bold text-lg' : 'font-semibold'"
                >
                  {{ outlet.name }}
                </p>
                <p v-if="outlet.supporting" class="text-sm text-[#49454f] mb-2 flex items-start gap-1">
                  {{ outlet.supporting }}
                </p>
                <a 
                  :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(outlet.name + ' ' + activeCity)" 
                  target="_blank" 
                  class="inline-flex items-center w-fit text-xs text-white bg-[#65be3e] px-3 py-1.5 rounded-full font-bold hover:bg-[#52a030] transition-colors shadow-sm"
                >
                  📍 Cari di Google Maps
                </a>
              </div>
            </div>
            
            <div v-if="visibleOutlets.length === 0" class="flex items-center justify-center h-full text-gray-500 italic p-6 text-center">
              Belum ada data cabang untuk kota ini.
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Percantik scrollbar buat list cabang */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cac4d0;
  border-radius: 20px;
}
</style>