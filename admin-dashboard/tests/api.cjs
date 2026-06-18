/**
 * API Test Suite - Backend Grand Kebab Hejo
 *
 * File ini ngetest semua endpoint API yang dipakai oleh:
 * - Landing Page (frontend)  → tampil menu, galeri, hero slide, outlet, franchise link
 * - Admin Dashboard          → CRUD menu, outlet, galeri, hero slide, franchise link, login
 *
 * Jalankan: npm run test:api (dari folder admin-dashboard)
 * Total: 63 test | Pola: create → verify → cleanup (data test ga tertinggal di DB)
 */

const API_BASE = 'https://backend-kebab-production.up.railway.app';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  PASS: ' + message);
    passed++;
  } else {
    console.log('  FAIL: ' + message);
    failed++;
  }
}

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
  // READ TESTS (GET) - dipakai Landing Page + Admin Dashboard
  // ============================================

  // Ambil semua kategori + produk → dipakai Menu Section (landing page) & Katalog Menu (dashboard)
  await test('GET /api/menus returns categories with products', async () => {
    const res = await fetch(API_BASE + '/api/menus');
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response is an array');
    assert(data.length > 0, 'At least one category exists (' + data.length + ')');

    const firstCategory = data[0];
    assert(typeof firstCategory.name === 'string', 'Category has a name: "' + firstCategory.name + '"');
    assert(Array.isArray(firstCategory.products), 'Category has products array');

    if (firstCategory.products.length > 0) {
      const product = firstCategory.products[0];
      assert(typeof product.name === 'string' && product.name.length > 0, 'Product has non-empty name: "' + product.name + '"');
      assert(typeof product.price === 'number', 'Product has numeric price: ' + product.price);
      assert(typeof product.id === 'number', 'Product has numeric id: ' + product.id);
      assert(typeof product.categoryId === 'number', 'Product has categoryId: ' + product.categoryId);
    }
  });

  // Validasi semua produk punya nama (ga ada yang kosong) → penting buat tampilan kartu menu
  await test('All products across categories have non-empty names', async () => {
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

    assert(totalProducts > 0, 'Total products found: ' + totalProducts);
    assert(emptyNames === 0, 'No products with empty names (found ' + emptyNames + ' empty)');
  });

  // Ambil data kota + cabang → dipakai Coverage Section (landing page) & Lokasi (dashboard)
  await test('GET /api/outlets returns cities with outlets', async () => {
    const res = await fetch(API_BASE + '/api/outlets');
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response is an array');

    if (data.length > 0) {
      assert(typeof data[0].name === 'string', 'City has a name');
      assert(Array.isArray(data[0].outlets), 'City has outlets array');
    }
  });

  // Ambil foto galeri → dipakai Gallery Section (landing page) & Galeri (dashboard)
  await test('GET /api/gallery returns gallery data', async () => {
    const res = await fetch(API_BASE + '/api/gallery');
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response is an array');

    if (data.length > 0) {
      assert(typeof data[0].image_url === 'string', 'Gallery item has image_url');
      assert(typeof data[0].id === 'number', 'Gallery item has id');
    }
  });

  // Ambil slide hero → dipakai Hero Section carousel (landing page) & Hero (dashboard)
  await test('GET /api/hero-slides returns slides', async () => {
    const res = await fetch(API_BASE + '/api/hero-slides');
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response is an array');

    if (data.length > 0) {
      assert(typeof data[0].image_url === 'string', 'Slide has image_url');
    }
  });

  // Ambil link franchise → dipakai tombol "Gabung Franchise" (landing page) & Settings (dashboard)
  await test('GET /api/settings/franchise-link returns link', async () => {
    const res = await fetch(API_BASE + '/api/settings/franchise-link');
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.value === 'string', 'Setting has a value');
    assert(data.key === 'franchise_link', 'Setting key is franchise_link');
  });

  // ============================================
  // AUTH TESTS - dipakai Login View (admin dashboard)
  // ============================================

  // Login sukses → admin dashboard redirect ke halaman utama
  await test('POST /api/login with correct credentials', async () => {
    const res = await fetch(API_BASE + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password123' })
    });

    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(data.message === 'Login sukses', 'Response message is "Login sukses"');
    assert(typeof data.token === 'string', 'Response contains a token');
  });

  // Login gagal → tampilkan pesan error di form login
  await test('POST /api/login with wrong credentials returns 401', async () => {
    const res = await fetch(API_BASE + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong', password: 'wrong' })
    });

    assert(res.status === 401, 'Status is 401 Unauthorized (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.error === 'string', 'Response contains error message');
  });

  // ============================================
  // CORS TEST - harus allow kedua frontend (landing page + dashboard)
  // ============================================

  await test('CORS headers are set correctly', async () => {
    const res = await fetch(API_BASE + '/api/menus', {
      method: 'OPTIONS'
    });

    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert(allowOrigin === '*', 'Access-Control-Allow-Origin is *');
  });

  // Error handling: hapus produk yang ga ada → harusnya error, bukan crash
  await test('DELETE non-existent product returns error', async () => {
    const res = await fetch(API_BASE + '/api/products/999999', {
      method: 'DELETE'
    });

    assert(!res.ok || res.status === 500, 'Deleting non-existent product returns error (got ' + res.status + ')');
  });

  // ============================================
  // CRUD TESTS - dipakai Admin Dashboard saja
  // Pola: buat data → cek → hapus (biar DB bersih)
  // ============================================

  // --- PRODUK (Katalog Menu) ---

  // POST: tambah menu baru dari dashboard
  let testProductId = null;
  await test('POST /api/products - tambah menu baru', async () => {
    const res = await fetch(API_BASE + '/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Menu QA', price: 99000, categoryId: 1, image_url: 'test.jpg' })
    });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Product created with id: ' + data.id);
    assert(data.name === 'Test Menu QA', 'Product name matches');
    assert(data.price === 99000, 'Product price matches');
    testProductId = data.id;
  });

  // Cek produk baru muncul di daftar menu
  await test('Produk baru muncul di GET /api/menus', async () => {
    if (!testProductId) { console.log('  SKIP: no test product created'); return; }
    const res = await fetch(API_BASE + '/api/menus');
    const data = await res.json();
    const allProducts = data.flatMap(c => c.products);
    const found = allProducts.find(p => p.id === testProductId);
    assert(found !== undefined, 'Test product found in menus (id: ' + testProductId + ')');
    if (found) assert(found.name === 'Test Menu QA', 'Product name correct in menus listing');
  });

  // PUT: edit menu dari dashboard (ubah nama, harga, kategori, gambar)
  await test('PUT /api/products/:id - edit menu', async () => {
    if (!testProductId) { console.log('  SKIP: no test product created'); return; }
    const res = await fetch(API_BASE + '/api/products/' + testProductId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Menu Edited', price: 50000, categoryId: 1, image_url: 'edited.jpg' })
    });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(data.name === 'Test Menu Edited', 'Product name updated');
    assert(data.price === 50000, 'Product price updated');
  });

  // DELETE: hapus menu dari dashboard, lalu cek udah ga ada di daftar
  await test('DELETE /api/products/:id - hapus menu test', async () => {
    if (!testProductId) { console.log('  SKIP: no test product created'); return; }
    const res = await fetch(API_BASE + '/api/products/' + testProductId, { method: 'DELETE' });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response contains success message');

    const res2 = await fetch(API_BASE + '/api/menus');
    const menus = await res2.json();
    const allProducts = menus.flatMap(c => c.products);
    const found = allProducts.find(p => p.id === testProductId);
    assert(!found, 'Product no longer in menus after delete');
    testProductId = null;
  });

  // --- OUTLET (Lokasi Cabang) ---

  // POST: tambah cabang baru dari dashboard
  let testOutletId = null;
  await test('POST /api/outlets - tambah cabang baru', async () => {
    const resCities = await fetch(API_BASE + '/api/outlets');
    const cities = await resCities.json();
    if (cities.length === 0) { console.log('  SKIP: no cities in DB'); return; }
    const cityId = cities[0].id;

    const res = await fetch(API_BASE + '/api/outlets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Outlet Test QA', address: 'Jl. Testing No. 1', gmaps_url: 'https://maps.google.com/test', cityId: cityId })
    });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Outlet created with id: ' + data.id);
    assert(data.name === 'Outlet Test QA', 'Outlet name matches');
    testOutletId = data.id;
  });

  // DELETE: hapus cabang dari dashboard
  await test('DELETE /api/outlets/:id - hapus cabang test', async () => {
    if (!testOutletId) { console.log('  SKIP: no test outlet created'); return; }
    const res = await fetch(API_BASE + '/api/outlets/' + testOutletId, { method: 'DELETE' });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response contains success message');
    testOutletId = null;
  });

  // --- GALERI (Foto Dokumentasi) ---

  // POST: upload foto galeri baru dari dashboard
  let testGalleryId = null;
  await test('POST /api/gallery - tambah foto galeri', async () => {
    const res = await fetch(API_BASE + '/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: 'test-gallery-qa.jpg', note: 'Test gallery note' })
    });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Gallery item created with id: ' + data.id);
    assert(data.image_url === 'test-gallery-qa.jpg', 'Gallery image_url matches');
    testGalleryId = data.id;
  });

  // DELETE: hapus foto galeri dari dashboard, lalu cek udah ga ada
  await test('DELETE /api/gallery/:id - hapus galeri test', async () => {
    if (!testGalleryId) { console.log('  SKIP: no test gallery created'); return; }
    const res = await fetch(API_BASE + '/api/gallery/' + testGalleryId, { method: 'DELETE' });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response contains success message');

    const res2 = await fetch(API_BASE + '/api/gallery');
    const gallery = await res2.json();
    const found = gallery.find(g => g.id === testGalleryId);
    assert(!found, 'Gallery item no longer exists after delete');
    testGalleryId = null;
  });

  // --- HERO SLIDES (Carousel Banner) ---

  // POST: tambah slide hero baru dari dashboard
  let testSlideId = null;
  await test('POST /api/hero-slides - tambah hero slide', async () => {
    const res = await fetch(API_BASE + '/api/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: 'test-slide-qa.jpg', note: 'Test slide note' })
    });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.id === 'number', 'Hero slide created with id: ' + data.id);
    assert(data.image_url === 'test-slide-qa.jpg', 'Slide image_url matches');
    testSlideId = data.id;
  });

  // DELETE: hapus slide hero dari dashboard, lalu cek udah ga ada
  await test('DELETE /api/hero-slides/:id - hapus hero slide test', async () => {
    if (!testSlideId) { console.log('  SKIP: no test slide created'); return; }
    const res = await fetch(API_BASE + '/api/hero-slides/' + testSlideId, { method: 'DELETE' });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.message === 'string', 'Response contains success message');

    const res2 = await fetch(API_BASE + '/api/hero-slides');
    const slides = await res2.json();
    const found = slides.find(s => s.id === testSlideId);
    assert(!found, 'Hero slide no longer exists after delete');
    testSlideId = null;
  });

  // --- FRANCHISE LINK (Settings) ---

  // POST: update link franchise dari dashboard (simpan link WA baru)
  let originalLink = null;
  await test('POST /api/settings/franchise-link - update link', async () => {
    const resGet = await fetch(API_BASE + '/api/settings/franchise-link');
    const origData = await resGet.json();
    originalLink = origData.value;

    const res = await fetch(API_BASE + '/api/settings/franchise-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: 'https://wa.me/test-qa-123' })
    });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const res2 = await fetch(API_BASE + '/api/settings/franchise-link');
    const data = await res2.json();
    assert(data.value === 'https://wa.me/test-qa-123', 'Franchise link updated');
  });

  // Restore: balikin link franchise ke nilai asli setelah test
  await test('Restore franchise link ke nilai asli', async () => {
    if (!originalLink) { console.log('  SKIP: original link not saved'); return; }
    const res = await fetch(API_BASE + '/api/settings/franchise-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: originalLink })
    });
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const res2 = await fetch(API_BASE + '/api/settings/franchise-link');
    const data = await res2.json();
    assert(data.value === originalLink, 'Franchise link restored to original');
  });

  // --- HASIL ---
  console.log('\n=== Results ===');
  console.log('Passed: ' + passed);
  console.log('Failed: ' + failed);
  console.log('Total:  ' + (passed + failed));

  process.exit(failed > 0 ? 1 : 0);
})();
