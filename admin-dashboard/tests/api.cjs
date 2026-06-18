/**
 * =============================================
 * API Test Suite - Backend Grand Kebab Hejo
 * =============================================
 *
 * File ini berisi kumpulan test untuk ngetest semua endpoint API
 * yang ada di backend (https://backend-kebab-production.up.railway.app).
 *
 * Endpoint-nya dipakai oleh 2 frontend:
 *
 * 1. Landing Page (frontend) - website publik yang dilihat visitor
 *    - Menu Section   → GET /api/menus (tampil daftar menu + harga)
 *    - Gallery Section → GET /api/gallery (tampil foto dokumentasi)
 *    - Hero Section    → GET /api/hero-slides (carousel banner)
 *    - Coverage Section → GET /api/outlets (lokasi cabang)
 *    - Tombol Franchise → GET /api/settings/franchise-link (link WA)
 *
 * 2. Admin Dashboard - halaman admin untuk kelola konten
 *    - Login           → POST /api/login
 *    - Katalog Menu    → GET/POST/PUT/DELETE /api/products
 *    - Lokasi Cabang   → GET/POST/DELETE /api/outlets
 *    - Galeri          → GET/POST/DELETE /api/gallery
 *    - Hero Slides     → GET/POST/DELETE /api/hero-slides
 *    - Franchise Link  → GET/POST /api/settings/franchise-link
 *
 * Cara pakai:
 *   cd admin-dashboard
 *   npm run test:api
 *
 * Total: 63 test
 * Pola test CRUD: buat data → cek hasilnya → hapus (biar database bersih)
 */

const API_BASE = 'https://backend-kebab-production.up.railway.app';

let passed = 0;
let failed = 0;

// Fungsi bantu buat ngecek apakah hasil sesuai ekspektasi
function assert(condition, message) {
  if (condition) {
    console.log('  PASS: ' + message);
    passed++;
  } else {
    console.log('  FAIL: ' + message);
    failed++;
  }
}

// Fungsi bantu buat jalanin satu test case
async function test(name, fn) {
  console.log('\n' + name);
  try {
    await fn();
  } catch (e) {
    console.log('  ERROR: ' + e.message);
    failed++;
  }
}

