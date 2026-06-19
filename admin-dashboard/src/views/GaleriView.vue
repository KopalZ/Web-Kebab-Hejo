<!--
  ============================================================
  GaleriView.vue — Halaman Admin untuk Mengelola Galeri Foto
  ============================================================

  FUNGSI HALAMAN INI:
  Memungkinkan admin untuk upload, preview, dan hapus foto-foto
  yang akan ditampilkan di bagian Galeri landing page.

  FITUR UTAMA:
  1. Upload banyak foto sekaligus (multi-select)
  2. Preview foto sebelum diupload + isi catatan per foto
  3. Hapus foto dari antrean sebelum diupload
  4. Upload semua foto sekaligus ke database
  5. Lihat daftar semua foto yang ada di database
  6. Hapus foto permanen dari database

  KONEKSI KE BACKEND (API):
  ┌─────────────────────────────────────────────────────────────────┐
  │ Method │ Endpoint              │ Fungsi                         │
  ├─────────────────────────────────────────────────────────────────┤
  │ GET    │ /api/gallery          │ Ambil semua foto galeri        │
  │ POST   │ /api/gallery          │ Tambah foto baru ke database   │
  │ DELETE │ /api/gallery/:id      │ Hapus foto dari database       │
  └─────────────────────────────────────────────────────────────────┘

  BASE URL diambil dari file api.js:
  → https://backend-kebab-production.up.railway.app

  CONTOH ALUR UPLOAD:
  1. Admin klik "Pilih Gambar" → pilih beberapa file sekaligus
  2. Setiap file muncul di "Antrean Upload" dengan preview
  3. Admin bisa isi catatan untuk tiap foto
  4. Admin klik "Upload Semua Sekarang"
  5. Frontend kirim POST /api/gallery untuk setiap foto (paralel via Promise.all)
  6. Setelah selesai, galeri di-refresh otomatis

  CATATAN PENTING:
  - File gambar HARUS sudah di-copy manual ke folder /public admin dashboard
  - Yang dikirim ke backend HANYA nama file (bukan file binary)
  - Backend simpan: { image_url: "nama_file.jpg", note: "catatan" }
-->
<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Trash2, UploadCloud, X } from 'lucide-vue-next'
import { API_BASE } from '@/api.js'

// Array penampung data foto yang sudah ada di database
const galleryItems = ref([])
// Array penampung antrean foto yang belum diupload (preview sebelum dikirim ke backend)
const pendingUploads = ref([])

// Pas halaman dibuka, langsung ambil data galeri dari backend
onMounted(async () => {
  await fetchGallery()
})

// Fungsi ambil semua data galeri dari backend
// Dipanggil saat halaman dibuka dan setiap kali ada perubahan (upload/hapus)
async function fetchGallery() {
  try {
    const res = await fetch(API_BASE + '/api/gallery')
    galleryItems.value = await res.json()
  } catch (error) {
    console.error('Gagal mengambil data galeri', error)
  }
}

// Nangkap multiple files dan bikin preview-nya
function handleFileChange(event) {
  const files = event.target.files
  if (!files.length) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    // Bikin URL lokal sementara biar gambarnya bisa ditampilin
    const previewUrl = URL.createObjectURL(file)
    
    pendingUploads.value.push({
      file: file,
      name: file.name,
      preview: previewUrl,
      note: '' // Catatan kosong untuk diisi admin nanti
    })
  }
  
  // Reset input file biar bisa milih file yang sama lagi kalau habis dihapus
  event.target.value = ''
}

// Batalin satu foto dari antrean
function removePending(index) {
  URL.revokeObjectURL(pendingUploads.value[index].preview) // Bersihin memori
  pendingUploads.value.splice(index, 1)
}

// Upload semua yang ada di antrean
async function uploadAllPending() {
  if (pendingUploads.value.length === 0) return

  try {
    // Pake Promise.all biar nge-push banyak data sekaligus secara paralel (lebih cepat)
    await Promise.all(pendingUploads.value.map(async (item) => {
      await fetch(API_BASE + '/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: item.name,
          note: item.note
        })
      })
    }))

    // Bersihin memori preview dan kosongkan antrean
    pendingUploads.value.forEach(item => URL.revokeObjectURL(item.preview))
    pendingUploads.value = []
    
    await fetchGallery()
    alert('Semua foto berhasil ditambahkan ke database!')
  } catch (error) {
    alert('Waduh, ada foto yang gagal diupload.')
  }
}

async function removeItem(id) {
  if (confirm('Apakah Anda yakin ingin menghapus foto ini permanen?')) {
    try {
      await fetch(API_BASE + `/api/gallery/${id}`, {
        method: 'DELETE'
      })
      await fetchGallery()
    } catch (error) {
      alert('Gagal menghapus foto.')
    }
  }
}
</script>

