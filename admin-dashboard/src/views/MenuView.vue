<script setup>
import { ref, computed, onMounted } from 'vue'
import { Save, Plus } from 'lucide-vue-next'
import { API_BASE } from '@/api.js'

const categories = ref([])
const products = ref([])
const activeCategory = ref('Semua')
const loading = ref(true)
const error = ref(null)

const showAddModal = ref(false)
const addForm = ref({ name: '', price: '', categoryId: '', image_url: '' })
const addLoading = ref(false)

const editingId = ref(null)
const editForm = ref({ name: '', price: '', categoryId: '', image_url: '' })

async function addMenu() {
  addForm.value = { name: '', price: '', categoryId: categories.value[0]?.id || '', image_url: '' }
  showAddModal.value = true
}

async function submitAdd() {
  if (!addForm.value.name || !addForm.value.price || !addForm.value.categoryId) {
    alert('Nama, harga, dan kategori wajib diisi.')
    return
  }
  addLoading.value = true
  try {
    const res = await fetch(API_BASE + '/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: addForm.value.name,
        price: Number(addForm.value.price),
        categoryId: Number(addForm.value.categoryId),
        image_url: addForm.value.image_url || null
      })
    })
    if (!res.ok) throw new Error('Gagal menambah menu')
    showAddModal.value = false
    await loadData()
  } catch (e) {
    alert(e.message)
  } finally {
    addLoading.value = false
  }
}

function startEdit(product) {
  editingId.value = product.id
  const cat = categories.value.find((c) => c.name === product.categoryName)
  editForm.value = {
    name: product.name,
    price: product.price,
    categoryId: cat?.id || '',
    image_url: product.image_url ? product.image_url.replace(/^\//, '') : ''
  }
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(product) {
  if (!editForm.value.name || !editForm.value.price || !editForm.value.categoryId) {
    alert('Nama, harga, dan kategori wajib diisi.')
    return
  }
  try {
    const res = await fetch(API_BASE + '/api/products/' + product.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.value.name,
        price: Number(editForm.value.price),
        categoryId: Number(editForm.value.categoryId),
        image_url: editForm.value.image_url || null
      })
    })
    if (!res.ok) throw new Error('Gagal menyimpan perubahan')
    editingId.value = null
    await loadData()
  } catch (e) {
    alert(e.message)
  }
}

function saveChanges() {
  alert('Gunakan tombol "Edit" pada setiap menu untuk mengubah, atau "Tambah Menu" untuk menambah.')
}

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
        <template v-if="editingId === product.id">
          <div class="menu-card__image">
            <img v-if="editForm.image_url" :src="'/' + editForm.image_url" alt="preview" />
            <span v-else>Preview</span>
          </div>
          <div class="menu-card__body">
            <input v-model="editForm.name" placeholder="Nama menu" class="edit-input" />
            <input v-model.number="editForm.price" type="number" placeholder="Harga" class="edit-input" />
            <select v-model="editForm.categoryId" class="edit-input">
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <input v-model="editForm.image_url" placeholder="Path gambar (opsional)" class="edit-input" />
          </div>
          <div class="menu-card__actions">
            <button type="button" class="btn-primary" @click="saveEdit(product)">Simpan</button>
            <button type="button" @click="cancelEdit">Batal</button>
          </div>
        </template>
        <template v-else>
          <div class="menu-card__image">
            <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
            <span v-else>Tanpa foto</span>
          </div>
          <div class="menu-card__body">
            <div class="menu-card__name">{{ product.name }}</div>
            <div class="menu-card__price">Rp {{ formatPrice(product.price) }}</div>
          </div>
          <div class="menu-card__actions">
            <button type="button" @click="startEdit(product)">Edit</button>
            <button type="button" @click="deleteProduct(product)">Hapus</button>
          </div>
        </template>
      </article>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h3 style="margin: 0 0 16px">Tambah Menu Baru</h3>
        <label>
          Nama menu
          <input v-model="addForm.name" class="edit-input" />
        </label>
        <label>
          Harga
          <input v-model.number="addForm.price" type="number" class="edit-input" />
        </label>
        <label>
          Kategori
          <select v-model="addForm.categoryId" class="edit-input">
            <option disabled value="">Pilih kategori</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </label>
        <label>
          Path gambar (opsional)
          <input v-model="addForm.image_url" class="edit-input" placeholder="uploads/foto.jpg" />
        </label>
        <div class="modal__actions">
          <button type="button" class="btn-primary" :disabled="addLoading" @click="submitAdd">
            {{ addLoading ? 'Menyimpan...' : 'Tambah' }}
          </button>
          <button type="button" @click="showAddModal = false">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>
