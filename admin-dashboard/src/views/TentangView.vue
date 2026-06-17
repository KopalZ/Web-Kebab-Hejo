<script setup>
import { ref } from 'vue'
import { Save, Camera } from 'lucide-vue-next'

const mediaFile = ref(null)

function handleUpload(event) {
  const file = event.target.files?.[0]
  if (file) mediaFile.value = file.name
}

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
