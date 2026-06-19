<!--
  App.vue - Component Root (Wrapper)

  File ini adalah component paling atas di aplikasi Vue.
  Isinya cuma <RouterView /> yang artinya:
  "Tampilkan halaman apapun yang cocok sama URL saat ini."

  Contoh: URL "/" → tampilkan HomeView (landing page)

  Semua halaman dibungkus oleh component ini.
  Kalau mau bikin layout global (navbar/footer yang selalu muncul), taruh di sini.
-->
<template>
  <RouterView />
</template>
