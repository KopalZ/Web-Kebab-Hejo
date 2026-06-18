<script setup>
import { ref, computed, onMounted } from 'vue'
import { Save, Plus } from 'lucide-vue-next'
import { API_BASE } from '@/api.js'

const categories = ref([])
const products = ref([])
const activeCategory = ref('Semua')
const loading = ref(true)
const error = ref(null)

const filterOptions = computed(() => {
  const names = categories.value.map((c) => c.name)
  return ['Semua', ...names]
})

const filteredProducts = computed(() => {
  if (activeCategory.value === 'Semua') return products.value
  return products.value.filter((p) => p.categoryName === activeCategory.value)
})

function imageUrl(url) {
  return url ? '/' + url : null
}

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(API_BASE + '/api/menus')
    if (!res.ok) throw new Error('Gagal memuat menu')
    const data = await res.json()
    categories.value = data
    products.value = data.flatMap((cat) =>
      cat.products.map((p) => ({
        ...p,
        image_url: imageUrl(p.image_url),
        categoryName: cat.name
      }))
    )
  } catch (e) {
    error.value = e.message
    products.value = getFallbackProducts()
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function getFallbackProducts() {
  return [
    { id: 1, name: 'Beef Kejo Small', price: 10000, categoryName: 'Kebab', image_url: null },
    { id: 2, name: 'Beef Kejo Medium', price: 12000, categoryName: 'Kebab', image_url: null },
    { id: 3, name: 'Beef Kejo Large', price: 15000, categoryName: 'Kebab', image_url: null },
    { id: 4, name: 'Kebab Pot', price: 20000, categoryName: 'Kebab Pot', image_url: null },
    { id: 5, name: 'Kebab Burger', price: 10000, categoryName: 'Burger', image_url: null },
    { id: 6, name: 'Kebab HotDog', price: 10000, categoryName: 'HotDog', image_url: null },
    { id: 7, name: 'Pizza Kebab', price: 20000, categoryName: 'Pizza', image_url: null },
    { id: 8, name: 'Canai Katsuke', price: 10000, categoryName: 'Canai', image_url: null }
  ]
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price)
}

function saveChanges() {
  alert('Perubahan menu disimpan (hubungkan ke API backend).')
}

function addMenu() {
  alert('Form tambah menu (hubungkan ke API backend).')
}

async function deleteProduct(product) {
  if (!confirm(`Hapus "${product.name}"?`)) return
  try {
    const res = await fetch(API_BASE + '/api/products/' + product.id, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Gagal menghapus menu')
    await loadData()
  } catch (e) {
    alert(e.message)
  }
}
</script>

<template>
  <div>
    <h2 class="page-title">Manajemen Katalog Menu</h2>

    <div class="btn-group">
      <button type="button" class="btn-primary" @click="saveChanges">
        <Save :size="18" />
        Simpan Perubahan
      </button>
      <button type="button" class="btn-primary" @click="addMenu">
        <Plus :size="18" />
        Tambah Menu
      </button>
    </div>

    <div v-if="error" style="margin-bottom: 16px; padding: 12px; background: #ffd339; color: #000; border-radius: 8px; border: 2px solid #000">
      {{ error }} — menampilkan data contoh.
    </div>

    <div class="category-toggle">
      <button
        v-for="cat in filterOptions.length > 1 ? filterOptions : ['Semua', 'Kebab', 'Kebab Pot', 'Burger', 'HotDog', 'Pizza', 'Canai']"
        :key="cat"
        type="button"
        class="category-chip"
        :class="{ 'category-chip--active': activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" style="opacity: 0.8">Memuat menu...</div>

    <div v-else class="menu-grid">
      <article v-for="product in filteredProducts" :key="product.id" class="menu-card">
        <div class="menu-card__image">
          <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
          <span v-else>Tanpa foto</span>
        </div>
        <div class="menu-card__body">
          <div class="menu-card__name">{{ product.name }}</div>
          <div class="menu-card__price">Rp {{ formatPrice(product.price) }}</div>
        </div>
        <div class="menu-card__actions">
          <button type="button" @click="deleteProduct(product)">Hapus</button>
        </div>
      </article>
    </div>
  </div>
</template>
