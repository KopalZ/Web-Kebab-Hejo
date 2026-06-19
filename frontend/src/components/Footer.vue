<script setup>
/**
 * Footer.vue - Bagian Bawah Halaman (Footer)
 *
 * Footer yang muncul di paling bawah landing page.
 * Berisi logo, deskripsi singkat, link sosial media, dan info kontak.
 *
 * KONEKSI KE BACKEND: TIDAK ADA (semua data statis/hardcoded)
 *
 * FITUR:
 *   - Logo dan tagline brand
 *   - Link Instagram, WhatsApp, Google Maps, Telepon
 *   - Copyright notice
 */
import { Instagram, MessageCircle, MapPin, Phone } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import logo from '@/assets/logo.jpeg'
</script>

<template>
  <footer class="section-brand border-t border-[#d9d9d9] border-x-0 border-b-0">
    <!-- CTA -->
    <div class="border-b border-[#d9d9d9]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          Siap Memulai Bisnis Grand Kebab Hejo?
        </h2>
        <p class="text-white/90 text-base max-w-xl mx-auto mb-8">
          Hubungi kami sekarang untuk konsultasi gratis dan mulai perjalanan bisnis kuliner Anda!
        </p>
        <Button
          as="a"
          href="https://wa.me/6281289222234?text=Halo,%20saya%20tertarik%20dengan%20franchise%20Grand%20Kebab%20Hejo"
          target="_blank"
          class="btn-brand-yellow font-bold text-lg px-10 py-4 h-auto"
        >
          <span class="flex items-center gap-2">
            <MessageCircle class="w-5 h-5" />
            Hubungi via WhatsApp
          </span>
        </Button>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <!-- Brand -->
        <div>
          <a href="/" class="flex items-center gap-2 mb-4 group">
            <img :src="logo" alt="Grand Kebab Hejo Logo" class="w-20 h-20 object-contain transition-transform duration-300 hover:scale-105 active:scale-95" />
            <span class="font-bold text-2xl text-white">Grand Kebab Hejo</span>
          </a>
          <p class="text-white/90 text-base leading-relaxed max-w-md mb-6">
            Franchise kebab modern dengan cita rasa Indonesia. Investasi terjangkau,
            menu beragam, dan dukungan bisnis penuh untuk kesuksesan Anda.
          </p>
          <div class="flex gap-3">
            <a href="https://instagram.com/kebabhejo" target="_blank" class="w-10 h-10 rounded-full bg-[#ffd339] border border-black flex items-center justify-center hover:bg-[#f5c830] transition-colors">
              <Instagram class="w-5 h-5 text-[#1e1e1e]" />
            </a>
            <a href="https://wa.me/6281289222234" target="_blank" class="w-10 h-10 rounded-full bg-[#ffd339] border border-black flex items-center justify-center hover:bg-[#f5c830] transition-colors">
              <MessageCircle class="w-5 h-5 text-[#1e1e1e]" />
            </a>
          </div>
        </div>

        <!-- Nav -->
        <div>
          <h4 class="font-bold text-2xl text-white mb-4">Menu</h4>
          <ul class="space-y-2 text-base leading-7">
            <li v-for="link in [
              { href: '#about', label: 'Tentang Kami' },
              { href: '#menu', label: 'Menu' },
              { href: '#franchise', label: 'Franchise' },
              { href: '#gallery', label: 'Galeri' },
            ]" :key="link.href">
              <a :href="link.href" class="text-white/90 hover:text-white transition-colors">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-bold text-2xl text-white mb-4">Kontak Pusat</h4>
          <ul class="space-y-4 text-base leading-7">
            <li class="flex items-start gap-3">
              <MapPin class="w-5 h-5 shrink-0 mt-0.5 text-white" />
              <span class="text-white/90">
                Jl. Beruang XII Jl. Cikarang Baru Raya No.35, Jayamukti, Kec. Cikarang Pusat, Kabupaten Bekasi, Jawa Barat 17550
              </span>
            </li>
            <li class="flex items-center gap-3">
              <Phone class="w-5 h-5 shrink-0 text-white" />
              <a href="tel:+6281289222234" class="text-white/90 hover:text-white transition-colors">
                +62 812-8922-2234
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 pt-8 border-t border-[#d9d9d9] text-center sm:text-left sm:flex justify-between items-center gap-4">
        <p class="text-white/70 text-sm">
          &copy; {{ new Date().getFullYear() }} Grand Kebab Hejo. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
