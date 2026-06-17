<script setup>
// 1. Import cukup satu kali saja di paling atas
import { ref, computed, onMounted } from 'vue'
import ScrollReveal from './ScrollReveal.vue'
import Button from './ui/Button.vue'

// Kita bikin ref kosong dulu, nanti diisi otomatis dari database
const menuCategories = ref(["Semua"]) 
const menuItems = ref([])
const activeCategory = ref("Semua")

// Fungsi ini akan otomatis jalan saat halamannya dibuka
onMounted(async () => {
  try {
    // Nembak API Backend kamu
    const response = await fetch('http://localhost:3000/api/menus')
    const data = await response.json()

    let allProducts = []

    // Olah data dari database biar pas sama format Vue temanmu
    data.forEach(category => {
      menuCategories.value.push(category.name) // Masukin nama kategori ke tombol
      
      category.products.forEach(product => {
        allProducts.push({
          id: product.id,
          name: product.name,
          category: category.name,
          // Format angka 20000 jadi "Rp 20.000"
          price: 'Rp ' + product.price.toLocaleString('id-ID').replace(/,/g, '.'),
          image: '/' + product.image_url
        })
      })
    })

    // Masukin data yang udah rapi ke variabel menuItems
    menuItems.value = allProducts

  } catch (error) {
    console.error("Wah, gagal ambil data dari backend nih:", error)
  }
})

const filteredMenu = computed(() => {
  if (activeCategory.value === "Semua") return menuItems.value
  return menuItems.value.filter(item => item.category === activeCategory.value)
})
</script>

<template>
  <section id="menu" class="section-brand py-16 lg:py-24 border-t-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal animation="fade-up" :duration="600" class="text-center max-w-3xl mx-auto mb-10">
        <h2 class="section-brand-title-lg">Menu Grand Kebab Hejo</h2>
        <p class="mt-4 text-base text-white/90">
          Berbagai pilihan menu lezat dengan harga terjangkau
        </p>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" :delay="200" :duration="600" class="flex flex-wrap justify-center gap-3 mb-10">
        <button
          v-for="category in menuCategories"
          :key="category"
          @click="activeCategory = category"
          :class="[
            'pill-brand cursor-pointer text-sm',
            activeCategory === category ? 'pill-brand-active' : 'opacity-90 hover:opacity-100'
          ]"
        >
          {{ category }}
        </button>
      </ScrollReveal>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
        <ScrollReveal
          v-for="(item, index) in filteredMenu"
          :key="item.id"
          animation="zoom-in"
          :delay="index * 40"
          :duration="400"
        >
          <div class="card-brand flex flex-col items-center pt-5 pb-5 px-4 h-full">
            
            <div class="w-full aspect-square bg-white rounded-2xl border-2 border-black/10 shadow-sm flex items-center justify-center mb-4 overflow-hidden group p-3">
              <img 
                :src="item.image" 
                :alt="item.name" 
                class="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
            
            <span class="tag-brand mb-2">{{ item.category }}</span>
            <h3 class="font-bold text-lg sm:text-xl text-[#1e1e1e] text-center mb-1">{{ item.name }}</h3>
            <p class="price-brand text-base">{{ item.price }}</p>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal animation="fade-up" :delay="300" class="text-center mt-12">
        <Button
          as="a"
          href="https://wa.me/6281289222234?text=Halo,%20saya%20ingin%20buat%20pesanan"
          target="_blank"
          class="btn-brand-yellow font-bold text-2xl px-10 py-4 h-auto"
        >
          Buat Pesanan
        </Button>
      </ScrollReveal>
    </div>
  </section>
</template>