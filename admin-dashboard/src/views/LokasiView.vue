<!--
  ================================================================
  LokasiView.vue — Halaman Admin untuk Mengelola Lokasi Outlet
  ================================================================

  FUNGSI HALAMAN INI:
  Memungkinkan admin untuk menambah dan menghapus daftar outlet/cabang
  Kebab Hejo yang ditampilkan di halaman Coverage (Jangkauan) landing page.

  FITUR UTAMA:
  1. Tambah cabang baru (pilih kota, isi nama cabang, link Google Maps)
  2. Lihat daftar semua cabang yang dikelompokkan per kota
  3. Hapus cabang dari database
  4. Data ditampilkan dalam tabel flat (baris per cabang, bukan per kota)

  KONEKSI KE BACKEND (API):
  ┌─────────────────────────────────────────────────────────────────┐
  │ Method │ Endpoint              │ Fungsi                         │
  ├─────────────────────────────────────────────────────────────────┤
  │ GET    │ /api/outlets          │ Ambil semua kota + outletnya   │
  │ POST   │ /api/outlets          │ Tambah outlet baru             │
  │ DELETE │ /api/outlets/:id      │ Hapus outlet dari database     │
  └─────────────────────────────────────────────────────────────────┘

  BASE URL diambil dari file api.js:
  → https://backend-kebab-production.up.railway.app

  STRUKTUR DATA DARI BACKEND:
  GET /api/outlets mengembalikan data berkelompok per kota:
  [
    {
      id: 1,
      name: "Bekasi",
      outlets: [
        { id: 10, name: "Alfamidi Cikarang", gmaps_url: "https://..." },
        { id: 11, name: "Pasar Baru", gmaps_url: "https://..." }
      ]
    },
    ...
  ]

  Frontend kemudian "meratakan" data ini jadi array satu dimensi
  supaya gampang ditampilkan di tabel (variabel: flatLocations).

  ALUR TAMBAH CABANG BARU:
  1. Admin pilih kota dari dropdown (data kota dari GET /api/outlets)
  2. Admin isi nama cabang dan link Google Maps
  3. Admin klik "Simpan ke Database"
  4. Frontend kirim POST /api/outlets dengan body:
     { name, address, gmaps_url, cityId }
  5. Setelah berhasil, tabel di-refresh otomatis
-->
<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { API_BASE } from '@/api.js'

// Array penampung daftar outlet yang sudah diratakan (flat) untuk ditampilkan di tabel
const locations = ref([])
// Array penampung daftar kota untuk dropdown "Pilih Kota"
const availableCities = ref([])

// Form input untuk tambah cabang baru
const newLocationName = ref('')   // Nama cabang baru
const newLocationLink = ref('')   // Link Google Maps cabang baru
const selectedCityId = ref('')    // ID kota yang dipilih dari dropdown

// Pas halaman dibuka, langsung ambil data outlet dari backend
onMounted(async () => {
  await fetchLocations()
})

async function fetchLocations() {
  try {
    const response = await fetch(API_BASE + '/api/outlets')
    const data = await response.json()
    
    // Simpan daftar kota untuk dropdown
    availableCities.value = data.map(city => ({
      id: city.id,
      name: city.name
    }))

    // Rapikan data cabang biar gampang ditampilin di tabel
    let flatLocations = []
    data.forEach(city => {
      city.outlets.forEach(outlet => {
        flatLocations.push({
          id: outlet.id,
          nama: outlet.name,
          kota: city.name,
          link: outlet.gmaps_url
        })
      })
    })
    locations.value = flatLocations
  } catch (error) {
    console.error("Gagal mengambil data:", error)
  }
}

async function addLocation() {
  const name = newLocationName.value.trim()
  const link = newLocationLink.value.trim()
  const cityId = selectedCityId.value

  if (!name || !link || !cityId) {
    alert('Nama, Link, dan Kota wajib diisi!')
    return
  }

  try {
    // Kirim data baru ke backend
    await fetch(API_BASE + '/api/outlets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        address: `Cabang ${name}`,
        gmaps_url: link,
        cityId: cityId
      })
    })

    // Bersihkan form dan refresh tabel
    newLocationName.value = ''
    newLocationLink.value = ''
    selectedCityId.value = ''
    await fetchLocations()
    alert('Cabang baru berhasil ditambahkan ke database!')
  } catch (error) {
    alert('Gagal menambah cabang.')
  }
}

async function removeLocation(id, nama) {
  if (confirm(`Apakah Anda yakin ingin menghapus cabang "${nama}" secara permanen?`)) {
    try {
      // Tembak API delete ke backend
      await fetch(API_BASE + `/api/outlets/${id}`, {
        method: 'DELETE'
      })
      // Refresh tabel
      await fetchLocations()
    } catch (error) {
      alert('Gagal menghapus cabang.')
    }
  }
}
</script>

