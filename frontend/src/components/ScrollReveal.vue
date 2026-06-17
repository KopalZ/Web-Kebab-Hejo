<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  animation: {
    type: String,
    default: 'fade-up' // 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'zoom-out'
  },
  duration: {
    type: Number,
    default: 600
  },
  delay: {
    type: Number,
    default: 0
  },
  threshold: {
    type: Number,
    default: 0.1
  },
  once: {
    type: Boolean,
    default: true
  }
})

const elementRef = ref(null)
const isVisible = ref(false)

const getAnimationClass = () => {
  if (isVisible.value) return 'opacity-100 translate-x-0 translate-y-0 scale-100'
  
  switch (props.animation) {
    case 'fade-up': return 'opacity-0 translate-y-10'
    case 'fade-down': return 'opacity-0 -translate-y-10'
    case 'fade-left': return 'opacity-0 -translate-x-10'
    case 'fade-right': return 'opacity-0 translate-x-10'
    case 'zoom-in': return 'opacity-0 scale-90'
    case 'zoom-out': return 'opacity-0 scale-110'
    default: return 'opacity-0'
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true
      if (props.once) {
        observer.unobserve(elementRef.value)
      }
    } else {
      if (!props.once) {
        isVisible.value = false
      }
    }
  }, {
    threshold: props.threshold,
    rootMargin: '-50px'
  })
  
  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})
</script>

<template>
  <div
    ref="elementRef"
    class="transition-all ease-out"
    :class="getAnimationClass()"
    :style="{
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`
    }"
  >
    <slot />
  </div>
</template>
