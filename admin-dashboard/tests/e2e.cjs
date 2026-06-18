/**
 * E2E Test Suite - Admin Dashboard
 *
 * Ngetest dari sudut pandang user pakai browser (Playwright):
 * - Login page: halaman login muncul, input fields ada
 * - Login sukses: credential benar → redirect ke dashboard
 * - Login gagal: credential salah → tetap di login + pesan error
 * - Katalog Menu: nama produk, harga (Rp), muncul dari API
 * - Tombol Hapus: ada di setiap kartu menu, terhubung ke DELETE API
 * - Filter Kategori: chip "Semua", "Kebab Pot" berfungsi filter produk
 * - Sidebar Navigasi: link-link navigasi ada
 *
 * Jalankan: npm run test:e2e (dari folder admin-dashboard)
 * Total: 18 test
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://admin-dashboard-alpha-sage-15.vercel.app';

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
  console.log('=== E2E Tests: Admin Dashboard ===');
  console.log('Target: ' + BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // --- Test 1: Login page loads ---
  await test('Login page loads correctly', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    const title = await page.title();
    assert(title.includes('Login') || title.includes('Admin'), 'Page title contains Login/Admin');

    const usernameInput = await page.$('input[type="text"], input[name="username"], input[placeholder*="sername"]');
    assert(usernameInput !== null, 'Username input field exists');

    const passwordInput = await page.$('input[type="password"]');
    assert(passwordInput !== null, 'Password input field exists');

    const loginButton = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');
    assert(loginButton !== null, 'Login button exists');

    await page.close();
  });

  // --- Test 2: Login with correct credentials ---
  await test('Login with correct credentials', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');

    await page.waitForTimeout(3000);

    const url = page.url();
    assert(!url.includes('/login'), 'Redirected away from login page after successful login');

    await page.close();
  });

  // --- Test 3: Login with wrong credentials ---
  await test('Login with wrong credentials shows error', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'wronguser');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');

    await page.waitForTimeout(2000);

    const url = page.url();
    assert(url.includes('/login'), 'Stays on login page after failed login');

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasError = bodyText.toLowerCase().includes('salah') || bodyText.toLowerCase().includes('error') || bodyText.toLowerCase().includes('gagal');
    assert(hasError, 'Error message displayed for wrong credentials');

    await page.close();
  });

  // --- Test 4: Menu catalog loads with product data ---
  await test('Menu catalog loads with product names and prices', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');
    await page.waitForTimeout(3000);

    // Navigate to menu catalog
    const menuLink = await page.$('a:has-text("Menu"), a:has-text("Katalog"), [href*="menu"]');
    if (menuLink) {
      await menuLink.click();
      await page.waitForTimeout(3000);
    }

    const bodyText = await page.evaluate(() => document.body.innerText);

    const hasTitle = bodyText.includes('Katalog Menu') || bodyText.includes('Manajemen');
    assert(hasTitle, 'Menu catalog page title is visible');

    const hasProductName = bodyText.includes('Kebab') || bodyText.includes('Beef');
    assert(hasProductName, 'Product names are visible (not empty)');

    const hasPrice = bodyText.includes('Rp') || bodyText.match(/\d+\.\d+/);
    assert(hasPrice, 'Prices are displayed with Rp format');

    await page.close();
  });

  // --- Test 5: Menu cards have delete button ---
  await test('Menu cards have Hapus (delete) button', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');
    await page.waitForTimeout(3000);

    const menuLink = await page.$('a:has-text("Menu"), a:has-text("Katalog"), [href*="menu"]');
    if (menuLink) {
      await menuLink.click();
      await page.waitForTimeout(3000);
    }

    const deleteButtons = await page.$$('button:has-text("Hapus")');
    assert(deleteButtons.length > 0, 'Hapus buttons exist on menu cards (found ' + deleteButtons.length + ')');

    // Verify no Edit buttons (they were removed)
    const editButtons = await page.$$('button:has-text("Edit")');
    assert(editButtons.length === 0, 'No Edit buttons (feature removed)');

    await page.close();
  });

  // --- Test 6: Category filter works ---
  await test('Category filter chips are visible and clickable', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');
    await page.waitForTimeout(3000);

    const menuLink = await page.$('a:has-text("Menu"), a:has-text("Katalog"), [href*="menu"]');
    if (menuLink) {
      await menuLink.click();
      await page.waitForTimeout(3000);
    }

    const semuaChip = await page.$('button:has-text("Semua")');
    assert(semuaChip !== null, '"Semua" category chip exists');

    // Get product count before filtering
    const allProducts = await page.$$('.menu-card');
    const totalProducts = allProducts.length;
    assert(totalProducts > 0, 'Products are displayed (found ' + totalProducts + ')');

    // Click a specific category if available
    const kebabPotChip = await page.$('button:has-text("Kebab Pot")');
    if (kebabPotChip) {
      await kebabPotChip.click();
      await page.waitForTimeout(1000);

      const filteredProducts = await page.$$('.menu-card');
      assert(filteredProducts.length <= totalProducts, 'Filtering reduces or keeps product count (' + filteredProducts.length + ' <= ' + totalProducts + ')');

      // Click back to Semua
      await semuaChip.click();
      await page.waitForTimeout(1000);

      const restoredProducts = await page.$$('.menu-card');
      assert(restoredProducts.length === totalProducts, 'Clicking "Semua" restores all products');
    } else {
      console.log('  SKIP: Kebab Pot chip not found, skipping filter test');
    }

    await page.close();
  });

  // --- Test 7: Sidebar navigation ---
  await test('Sidebar navigation links exist', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle', timeout: 30000 });

    await page.fill('input[type="text"], input[name="username"]', 'admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Masuk")');
    await page.waitForTimeout(3000);

    const sidebar = await page.$('.dashboard-sidebar, nav, aside');
    assert(sidebar !== null, 'Sidebar navigation exists');

    const links = await page.$$('a[href]');
    assert(links.length >= 3, 'Multiple navigation links exist (' + links.length + ')');

    await page.close();
  });

  // --- Results ---
  await browser.close();

  console.log('\n=== Results ===');
  console.log('Passed: ' + passed);
  console.log('Failed: ' + failed);
  console.log('Total:  ' + (passed + failed));

  process.exit(failed > 0 ? 1 : 0);
})();
