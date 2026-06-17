<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, Sparkles } from 'lucide-vue-next'
import Button from './ui/Button.vue'

const navLinks = [
  { href: '#about', label: 'Tentang' },
  { href: '#menu', label: 'Menu' },
  { href: '#franchise', label: 'Franchise' },
  { href: '#coverage', label: 'Jangkauan' },
  { href: '#testimonial', label: 'Testimoni' },
]

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const activeSection = ref('')

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
  
  // Detect active section based on scroll position
  const sections = [...navLinks].reverse().map(link => link.href.replace('#', ''))
  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 100) {
        activeSection.value = section
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Call once on mount to establish correct state
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isScrolled
        ? 'bg-card/90 backdrop-blur-xl shadow-lg shadow-secondary/5 border-b border-border'
        : 'bg-[#65be3e] border-b-2 border-black'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo with animation -->
        <a href="/" class="flex items-center gap-2 group">
          <img src="@/assets/logo.jpeg" alt="Kebab Hejo Logo" 
            class="w-20 h-20 object-contain transition-transform duration-300 hover:scale-105 active:scale-95"
          />
          <span 
            :class="[
              'font-bold text-xl transition-transform duration-300 group-hover:translate-x-1',
              isScrolled ? 'text-foreground' : 'text-[#1e1e1e]'
            ]"
          >
            Kebab 
            <span class="text-[#ffd339]">Hejo</span>
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-8">
          <div
            v-for="link in navLinks"
            :key="link.href"
            class="relative"
          >
            <a
              :href="link.href"
              :class="[
                'font-medium relative py-2 block transition-all duration-200 hover:-translate-y-0.5',
                isScrolled
                  ? 'text-foreground/80 hover:text-secondary'
                  : 'text-[#1e1e1e] hover:text-[#1e1e1e]/70',
                activeSection === link.href.replace('#', '') && isScrolled ? 'text-secondary' : '',
                activeSection === link.href.replace('#', '') && !isScrolled ? 'font-bold' : ''
              ]"
            >
              <span>{{ link.label }}</span>
              
              <!-- Animated underline -->
              <span
                :class="[
                  'absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300',
                  isScrolled ? 'bg-secondary' : 'bg-[#1e1e1e]',
                  activeSection === link.href.replace('#', '') ? 'w-full' : 'w-0 hover:w-full'
                ]"
              />
            </a>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="hidden lg:flex items-center gap-4">
          <div class="transition-transform duration-300 hover:scale-105 active:scale-95">
            <Button 
              as="a"
              href="#franchise"
              :class="[
                'font-semibold rounded-3xl px-6 h-[30px] border border-black shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-0.5',
                isScrolled
                  ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                  : 'bg-[#ffd339] hover:bg-[#f5c830] text-[#1e1e1e]'
              ]"
            >
              <span class="flex items-center gap-2 text-sm">
                <Sparkles v-if="isScrolled" class="w-4 h-4 animate-bounce-subtle" />
                <span>Gabung Franchise</span>
              </span>
            </Button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          :class="[
            'lg:hidden p-2 relative transition-transform duration-200 hover:scale-110 active:scale-90',
            isScrolled ? 'text-foreground' : 'text-[#1e1e1e]'
          ]"
          aria-label="Toggle menu"
        >
          <X v-if="isMobileMenuOpen" size="24" class="transition-all duration-300 rotate-90" />
          <Menu v-else size="24" class="transition-all duration-300" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu with transition -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border overflow-hidden"
      >
        <div class="px-4 py-4 space-y-1">
          <div
            v-for="(link, index) in navLinks"
            :key="link.href"
          >
            <a
              :href="link.href"
              @click="isMobileMenuOpen = false"
              :class="[
                'block py-3 px-4 text-foreground/80 hover:text-secondary hover:bg-secondary/10 transition-all font-medium rounded-xl',
                activeSection === link.href.replace('#', '') 
                  ? 'text-secondary bg-secondary/10' 
                  : ''
              ]"
            >
              <span class="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                {{ link.label }}
              </span>
            </a>
          </div>
          
          <div class="pt-4">
            <Button 
              as="a"
              href="#franchise"
              @click="isMobileMenuOpen = false"
              class="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full flex items-center justify-center gap-2"
            >
              <Sparkles class="w-4 h-4" />
              Gabung Franchise
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.text-glow {
  text-shadow: 0 0 8px rgba(101, 190, 62, 0.3);
}
</style>
