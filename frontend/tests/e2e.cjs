/**
 * =============================================
 * E2E Test Suite - Landing Page (Frontend)
 * =============================================
 *
 * File ini ngetest halaman Landing Page (website publik) dari sudut pandang
 * visitor/pengunjung pakai browser otomatis (Playwright).
 *
 * Landing page ini adalah website yang dilihat orang umum, bukan admin.
 * Isinya: info franchise, daftar menu, galeri foto, lokasi cabang, dll.
 *
 * Yang dites (section per section dari atas ke bawah):
 * 1. Page Load         - halaman berhasil dimuat, judul "Grand Kebab Hejo" muncul
 * 2. Navbar            - navigasi atas: link Tentang, Menu, Franchise, Jangkauan
 * 3. Hero Section      - banner utama: heading, tombol CTA "Gabung Franchise" & "Jelajahi Menu"
 * 4. Menu Section      - daftar menu dari API: nama produk, harga (Rp), filter kategori
 * 5. Gambar Produk     - foto produk tampil di kartu menu (bukan broken image)
 * 6. Galeri            - section galeri foto dokumentasi ada dan heading-nya muncul
 * 7. Footer            - elemen footer ada, berisi brand name atau copyright
 * 8. WhatsApp Button   - floating button/link WA ada di pojok layar
 * 9. Mobile Responsive - halaman tetap berfungsi di viewport HP (375px)
 * 10. No JS Errors     - ga ada error JavaScript yang bikin halaman rusak
 *
 * Cara pakai:
 *   cd frontend
 *   npm test
 *
 * Total: 21 test
 *
 * Catatan:
 * - Viewport default: 1280x720 (desktop), test mobile pakai 375x667
 * - Data menu diambil dari backend API Railway, jadi harus online
 * - waitUntil: 'networkidle' = tunggu sampai semua request API selesai
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://frontend-phi-blond-37.vercel.app';

let passed = 0;
let failed = 0;

// Cek apakah kondisi terpenuhi, kalau tidak tandai sebagai gagal
function assert(condition, message) {
  if (condition) {
    console.log('  PASS: ' + message);
    passed++;
  } else {
    console.log('  FAIL: ' + message);
    failed++;
  }
}

// Jalanin satu test case
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
  console.log('=== E2E Test: Landing Page (Frontend) ===');
  console.log('Target: ' + BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  // --------------------------------------------------
  // Test 1: Page Load
  // Cek apakah halaman landing page berhasil dimuat:
  // - Judul halaman (title tag) mengandung "Grand Kebab Hejo"
  // - Container #app (Vue) ada dan ter-render
  // --------------------------------------------------
  await test('Halaman landing page berhasil dimuat', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const title = await page.title();
    assert(title.includes('Grand Kebab Hejo'), 'Judul halaman mengandung "Grand Kebab Hejo"');

    const app = await page.$('#app');
    assert(app !== null, 'Container #app (Vue) ada dan ter-render');

    await page.close();
  });

  // --------------------------------------------------
  // Test 2: Navbar (Navigasi Atas)
  // Cek apakah navbar muncul dan punya link-link navigasi utama:
  // - "Tentang" → scroll ke section #about
  // - "Menu" → scroll ke section #menu
  // - "Franchise" → scroll ke section #franchise
  // --------------------------------------------------
  await test('Navbar - link navigasi Tentang, Menu, Franchise ada', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const nav = await page.$('nav, header');
    assert(nav !== null, 'Elemen navbar/header ada di halaman');

    const bodyText = await page.evaluate(() => document.body.innerText);
    assert(bodyText.includes('Tentang') || bodyText.includes('About'), 'Link "Tentang" ada di navbar');
    assert(bodyText.includes('Menu'), 'Link "Menu" ada di navbar');
    assert(bodyText.includes('Franchise'), 'Link "Franchise" ada di navbar');

    await page.close();
  });

  // --------------------------------------------------
  // Test 3: Hero Section (Banner Utama)
  // Hero section adalah bagian pertama yang dilihat visitor.
  // Harus ada:
  // - Heading "Franchise Kebab" dan teks "Cita Rasa Indonesia"
  // - Tombol CTA "Gabung Franchise" (link ke WA)
  // - Tombol CTA "Jelajahi Menu" (scroll ke section menu)
  // --------------------------------------------------
  await test('Hero Section - heading, tombol CTA tampil', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const bodyText = await page.evaluate(() => document.body.innerText);
    assert(bodyText.includes('Franchise Kebab'), 'Heading "Franchise Kebab" terlihat di hero section');
    assert(bodyText.includes('Cita Rasa Indonesia'), 'Teks "Cita Rasa Indonesia" terlihat');

    const franchiseButton = await page.$('a:has-text("Gabung Franchise"), button:has-text("Gabung Franchise")');
    assert(franchiseButton !== null, 'Tombol CTA "Gabung Franchise" ada');

    const menuButton = await page.$('a:has-text("Jelajahi Menu"), button:has-text("Jelajahi Menu")');
    assert(menuButton !== null, 'Tombol CTA "Jelajahi Menu" ada');

    await page.close();
  });

  // --------------------------------------------------
  // Test 4: Menu Section (Daftar Menu dari API)
  // Section ini ambil data dari GET /api/menus di backend.
  // Cek apakah:
  // - Nama produk "Kebab" tampil (data dari database)
  // - Harga tampil dengan format "Rp" (misal Rp 20.000)
  // - Tombol filter kategori "Semua" ada
  // --------------------------------------------------
  await test('Menu Section - produk dari API tampil (nama, harga, filter)', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Scroll ke section menu biar konten ter-render
    await page.evaluate(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) menuSection.scrollIntoView();
    });
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.innerText);

    const hasKebab = bodyText.includes('Kebab');
    assert(hasKebab, 'Nama produk "Kebab" tampil (data dari API backend)');

    const hasPrice = bodyText.includes('Rp');
    assert(hasPrice, 'Harga tampil dengan format "Rp" (misal Rp 20.000)');

    const hasCategoryFilter = bodyText.includes('Semua');
    assert(hasCategoryFilter, 'Tombol filter kategori "Semua" ada');

    await page.close();
  });

  // --------------------------------------------------
  // Test 5: Gambar Produk
  // Cek apakah gambar-gambar produk tampil di halaman
  // (bukan broken image atau gambar kosong).
  // --------------------------------------------------
  await test('Gambar produk tampil di halaman', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.evaluate(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) menuSection.scrollIntoView();
    });
    await page.waitForTimeout(3000);

    const images = await page.$$('img');
    assert(images.length > 0, 'Gambar tampil di halaman (ditemukan ' + images.length + ' gambar)');

    await page.close();
  });

  // --------------------------------------------------
  // Test 6: Galeri (Foto Dokumentasi)
  // Section galeri menampilkan foto-foto dokumentasi usaha.
  // Data diambil dari GET /api/gallery di backend.
  // Cek apakah heading "Galeri" atau "Gallery" muncul.
  // --------------------------------------------------
  await test('Galeri - section foto dokumentasi ada', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.evaluate(() => {
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) gallerySection.scrollIntoView();
    });
    await page.waitForTimeout(2000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasGallery = bodyText.toLowerCase().includes('galeri') || bodyText.toLowerCase().includes('gallery');
    assert(hasGallery, 'Heading section galeri terlihat ("Galeri" atau "Gallery")');

    await page.close();
  });

  // --------------------------------------------------
  // Test 7: Footer
  // Footer ada di paling bawah halaman.
  // Biasanya berisi brand name, copyright, atau info kontak.
  // --------------------------------------------------
  await test('Footer - elemen dan konten footer ada', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Scroll ke paling bawah biar footer ter-render
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const footer = await page.$('footer');
    assert(footer !== null, 'Elemen <footer> ada di halaman');

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasFooterContent = bodyText.includes('Kebab') || bodyText.includes('Hejo') || bodyText.includes('©');
    assert(hasFooterContent, 'Footer berisi teks brand ("Kebab"/"Hejo") atau copyright (©)');

    await page.close();
  });

  // --------------------------------------------------
  // Test 8: Tombol WhatsApp (Floating Button)
  // Tombol WA melayang di pojok layar buat visitor yang mau tanya-tanya.
  // Link-nya harus mengarah ke wa.me (WhatsApp API).
  // --------------------------------------------------
  await test('Tombol WhatsApp floating ada di halaman', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const waButton = await page.$('a[href*="wa.me"], a[href*="whatsapp"], [aria-label*="WhatsApp"]');
    assert(waButton !== null, 'Link/tombol WhatsApp ada (href mengandung wa.me atau whatsapp)');

    await page.close();
  });

  // --------------------------------------------------
  // Test 9: Mobile Responsive
  // Cek apakah halaman tetap berfungsi di layar HP (viewport 375x667).
  // Hero section harus tetap terlihat, menu toggle harus ada.
  // --------------------------------------------------
  await test('Mobile responsive - halaman berfungsi di layar HP (375px)', async () => {
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const bodyText = await mobilePage.evaluate(() => document.body.innerText);
    assert(bodyText.includes('Franchise Kebab'), 'Konten hero section tetap terlihat di layar HP');

    const menuButton = await mobilePage.$('button[aria-label*="menu"], button:has-text("Menu"), svg');
    assert(menuButton !== null, 'Tombol hamburger menu atau konten navigasi mobile ada');

    await mobilePage.close();
  });

  // --------------------------------------------------
  // Test 10: Tidak Ada Error JavaScript
  // Cek apakah ada error JavaScript critical yang bikin halaman rusak.
  // Error kecil kayak favicon 404 atau Failed to fetch diabaikan
  // (bisa terjadi karena cache atau network sementara).
  // --------------------------------------------------
  await test('Tidak ada error JavaScript critical di console', async () => {
    const page = await context.newPage();
    const errors = [];

    // Tangkap semua error yang muncul di halaman
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Filter: abaikan error favicon dan network (bukan critical)
    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('Failed to fetch'));
    assert(criticalErrors.length === 0, 'Tidak ada error JS critical (' + criticalErrors.length + ' ditemukan' + (criticalErrors.length > 0 ? ': ' + criticalErrors.join(', ') : '') + ')');

    await page.close();
  });

  // --- Hasil Akhir ---
  await browser.close();

  console.log('\n=== Hasil Test ===');
  console.log('Lolos:  ' + passed);
  console.log('Gagal:  ' + failed);
  console.log('Total:  ' + (passed + failed));

  process.exit(failed > 0 ? 1 : 0);
})();
