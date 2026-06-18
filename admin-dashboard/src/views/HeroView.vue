<script setup>
import { ref, onMounted } from 'vue'
import { Save, Plus, Trash2 } from 'lucide-vue-next'
import { API_BASE } from '@/api.js'

const franchiseLink = ref('')
const slides = ref([])

// Variabel untuk tambah slide baru
const newSlideFile = ref('')
const newSlideNote = ref('')

onMounted(async () => {
  await fetchData()
})

// Fungsi tarik data dari database
async function fetchData() {
  // 1. Ambil Link Franchise
  try {
    const resLink = await fetch(API_BASE + '/api/settings/franchise-link')
    const dataLink = await resLink.json()
    if (dataLink && dataLink.value) {
      franchiseLink.value = dataLink.value
    }
  } catch (error) {
    console.error("Gagal mengambil link franchise", error)
  }

  // 2. Ambil Daftar Slide
  try {
    const resSlides = await fetch(API_BASE + '/api/hero-slides')
    slides.value = await resSlides.json()
  } catch (error) {
    console.error("Gagal mengambil data slide", error)
  }
}

// Fungsi Simpan Link Franchise
async function saveLink() {
  if (!franchiseLink.value) {
    alert('Link franchise tidak boleh kosong!')
    return
  }
  try {
    await fetch(API_BASE + '/api/settings/franchise-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: franchiseLink.value })
    })
    alert('Link Franchise berhasil diperbarui!')
  } catch (error) {
    alert('Gagal menyimpan link franchise.')
  }
}

// Menangkap nama file slide baru
function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (file) newSlideFile.value = file.name
}

// Fungsi Tambah Slide ke Database
async function addSlide() {
  if (!newSlideFile.value) {
    alert('Silakan pilih file gambar terlebih dahulu!')
    return
  }

  try {
    await fetch(API_BASE + '/api/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: newSlideFile.value,
        note: newSlideNote.value
      })
    })
    
    newSlideFile.value = ''
    newSlideNote.value = ''
    await fetchData()
    alert('Slide baru berhasil ditambahkan!')
  } catch (error) {
    alert('Gagal menambah slide.')
  }
}

// Fungsi Hapus Slide
async function removeSlide(id) {
  if (confirm('Apakah Anda yakin ingin menghapus slide ini?')) {
    try {
      await fetch(API_BASE + `/api/hero-slides/${id}`, {
        method: 'DELETE'
      })
      await fetchData()
    } catch (error) {
      alert('Gagal menghapus slide.')
    }
  }
}
</script>

<template>
  <div>
    <h2 class="page-title">Manajemen Hero Banner</h2>

    <div class="form-panel" style="margin-bottom: 24px; padding: 20px;">
      <h3 style="margin-top: 0; margin-bottom: 16px;">Tombol Franchise</h3>
      <div style="display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 250px;">
          <input
            v-model="franchiseLink"
            type="url"
            class="form-input"
            placeholder="Contoh: https://wa.me/6281234567890"
            style="border-width: 2px;"
          />
        </div>
        <button type="button" class="btn-primary" @click="saveLink" style="height: 44px; margin-bottom: 2px;">
          <Save :size="18" /> Simpan Link
        </button>
      </div>
    </div>

    <div class="form-panel" style="margin-bottom: 24px; padding: 20px;">
      <h3 style="margin-top: 0; margin-bottom: 16px;">Tambah Slide Baru</h3>
      <div style="display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 200px;">
          <label style="display:block; font-weight:bold; margin-bottom:8px;">Pilih Gambar</label>
          <label class="file-btn">
            Pilih File
            <input type="file" accept="image/*" hidden @change="handleFileChange" />
          </label>
          <span v-if="newSlideFile" style="margin-left: 8px; font-weight: bold;">{{ newSlideFile }}</span>
        </div>
        <div style="flex: 2; min-width: 250px;">
          <label style="display:block; font-weight:bold; margin-bottom:8px;">Catatan (Opsional)</label>
          <input v-model="newSlideNote" type="text" class="form-input" placeholder="Isi catatan slide" style="border-width: 2px;" />
        </div>
        <button type="button" class="btn-primary" @click="addSlide" style="height: 44px; margin-bottom: 2px;">
          <Plus :size="18" /> Tambah Slide
        </button>
      </div>
    </div>

    <div class="form-panel">
      <h3 style="margin-top: 0; margin-bottom: 16px;">Daftar Slide Aktif</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 60px; text-align: center;">No</th>
            <th style="width: 200px">Nama File Gambar</th>
            <th>Catatan</th>
            <th style="width: 80px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(slide, index) in slides" :key="slide.id">
            <td style="text-align: center; font-weight: bold;">{{ index + 1 }}</td>
            <td>
              <span style="font-weight: 600; color: #02a554;">{{ slide.image_url }}</span>
            </td>
            <td>{{ slide.note || '-' }}</td>
            <td style="text-align: center;">
              <button type="button" style="background: none; border: none; color: #c00; cursor: pointer" title="Hapus" @click="removeSlide(slide.id)">
                <Trash2 :size="20" />
              </button>
            </td>
          </tr>
          <tr v-if="slides.length === 0">
            <td colspan="4" style="text-align: center; padding: 20px; font-style: italic; color: #666;">
              Belum ada slide gambar yang ditambahkan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.form-input { width: 100%; padding: 10px 14px; border: 2px solid #000; border-radius: 8px; background-color: #fff; color: #000; box-sizing: border-box; }
.form-input:focus { outline: none; border-color: #ffd339; }
.btn-primary { display: inline-flex; align-items: center; gap: 8px; background-color: #ffd339; color: #000; border: 2px solid #000; border-radius: 6px; padding: 10px 16px; cursor: pointer; font-weight: 700; box-shadow: 0px 3px 0px #000; transition: all 0.1s; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0px 4px 0px #000; }
.btn-primary:active { transform: translateY(1px); box-shadow: 0px 1px 0px #000; }
.file-btn { display: inline-block; background-color: #ffd339; color: #000; border: 2px solid #000; border-radius: 6px; padding: 10px 16px; cursor: pointer; font-weight: 700; box-shadow: 0px 3px 0px #000; transition: all 0.1s; }
.file-btn:hover { transform: translateY(-1px); box-shadow: 0px 4px 0px #000; }
.file-btn:active { transform: translateY(1px); box-shadow: 0px 1px 0px #000; }

.data-table { width: 100%; border-spacing: 0; border-collapse: separate; background-color: #f3edd9; border: 2px solid #000; border-radius: 8px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15); }
.data-table thead th { background-color: #ffd339; color: #000; font-size: 16px; font-weight: 800; padding: 14px 16px; text-align: left; border-bottom: 2px solid #000; }
.data-table tbody td { background-color: #f3edd9; color: #000; padding: 14px 16px; border-bottom: 1px solid #d6d6d6; vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: none; }
</style>