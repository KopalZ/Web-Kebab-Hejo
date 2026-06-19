<script setup>
/**
 * WhatsAppButton.vue - Tombol WhatsApp Floating
 *
 * Tombol melayang di pojok kanan bawah buat visitor yang mau hubungi via WA.
 * Muncul setelah delay sebentar dengan animasi fade-in.
 *
 * KONEKSI KE BACKEND: TIDAK ADA (link WA hardcoded)
 *
 * CARA KERJA:
 *   - setTimeout 1.5 detik → tombol muncul (showButton = true)
 *   - Klik → buka WhatsApp dengan pesan otomatis
 */
import { ref, onMounted } from 'vue'
import { MessageCircle } from 'lucide-vue-next'

const showButton = ref(false)

onMounted(() => {
  // Reveal WhatsApp button after a short delay
  setTimeout(() => {
    showButton.value = true
  }, 1000)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="transform scale-0 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
  >
    <div
      v-if="showButton"
      class="fixed bottom-6 right-6 z-50"
    >
      <a
        href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20franchise%20Kebab%20Hejo"
        target="_blank"
        class="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full border-2 border-black shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:shadow-xl transition-all duration-300 group cursor-pointer"
        aria-label="Chat via WhatsApp"
      >
        <!-- Pulse animation -->
        <span class="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
        <span class="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" style="animation-delay: 0.5s" />
        
        <MessageCircle class="w-6 h-6 relative z-10" />
        
        <!-- Tooltip -->
        <span class="absolute right-full mr-3 px-3 py-2 bg-[#ffd339] text-[#1e1e1e] text-sm font-medium rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border-2 border-black">
          Chat dengan kami
        </span>
      </a>
    </div>
  </Transition>
</template>
