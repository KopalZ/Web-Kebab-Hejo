<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  target: { type: Number, required: true },
  duration: { type: Number, default: 2000 },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' }
})

const count = ref(0)
const elementRef = ref(null)

const startCount = () => {
  let startTime = null
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / props.duration, 1)
    
    // Easing function: easeOutQuart
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    count.value = Math.floor(easeOutQuart * props.target)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      startCount()
      observer.unobserve(elementRef.value)
    }
  }, {
    threshold: 0.1
  })
  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})
</script>

<template>
  <span ref="elementRef">
    {{ prefix }}{{ count.toLocaleString('id-ID') }}{{ suffix }}
  </span>
</template>