(async () => {
  console.log('=== API Tests: Backend ===');
  console.log('Target: ' + API_BASE);

  // ============================================
  // BAGIAN 1: READ (GET) - Endpoint buat baca data
  // Dipakai oleh Landing Page DAN Admin Dashboard
  // ============================================

  // --------------------------------------------------
  // GET /api/menus
  // Endpoint utama buat ambil semua kategori beserta produknya.
  // - Landing Page: tampil di Menu Section, visitor bisa lihat daftar menu + harga
  // - Admin Dashboard: tampil di halaman Katalog Menu, admin bisa lihat semua produk
  // Response yang diharapkan: array of categories, masing-masing punya array products
  // --------------------------------------------------
  await test('GET /api/menus - ambil semua kategori dan produk', async () => {
    const res = await fetch(API_BASE + '/api/menus');
    assert(res.ok, 'Response berhasil dengan status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response berupa array');
    assert(data.length > 0, 'Minimal ada 1 kategori (didapat ' + data.length + ' kategori)');

    const firstCategory = data[0];
    assert(typeof firstCategory.name === 'string', 'Kategori punya nama: "' + firstCategory.name + '"');
    assert(Array.isArray(firstCategory.products), 'Kategori punya array products');

    if (firstCategory.products.length > 0) {
      const product = firstCategory.products[0];
      assert(typeof product.name === 'string' && product.name.length > 0, 'Produk punya nama (tidak kosong): "' + product.name + '"');
      assert(typeof product.price === 'number', 'Produk punya harga berupa angka: ' + product.price);
      assert(typeof product.id === 'number', 'Produk punya id berupa angka: ' + product.id);
      assert(typeof product.categoryId === 'number', 'Produk punya categoryId: ' + product.categoryId);
    }
  });

  // --------------------------------------------------
  // Validasi nama produk
  // Ngecek apakah SEMUA produk di database punya nama (ga ada yang kosong).
  // Penting karena kartu menu di landing page dan dashboard nampilin nama produk.
  // Kalau nama kosong, kartu menu-nya bakal kelihatan jelek/bug.
  // --------------------------------------------------
  await test('Validasi: semua produk punya nama (tidak kosong)', async () => {
    const res = await fetch(API_BASE + '/api/menus');
    const data = await res.json();

    let totalProducts = 0;
    let emptyNames = 0;

    data.forEach((cat) => {
      cat.products.forEach((p) => {
        totalProducts++;
        if (!p.name || p.name.trim() === '') emptyNames++;
      });
    });

    assert(totalProducts > 0, 'Total produk di database: ' + totalProducts);
    assert(emptyNames === 0, 'Tidak ada produk dengan nama kosong (ditemukan ' + emptyNames + ')');
  });

  // --------------------------------------------------
  // GET /api/outlets
  // Endpoint buat ambil data kota beserta cabang/outlet-nya.
  // - Landing Page: tampil di Coverage Section (peta jangkauan cabang)
  // - Admin Dashboard: tampil di halaman Lokasi (kelola cabang)
  // Response: array of cities, masing-masing punya array outlets
  // --------------------------------------------------
  await test('GET /api/outlets - ambil data kota dan cabang', async () => {
    const res = await fetch(API_BASE + '/api/outlets');
    assert(res.ok, 'Response berhasil dengan status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response berupa array');

    if (data.length > 0) {
      assert(typeof data[0].name === 'string', 'Kota punya nama');
      assert(Array.isArray(data[0].outlets), 'Kota punya array outlets (daftar cabang)');
    }
  });

  // --------------------------------------------------
  // GET /api/gallery
  // Endpoint buat ambil semua foto galeri/dokumentasi.
  // - Landing Page: tampil di Gallery Section (grid foto dokumentasi)
  // - Admin Dashboard: tampil di halaman Galeri (upload/hapus foto)
  // Response: array of gallery items, masing-masing punya image_url dan id
  // --------------------------------------------------
  await test('GET /api/gallery - ambil data galeri foto', async () => {
    const res = await fetch(API_BASE + '/api/gallery');
    assert(res.ok, 'Response berhasil dengan status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response berupa array');

    if (data.length > 0) {
      assert(typeof data[0].image_url === 'string', 'Item galeri punya image_url (path gambar)');
      assert(typeof data[0].id === 'number', 'Item galeri punya id (buat referensi hapus)');
    }
  });

  // --------------------------------------------------
  // GET /api/hero-slides
  // Endpoint buat ambil daftar slide carousel di hero section.
  // - Landing Page: tampil sebagai carousel/banner geser di Hero Section
  // - Admin Dashboard: tampil di halaman Hero (kelola slide banner)
  // Response: array of slides, masing-masing punya image_url
  // --------------------------------------------------
  await test('GET /api/hero-slides - ambil daftar slide hero', async () => {
    const res = await fetch(API_BASE + '/api/hero-slides');
    assert(res.ok, 'Response berhasil dengan status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response berupa array');

    if (data.length > 0) {
      assert(typeof data[0].image_url === 'string', 'Slide punya image_url (path gambar banner)');
    }
  });

  // --------------------------------------------------
  // GET /api/settings/franchise-link
  // Endpoint buat ambil link franchise (biasanya link WhatsApp).
  // - Landing Page: dipakai tombol "Gabung Franchise" di Hero Section
  // - Admin Dashboard: tampil di halaman Settings (ubah link franchise)
  // Response: object dengan field key dan value
  // --------------------------------------------------
  await test('GET /api/settings/franchise-link - ambil link franchise', async () => {
    const res = await fetch(API_BASE + '/api/settings/franchise-link');
    assert(res.ok, 'Response berhasil dengan status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.value === 'string', 'Setting punya value (link franchise)');
    assert(data.key === 'franchise_link', 'Key setting adalah "franchise_link"');
  });

  // ============================================
  // BAGIAN 2: AUTH - Endpoint autentikasi
  // Dipakai oleh Admin Dashboard (halaman Login)
  // ============================================

  // --------------------------------------------------
  // POST /api/login (sukses)
  // Endpoint buat login admin. Kalau username & password cocok,
  // backend return token dan dashboard redirect ke halaman utama.
  // Akun default: username "admin", password "password123"
  // --------------------------------------------------
  await test('POST /api/login - login dengan credential benar', async () => {
    const res = await fetch(API_BASE + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password123' })
    });

    assert(res.ok, 'Response berhasil dengan status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(data.message === 'Login sukses', 'Pesan response: "Login sukses"');
    assert(typeof data.token === 'string', 'Response mengandung token autentikasi');
  });

  // --------------------------------------------------
  // POST /api/login (gagal)
  // Kalau username atau password salah, backend return status 401.
  // Dashboard harus nampilin pesan error ke user.
  // --------------------------------------------------
  await test('POST /api/login - login dengan credential salah (harus 401)', async () => {
    const res = await fetch(API_BASE + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong', password: 'wrong' })
    });

    assert(res.status === 401, 'Status harus 401 Unauthorized (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.error === 'string', 'Response mengandung pesan error');
  });

  // ============================================
  // BAGIAN 3: CORS - Cross-Origin Resource Sharing
  // Harus di-set biar frontend (Vercel) bisa akses backend (Railway)
  // ============================================

  // --------------------------------------------------
  // Cek CORS headers
  // Backend harus ngirim header Access-Control-Allow-Origin: *
  // supaya request dari domain Vercel (landing page + dashboard) tidak diblokir browser.
  // --------------------------------------------------
  await test('CORS - header harus allow semua origin', async () => {
    const res = await fetch(API_BASE + '/api/menus', {
      method: 'OPTIONS'
    });

    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert(allowOrigin === '*', 'Access-Control-Allow-Origin bernilai * (semua domain boleh akses)');
  });

  // --------------------------------------------------
  // Error handling: DELETE produk yang tidak ada
  // Kalau admin coba hapus produk dengan ID yang ga ada di database,
  // backend harus return error (bukan crash/hang).
  // --------------------------------------------------
  await test('Error handling - hapus produk yang tidak ada', async () => {
    const res = await fetch(API_BASE + '/api/products/999999', {
      method: 'DELETE'
    });

    assert(!res.ok || res.status === 500, 'Response error saat hapus produk fiktif (status ' + res.status + ')');
  });

  // ============================================
  // BAGIAN 4: CRUD - Create, Read, Update, Delete
  // Dipakai oleh Admin Dashboard saja (bukan landing page)
  //
  // Pola test:
  //   1. POST  → bikin data baru, simpan ID-nya
  //   2. GET   → cek data baru muncul di listing
  //   3. PUT   → edit data tersebut (kalau ada endpoint-nya)
  //   4. DELETE → hapus data tersebut + cek udah ga ada
  //
  // Tujuannya biar database tetap bersih setelah test selesai.
  // ============================================

  // --------------------------------------------------
  // CRUD PRODUK (Katalog Menu)
  // Admin bisa: tambah menu baru, edit menu, hapus menu
  // Endpoint: POST/PUT/DELETE /api/products
  // --------------------------------------------------

  // Step 1: POST - bikin produk test baru
  let testProductId = null;
  await test('CRUD Produk - POST: tambah menu baru', async () => {
    const res = await fetch(API_BASE + '/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Menu QA', price: 99000, categoryId: 1, image_url: 'test.jpg' })
    });
    assert(res.ok, 'Produk berhasil dibuat, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Produk baru punya id: ' + data.id);
    assert(data.name === 'Test Menu QA', 'Nama produk sesuai input: "Test Menu QA"');
    assert(data.price === 99000, 'Harga produk sesuai input: 99000');
    testProductId = data.id;
  });

  // Step 2: READ - cek produk baru muncul di listing /api/menus
  await test('CRUD Produk - READ: cek produk baru muncul di daftar menu', async () => {
    if (!testProductId) { console.log('  SKIP: produk test belum terbuat'); return; }
    const res = await fetch(API_BASE + '/api/menus');
    const data = await res.json();
    const allProducts = data.flatMap(c => c.products);
    const found = allProducts.find(p => p.id === testProductId);
    assert(found !== undefined, 'Produk test ditemukan di daftar menu (id: ' + testProductId + ')');
    if (found) assert(found.name === 'Test Menu QA', 'Nama produk di listing benar: "Test Menu QA"');
  });

  // Step 3: PUT - edit produk (ubah nama, harga, gambar)
  await test('CRUD Produk - PUT: edit nama dan harga menu', async () => {
    if (!testProductId) { console.log('  SKIP: produk test belum terbuat'); return; }
    const res = await fetch(API_BASE + '/api/products/' + testProductId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Menu Edited', price: 50000, categoryId: 1, image_url: 'edited.jpg' })
    });
    assert(res.ok, 'Produk berhasil diedit, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(data.name === 'Test Menu Edited', 'Nama produk berhasil diubah jadi "Test Menu Edited"');
    assert(data.price === 50000, 'Harga produk berhasil diubah jadi 50000');
  });

  // Step 4: DELETE - hapus produk, lalu verifikasi udah ga ada di listing
  await test('CRUD Produk - DELETE: hapus menu + verifikasi hilang', async () => {
    if (!testProductId) { console.log('  SKIP: produk test belum terbuat'); return; }
    const res = await fetch(API_BASE + '/api/products/' + testProductId, { method: 'DELETE' });
    assert(res.ok, 'Produk berhasil dihapus, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response mengandung pesan sukses');

    // Verifikasi: produk harusnya udah ga ada di listing
    const res2 = await fetch(API_BASE + '/api/menus');
    const menus = await res2.json();
    const allProducts = menus.flatMap(c => c.products);
    const found = allProducts.find(p => p.id === testProductId);
    assert(!found, 'Produk sudah tidak ada di daftar menu setelah dihapus');
    testProductId = null;
  });

  // --------------------------------------------------
  // CRUD OUTLET (Lokasi Cabang)
  // Admin bisa: tambah cabang baru, hapus cabang
  // Endpoint: POST/DELETE /api/outlets
  // --------------------------------------------------

  // Step 1: POST - bikin outlet test baru (pakai cityId pertama yang ada di DB)
  let testOutletId = null;
  await test('CRUD Outlet - POST: tambah cabang baru', async () => {
    const resCities = await fetch(API_BASE + '/api/outlets');
    const cities = await resCities.json();
    if (cities.length === 0) { console.log('  SKIP: belum ada kota di database'); return; }
    const cityId = cities[0].id;

    const res = await fetch(API_BASE + '/api/outlets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Outlet Test QA', address: 'Jl. Testing No. 1', gmaps_url: 'https://maps.google.com/test', cityId: cityId })
    });
    assert(res.ok, 'Outlet berhasil dibuat, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Outlet baru punya id: ' + data.id);
    assert(data.name === 'Outlet Test QA', 'Nama outlet sesuai input: "Outlet Test QA"');
    testOutletId = data.id;
  });

  // Step 2: DELETE - hapus outlet test
  await test('CRUD Outlet - DELETE: hapus cabang test', async () => {
    if (!testOutletId) { console.log('  SKIP: outlet test belum terbuat'); return; }
    const res = await fetch(API_BASE + '/api/outlets/' + testOutletId, { method: 'DELETE' });
    assert(res.ok, 'Outlet berhasil dihapus, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response mengandung pesan sukses');
    testOutletId = null;
  });

  // --------------------------------------------------
  // CRUD GALERI (Foto Dokumentasi)
  // Admin bisa: upload foto baru, hapus foto
  // Endpoint: POST/DELETE /api/gallery
  // --------------------------------------------------

  // Step 1: POST - upload foto galeri test
  let testGalleryId = null;
  await test('CRUD Galeri - POST: upload foto galeri baru', async () => {
    const res = await fetch(API_BASE + '/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: 'test-gallery-qa.jpg', note: 'Catatan test galeri' })
    });
    assert(res.ok, 'Foto galeri berhasil diupload, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Foto galeri baru punya id: ' + data.id);
    assert(data.image_url === 'test-gallery-qa.jpg', 'image_url sesuai input: "test-gallery-qa.jpg"');
    testGalleryId = data.id;
  });

  // Step 2: DELETE - hapus foto galeri test, lalu verifikasi udah ga ada
  await test('CRUD Galeri - DELETE: hapus foto + verifikasi hilang', async () => {
    if (!testGalleryId) { console.log('  SKIP: galeri test belum terbuat'); return; }
    const res = await fetch(API_BASE + '/api/gallery/' + testGalleryId, { method: 'DELETE' });
    assert(res.ok, 'Foto galeri berhasil dihapus, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response mengandung pesan sukses');

    // Verifikasi: foto harusnya udah ga ada di listing galeri
    const res2 = await fetch(API_BASE + '/api/gallery');
    const gallery = await res2.json();
    const found = gallery.find(g => g.id === testGalleryId);
    assert(!found, 'Foto galeri sudah tidak ada di listing setelah dihapus');
    testGalleryId = null;
  });

  // --------------------------------------------------
  // CRUD HERO SLIDES (Carousel Banner)
  // Admin bisa: tambah slide baru, hapus slide
  // Endpoint: POST/DELETE /api/hero-slides
  // --------------------------------------------------

  // Step 1: POST - bikin slide hero test
  let testSlideId = null;
  await test('CRUD Hero Slide - POST: tambah slide banner baru', async () => {
    const res = await fetch(API_BASE + '/api/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: 'test-slide-qa.jpg', note: 'Catatan test slide' })
    });
    assert(res.ok, 'Hero slide berhasil dibuat, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Slide baru punya id: ' + data.id);
    assert(data.image_url === 'test-slide-qa.jpg', 'image_url sesuai input: "test-slide-qa.jpg"');
    testSlideId = data.id;
  });

  // Step 2: DELETE - hapus slide hero test, lalu verifikasi udah ga ada
  await test('CRUD Hero Slide - DELETE: hapus slide + verifikasi hilang', async () => {
    if (!testSlideId) { console.log('  SKIP: slide test belum terbuat'); return; }
    const res = await fetch(API_BASE + '/api/hero-slides/' + testSlideId, { method: 'DELETE' });
    assert(res.ok, 'Hero slide berhasil dihapus, status 200 (didapat ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response mengandung pesan sukses');

    // Verifikasi: slide harusnya udah ga ada di listing
    const res2 = await fetch(API_BASE + '/api/hero-slides');
    const slides = await res2.json();
    const found = slides.find(s => s.id === testSlideId);
    assert(!found, 'Hero slide sudah tidak ada di listing setelah dihapus');
    testSlideId = null;
  });

  // --------------------------------------------------
  // CRUD FRANCHISE LINK (Pengaturan)
  // Admin bisa: ubah link franchise (biasanya link WhatsApp)
  // Endpoint: POST /api/settings/franchise-link
  // Catatan: test ini simpan link asli dulu, ubah, lalu balikin lagi
  // --------------------------------------------------

  // Step 1: POST - ubah link franchise ke nilai test
  let originalLink = null;
  await test('CRUD Settings - POST: ubah link franchise', async () => {
    // Simpan link asli biar bisa dibalikin nanti
    const resGet = await fetch(API_BASE + '/api/settings/franchise-link');
    const origData = await resGet.json();
    originalLink = origData.value;

    const res = await fetch(API_BASE + '/api/settings/franchise-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: 'https://wa.me/test-qa-123' })
    });
    assert(res.ok, 'Link franchise berhasil diubah, status 200 (didapat ' + res.status + ')');

    // Verifikasi: link harusnya sudah berubah
    const res2 = await fetch(API_BASE + '/api/settings/franchise-link');
    const data = await res2.json();
    assert(data.value === 'https://wa.me/test-qa-123', 'Link franchise berhasil diubah ke nilai test');
  });

  // Step 2: RESTORE - balikin link franchise ke nilai asli
  await test('CRUD Settings - RESTORE: balikin link franchise ke nilai asli', async () => {
    if (!originalLink) { console.log('  SKIP: link asli belum tersimpan'); return; }
    const res = await fetch(API_BASE + '/api/settings/franchise-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: originalLink })
    });
    assert(res.ok, 'Link franchise berhasil dibalikin, status 200 (didapat ' + res.status + ')');

    // Verifikasi: link harusnya sudah kembali ke nilai asli
    const res2 = await fetch(API_BASE + '/api/settings/franchise-link');
    const data = await res2.json();
    assert(data.value === originalLink, 'Link franchise sudah kembali ke nilai asli: ' + originalLink);
  });

  // --- HASIL AKHIR ---
  console.log('\n=== Hasil Test ===');
  console.log('Lolos:  ' + passed);
  console.log('Gagal:  ' + failed);
  console.log('Total:  ' + (passed + failed));

  process.exit(failed > 0 ? 1 : 0);
})();