<template>
  <div class="lokasi-view">
    <div class="header-container">
      <h2 class="manajemen-title">Manajemen Lokasi Outlet</h2>
    </div>

    <div class="form-grid">
      <div class="kolom-kiri">
        <h3 class="section-title">Tambah Cabang Baru</h3>
        
        <div class="edit-lokasi">
          <div class="input-row">
            
            <div class="input-field">
              <label class="input-label">Pilih Kota</label>
              <select v-model="selectedCityId" class="text-input">
                <option value="" disabled>-- Pilih Kota --</option>
                <option v-for="city in availableCities" :key="city.id" :value="city.id">
                  {{ city.name }}
                </option>
              </select>
            </div>

            <div class="input-field">
              <label class="input-label">Nama Cabang</label>
              <input
                v-model="newLocationName"
                type="text"
                class="text-input"
                placeholder="Contoh: Alfamidi Cikarang Pusat"
              />
            </div>

            <div class="input-field">
              <label class="input-label">Link Google Maps</label>
              <input
                v-model="newLocationLink"
                type="text"
                class="text-input"
                placeholder="Contoh: http://googleusercontent..."
              />
            </div>

            <button type="button" class="btn-add" @click="addLocation">
              <Plus :size="18" />
              <span>Simpan ke Database</span>
            </button>
          </div>

          <div class="grup-tabel mt-6">
            <div class="header-tabel">
              <div class="col-urutan">No</div>
              <div class="col-kota">Kota</div>
              <div class="col-lokasi">Nama Cabang</div>
              <div class="col-link">Link Maps</div>
              <div class="col-aksi">Aksi</div>
            </div>
            
            <div 
              v-for="(loc, index) in locations" 
              :key="loc.id" 
              :class="index === locations.length - 1 ? 'tabel-row-last' : 'tabel-row'"
            >
              <div class="col-urutan">{{ index + 1 }}</div>
              <div class="col-kota font-bold">{{ loc.kota }}</div>
              <div class="col-lokasi">{{ loc.nama }}</div>
              <div class="col-link">
                <a :href="loc.link" target="_blank" class="link-anchor">Buka Link</a>
              </div>
              <div class="col-aksi">
                <button type="button" class="btn-hapus" @click="removeLocation(loc.id, loc.nama)">
                  Hapus
                </button>
              </div>
            </div>
            
            <div v-if="locations.length === 0" class="tabel-row-last empty-row">
              Sedang mengambil data dari database...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-6 { margin-top: 24px; }
.lokasi-view { display: flex; flex-direction: column; gap: 24px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
.header-container { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.manajemen-title { font-size: 28px; font-weight: 800; color: #fff; margin: 0; }
.form-grid { align-self: stretch; }
.kolom-kiri { display: flex; flex-direction: column; gap: 20px; }
.section-title { font-size: 22px; font-weight: 700; color: #fff; margin: 0; }
.edit-lokasi { display: flex; flex-direction: column; gap: 24px; background: transparent; }
.input-row { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; border: 2px dashed rgba(255, 255, 255, 0.3); }
.input-field { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 200px; }
.input-label { font-size: 15px; font-weight: 700; color: #fff; }
.text-input { border-radius: 8px; border: 2px solid #000; padding: 12px 16px; font-size: 15px; color: #000; background: #fff; outline: none; width: 100%; box-sizing: border-box; height: 48px; }
.text-input:focus { border-color: #ffd339; }
.btn-add { border-radius: 8px; background-color: #ffd339; display: flex; align-items: center; padding: 0 20px; gap: 8px; color: #000; cursor: pointer; font-weight: 700; border: 2px solid #000; font-size: 15px; height: 48px; box-shadow: 0px 4px 0px #000; transition: all 0.1s; box-sizing: border-box; margin-bottom: 2px; }
.btn-add:hover { transform: translateY(-2px); box-shadow: 0px 6px 0px #000; }
.btn-add:active { transform: translateY(2px); box-shadow: 0px 2px 0px #000; }
.grup-tabel { align-self: stretch; display: flex; flex-direction: column; font-size: 15px; color: #000; box-shadow: 0px 4px 10px rgba(0,0,0,0.15); border-radius: 8px; overflow: hidden; }
.header-tabel { background-color: #ffd339; border: 2px solid #000; display: flex; align-items: center; padding: 14px 16px; font-size: 16px; font-weight: 800; border-bottom: 2px solid #000; }
.tabel-row { background-color: #f3edd9; border-right: 2px solid #000; border-bottom: 1px solid #e0e0e0; border-left: 2px solid #000; display: flex; align-items: center; padding: 14px 16px; }
.tabel-row-last { background-color: #f3edd9; border-right: 2px solid #000; border-bottom: 2px solid #000; border-left: 2px solid #000; display: flex; align-items: center; padding: 14px 16px; border-radius: 0px 0px 8px 8px; }
.empty-row { justify-content: center; color: #666; font-style: italic; padding: 24px; }
.col-urutan { width: 50px; font-weight: 800; text-align: center; }
.col-kota { flex: 1; padding-right: 16px; }
.col-lokasi { flex: 2; font-weight: 700; padding-right: 16px; }
.col-link { flex: 1; padding-right: 16px; }
.link-anchor { color: #02a554; text-decoration: underline; font-weight: 600; }
.link-anchor:hover { color: #65be3e; }
.col-aksi { width: 100px; text-align: center; display: flex; justify-content: center; }
.btn-hapus { background: #ff4d4d; border: 2px solid #000; border-radius: 6px; color: #fff; font-weight: 700; padding: 6px 12px; cursor: pointer; font-size: 13px; box-shadow: 0px 2px 0px #000; transition: all 0.1s; }
.btn-hapus:hover { transform: translateY(-1px); box-shadow: 0px 3px 0px #000; }
.btn-hapus:active { transform: translateY(1px); box-shadow: 0px 1px 0px #000; }
</style>