<!--
  ================================================================
  TentangView.vue — Halaman Admin untuk Mengelola "Tentang Kami"
  ================================================================

  FUNGSI HALAMAN INI:
  Menyediakan form untuk admin mengupload foto/video yang akan
  ditampilkan di bagian "Tentang Kami" pada landing page.

  STATUS: BELUM TERHUBUNG KE BACKEND
  Saat ini halaman ini masih berupa placeholder / tampilan saja.
  Fungsi saveChanges() hanya menampilkan alert, belum mengirim
  data ke API backend.

  RENCANA KONEKSI KE BACKEND (BELUM DIIMPLEMENTASI):
  ┌─────────────────────────────────────────────────────────────────┐
  │ Method │ Endpoint                  │ Fungsi                     │
  ├─────────────────────────────────────────────────────────────────┤
  │ POST   │ /api/settings/about-media │ Upload foto/video tentang  │
  │ GET    │ /api/settings/about-media │ Ambil media yang sudah ada │
  └─────────────────────────────────────────────────────────────────┘

  FITUR SAAT INI:
  1. Upload zone untuk pilih file foto/video (baru simpan nama file di variabel)
  2. Tombol "Simpan Perubahan" (belum berfungsi, hanya alert)

  CATATAN:
  Halaman AboutSection.vue di frontend saat ini masih menggunakan
  data statis (hardcoded), belum mengambil dari database.
-->
<script setup>
import { ref } from 'vue'
import { Save, Camera } from 'lucide-vue-next'

// Variabel penampung nama file yang dipilih admin (belum dikirim ke backend)
const mediaFile = ref(null)

// Tangkap file yang dipilih dari input file
function handleUpload(event) {
  const file = event.target.files?.[0]
  if (file) mediaFile.value = file.name
}

// Simpan perubahan — BELUM TERHUBUNG KE BACKEND, hanya alert
function saveChanges() {
  alert('Perubahan tentang kami disimpan (hubungkan ke API backend).')
}
</script>

<template>
  <div>
    <h2 class="page-title">Manajemen Tentang Kami</h2>

    <div class="btn-group">
      <button type="button" class="btn-primary" @click="saveChanges">
        <Save :size="18" />
        Simpan Perubahan
      </button>
    </div>

    <div class="form-panel">
      <div>
        <div class="form-label">Media Tentang Kami</div>
        <label class="upload-zone">
          <Camera :size="40" />
          <span>Klik untuk unggah foto / video</span>
          <span v-if="mediaFile" style="font-size: 13px">{{ mediaFile }}</span>
          <input type="file" accept="image/*,video/*" hidden @change="handleUpload" />
        </label>
      </div>
    </div>
  </div>
</template>