<template>
  <div>
    <h2 class="page-title">Manajemen Galeri</h2>

    <!-- Area Pilih File -->
    <div class="form-panel" style="margin-bottom: 24px; padding: 24px; text-align: center; border: 2px dashed #000; background: rgba(255, 211, 57, 0.1);">
      <UploadCloud :size="48" style="margin: 0 auto 12px; color: #02a554;" />
      <h3 style="margin: 0 0 8px; font-size: 20px;">Upload</h3>
      <p style="margin: 0 0 16px; color: #555;">Pilih satu atau banyak foto sekaligus untuk ditambahkan ke galeri.</p>
      
      <label class="file-btn" style="padding: 12px 24px; font-size: 16px;">
        <Plus :size="18" style="display: inline; vertical-align: middle; margin-right: 6px;" />
        Pilih Gambar
        <!-- Tambahin multiple biar bisa select banyak file -->
        <input type="file" accept="image/*" multiple hidden @change="handleFileChange" />
      </label>
    </div>

    <!-- Area Preview & Input Catatan -->
    <div v-if="pendingUploads.length > 0" class="form-panel" style="margin-bottom: 24px; padding: 20px; background: #fff;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0;">Antrean Upload ({{ pendingUploads.length }} foto)</h3>
        <button type="button" class="btn-primary" @click="uploadAllPending" style="background: #02a554; color: #fff;">
          Upload Semua Sekarang
        </button>
      </div>

      <div class="preview-grid">
        <div v-for="(item, index) in pendingUploads" :key="index" class="preview-card">
          <button type="button" class="btn-close" @click="removePending(index)">
            <X :size="16" />
          </button>
          <img :src="item.preview" class="preview-img" alt="Preview" />
          <div style="padding: 12px;">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; word-break: break-all;">{{ item.name }}</p>
            <input v-model="item.note" type="text" class="form-input" placeholder="Tulis catatan di sini..." style="border-width: 1px; padding: 8px; font-size: 13px;" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Data Galeri -->
    <div class="form-panel">
      <h3 style="margin-top: 0; margin-bottom: 16px;">Daftar Foto di Database</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 60px; text-align: center;">No</th>
            <th style="width: 150px; text-align: center;">Gambar</th>
            <th>Nama File & Catatan</th>
            <th style="width: 80px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in galleryItems" :key="item.id">
            <td style="text-align: center; font-weight: bold;">{{ index + 1 }}</td>
            <td style="text-align: center; padding: 8px;">
              <!-- Kita asumsikan file sudah di-copy ke folder public admin -->
              <img :src="'/' + item.image_url" alt="Thumbnail" style="width: 100px; height: 70px; object-fit: cover; border: 1px solid #000; border-radius: 4px;" />
            </td>
            <td>
              <div style="font-weight: 800; color: #02a554; margin-bottom: 4px;">{{ item.image_url }}</div>
              <div style="font-size: 14px;">{{ item.note || 'Tidak ada catatan' }}</div>
            </td>
            <td style="text-align: center;">
              <button type="button" style="background: none; border: none; color: #c00; cursor: pointer" title="Hapus" @click="removeItem(item.id)">
                <Trash2 :size="20" />
              </button>
            </td>
          </tr>
          <tr v-if="galleryItems.length === 0">
            <td colspan="4" style="text-align: center; padding: 24px; font-style: italic; color: #666;">
              Database galeri masih kosong.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.file-btn { display: inline-block; background-color: #ffd339; color: #000; border: 2px solid #000; border-radius: 6px; padding: 10px 16px; cursor: pointer; font-weight: 700; box-shadow: 0px 3px 0px #000; transition: all 0.1s; }
.file-btn:hover { transform: translateY(-1px); box-shadow: 0px 4px 0px #000; }
.file-btn:active { transform: translateY(1px); box-shadow: 0px 1px 0px #000; }
.btn-primary { display: inline-block; background-color: #ffd339; color: #000; border: 2px solid #000; border-radius: 6px; padding: 10px 16px; cursor: pointer; font-weight: 700; box-shadow: 0px 3px 0px #000; transition: all 0.1s; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0px 4px 0px #000; }
.btn-primary:active { transform: translateY(1px); box-shadow: 0px 1px 0px #000; }
.form-input { width: 100%; padding: 10px 14px; border: 2px solid #000; border-radius: 8px; background-color: #f7f7f7; color: #000; box-sizing: border-box; transition: 0.2s; }
.form-input:focus { outline: none; border-color: #02a554; background-color: #fff; }

/* Styling Tabel */
.data-table { width: 100%; border-spacing: 0; border-collapse: separate; background-color: #f3edd9; border: 2px solid #000; border-radius: 8px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15); }
.data-table thead th { background-color: #ffd339; color: #000; font-size: 16px; font-weight: 800; padding: 14px 16px; text-align: left; border-bottom: 2px solid #000; }
.data-table tbody td { background-color: #f3edd9; color: #000; padding: 14px 16px; border-bottom: 1px solid #d6d6d6; vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: none; }

/* Styling Grid Preview */
.preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.preview-card { position: relative; border: 2px solid #000; border-radius: 8px; overflow: hidden; background: #f3edd9; box-shadow: 0px 4px 0px rgba(0,0,0,0.1); }
.preview-img { width: 100%; height: 140px; object-fit: cover; border-bottom: 2px solid #000; }
.btn-close { position: absolute; top: 8px; right: 8px; background: #ff4d4d; color: white; border: 2px solid #000; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; transition: transform 0.1s; }
.btn-close:hover { transform: scale(1.1); }
</style>