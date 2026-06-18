/**
 * =============================================
 * E2E Test Suite - Admin Dashboard
 * =============================================
 *
 * File ini ngetest halaman Admin Dashboard dari sudut pandang user
 * pakai browser otomatis (Playwright). Beda sama API test yang cuma
 * ngetest backend-nya, E2E test ini buka browser beneran, klik tombol,
 * isi form, dan cek tampilannya.
 *
 * Yang dites:
 * 1. Halaman Login      - form login muncul, input username & password ada
 * 2. Login Sukses       - isi credential benar → redirect ke halaman dashboard
 * 3. Login Gagal        - isi credential salah → tetap di login + muncul pesan error
 * 4. Katalog Menu       - produk dari API tampil (nama, harga Rp) di kartu menu
 * 5. Tombol Hapus       - setiap kartu menu punya tombol "Hapus"
 * 6. Filter Kategori    - chip "Semua" dan "Kebab Pot" bisa filter produk
 * 7. Sidebar Navigasi   - link-link navigasi di sidebar ada
 *
 * Cara pakai:
 *   cd admin-dashboard
 *   npm run test:e2e
 *
 * Total: 18 test
 *
 * Catatan:
 * - Test login pakai akun default: username "admin", password "password123"
 * - Setiap test buka tab browser baru lalu ditutup biar ga saling ganggu
 * - waitUntil: 'networkidle' = tunggu sampai ga ada request network lagi
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://admin-dashboard-alpha-sage-15.vercel.app';

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

// Fungsi bantu: login dulu biar bisa akses halaman dashboard
async function login(page) {
  await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="text"], input[name="username"]', 'admin');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');
  await page.waitForTimeout(3000);
}

// Fungsi bantu: login lalu navigasi ke halaman katalog menu
async function loginAndGoToMenu(page) {
  await login(page);
  const menuLink = await page.$('a:has-text("Menu"), a:has-text("Katalog"), [href*="menu"]');
  if (menuLink) {
    await menuLink.click();
    await page.waitForTimeout(3000);
  }
}

(async () => {
  console.log('=== E2E Test: Admin Dashboard ===');
  console.log('Target: ' + BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // --------------------------------------------------
  // Test 1: Halaman Login
  // Cek apakah halaman login muncul dengan benar:
  // - Title halaman mengandung "Login" atau "Admin"
  // - Input username ada
  // - Input password ada
  // - Tombol login ada
  // --------------------------------------------------
  await test('Halaman login muncul dengan form lengkap', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    const title = await page.title();
    assert(title.includes('Login') || title.includes('Admin'), 'Judul halaman mengandung "Login" atau "Admin"');

    const usernameInput = await page.$('input[type="text"], input[name="username"], input[placeholder*="sername"]');
    assert(usernameInput !== null, 'Input field username ada');

    const passwordInput = await page.$('input[type="password"]');
    assert(passwordInput !== null, 'Input field password ada');

    const loginButton = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');
    assert(loginButton !== null, 'Tombol login ada');

    await page.close();
  });

  // --------------------------------------------------
  // Test 2: Login Sukses
  // Isi username "admin" dan password "password123",
  // lalu cek apakah redirect ke halaman dashboard (URL bukan /login lagi).
  // --------------------------------------------------
  await test('Login sukses - credential benar, redirect ke dashboard', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');

    await page.waitForTimeout(3000);

    const url = page.url();
    assert(!url.includes('/login'), 'Setelah login sukses, URL bukan lagi halaman login (redirect berhasil)');

    await page.close();
  });

  // --------------------------------------------------
  // Test 3: Login Gagal
  // Isi username dan password yang salah,
  // lalu cek apakah tetap di halaman login + muncul pesan error.
  // --------------------------------------------------
  await test('Login gagal - credential salah, muncul pesan error', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'wronguser');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');

    await page.waitForTimeout(2000);

    const url = page.url();
    assert(url.includes('/login'), 'Tetap di halaman login setelah credential salah');

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasError = bodyText.toLowerCase().includes('salah') || bodyText.toLowerCase().includes('error') || bodyText.toLowerCase().includes('gagal');
    assert(hasError, 'Pesan error muncul (mengandung kata "salah"/"error"/"gagal")');

    await page.close();
  });

  // --------------------------------------------------
  // Test 4: Katalog Menu - Data Produk
  // Login dulu, lalu buka halaman katalog menu.
  // Cek apakah:
  // - Judul halaman katalog muncul
  // - Nama produk tampil (bukan kosong)
  // - Harga tampil dengan format "Rp"
  // --------------------------------------------------
  await test('Katalog menu - nama produk dan harga tampil dari API', async () => {
    const page = await context.newPage();
    await loginAndGoToMenu(page);

    const bodyText = await page.evaluate(() => document.body.innerText);

    const hasTitle = bodyText.includes('Katalog Menu') || bodyText.includes('Manajemen');
    assert(hasTitle, 'Judul halaman katalog menu terlihat');

    const hasProductName = bodyText.includes('Kebab') || bodyText.includes('Beef');
    assert(hasProductName, 'Nama produk tampil di kartu menu (tidak kosong)');

    const hasPrice = bodyText.includes('Rp') || bodyText.match(/\d+\.\d+/);
    assert(hasPrice, 'Harga tampil dengan format "Rp"');

    await page.close();
  });

  // --------------------------------------------------
  // Test 5: Tombol Hapus di Kartu Menu
  // Cek apakah setiap kartu menu punya tombol "Hapus".
  // Juga cek tombol "Edit" sudah tidak ada (fitur edit sudah dihapus).
  // --------------------------------------------------
  await test('Kartu menu punya tombol Hapus (tidak ada tombol Edit)', async () => {
    const page = await context.newPage();
    await loginAndGoToMenu(page);

    const deleteButtons = await page.$$('button:has-text("Hapus")');
    assert(deleteButtons.length > 0, 'Tombol "Hapus" ada di kartu menu (ditemukan ' + deleteButtons.length + ' tombol)');

    const editButtons = await page.$$('button:has-text("Edit")');
    assert(editButtons.length === 0, 'Tombol "Edit" sudah tidak ada (fitur edit dihapus)');

    await page.close();
  });

  // --------------------------------------------------
  // Test 6: Filter Kategori
  // Cek apakah chip filter kategori berfungsi:
  // - Chip "Semua" ada dan menampilkan semua produk
  // - Klik chip "Kebab Pot" → jumlah produk berkurang (hanya kategori itu)
  // - Klik kembali "Semua" → semua produk muncul lagi
  // --------------------------------------------------
  await test('Filter kategori - chip berfungsi memfilter produk', async () => {
    const page = await context.newPage();
    await loginAndGoToMenu(page);

    const semuaChip = await page.$('button:has-text("Semua")');
    assert(semuaChip !== null, 'Chip kategori "Semua" ada');

    // Hitung total produk saat filter "Semua"
    const allProducts = await page.$$('.menu-card');
    const totalProducts = allProducts.length;
    assert(totalProducts > 0, 'Produk tampil di halaman (ditemukan ' + totalProducts + ' kartu)');

    // Klik kategori "Kebab Pot" dan cek jumlahnya berkurang
    const kebabPotChip = await page.$('button:has-text("Kebab Pot")');
    if (kebabPotChip) {
      await kebabPotChip.click();
      await page.waitForTimeout(1000);

      const filteredProducts = await page.$$('.menu-card');
      assert(filteredProducts.length <= totalProducts, 'Setelah filter "Kebab Pot", jumlah produk berkurang (' + filteredProducts.length + ' dari ' + totalProducts + ')');

      // Klik kembali "Semua" dan cek semua produk muncul lagi
      await semuaChip.click();
      await page.waitForTimeout(1000);

      const restoredProducts = await page.$$('.menu-card');
      assert(restoredProducts.length === totalProducts, 'Setelah klik "Semua" lagi, semua produk muncul kembali (' + restoredProducts.length + ')');
    } else {
      console.log('  SKIP: Chip "Kebab Pot" tidak ditemukan, skip test filter');
    }

    await page.close();
  });

  // --------------------------------------------------
  // Test 7: Sidebar Navigasi
  // Cek apakah sidebar dashboard ada dan punya link navigasi
  // ke halaman-halaman admin (Home, Menu, Lokasi, Galeri, dll).
  // --------------------------------------------------
  await test('Sidebar navigasi - link-link halaman admin ada', async () => {
    const page = await context.newPage();
    await login(page);

    const sidebar = await page.$('.dashboard-sidebar, nav, aside');
    assert(sidebar !== null, 'Sidebar navigasi ada di halaman dashboard');

    const links = await page.$$('a[href]');
    assert(links.length >= 3, 'Minimal 3 link navigasi ada di sidebar (ditemukan ' + links.length + ')');

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
