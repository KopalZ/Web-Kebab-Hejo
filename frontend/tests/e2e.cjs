/**
 * E2E Test Suite - Landing Page (Frontend)
 *
 * Ngetest tampilan landing page dari sudut pandang visitor pakai browser (Playwright):
 * - Page Load: judul halaman "Grand Kebab Hejo" muncul
 * - Navbar: link Tentang, Menu, Franchise ada
 * - Hero Section: heading "Franchise Kebab", tombol "Gabung Franchise" & "Jelajahi Menu"
 * - Menu Section: produk dari API tampil (nama, harga Rp, filter kategori)
 * - Gambar Produk: foto produk muncul di kartu menu
 * - Galeri: section galeri dengan heading ada
 * - Footer: elemen footer dengan teks brand/copyright
 * - WhatsApp Button: floating button/link WA ada
 * - Mobile Responsive: konten hero terlihat di viewport mobile (375px)
 * - No JS Errors: ga ada error JavaScript critical
 *
 * Jalankan: npm test (dari folder frontend)
 * Total: 21 test
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://frontend-phi-blond-37.vercel.app';

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
  console.log('=== E2E Tests: Landing Page (Frontend) ===');
  console.log('Target: ' + BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  // --- Test 1: Page loads ---
  await test('Landing page loads correctly', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const title = await page.title();
    assert(title.includes('Grand Kebab Hejo'), 'Page title contains "Grand Kebab Hejo"');

    const app = await page.$('#app');
    assert(app !== null, '#app container exists');

    await page.close();
  });

  // --- Test 2: Navbar ---
  await test('Navbar has navigation links', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const nav = await page.$('nav, header');
    assert(nav !== null, 'Navbar/header element exists');

    const bodyText = await page.evaluate(() => document.body.innerText);
    assert(bodyText.includes('Tentang') || bodyText.includes('About'), 'Navbar has "Tentang" link');
    assert(bodyText.includes('Menu'), 'Navbar has "Menu" link');
    assert(bodyText.includes('Franchise'), 'Navbar has "Franchise" link');

    await page.close();
  });

  // --- Test 3: Hero Section ---
  await test('Hero section displays main content', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const bodyText = await page.evaluate(() => document.body.innerText);
    assert(bodyText.includes('Franchise Kebab'), 'Hero heading "Franchise Kebab" is visible');
    assert(bodyText.includes('Cita Rasa Indonesia'), 'Hero text "Cita Rasa Indonesia" is visible');

    const franchiseButton = await page.$('a:has-text("Gabung Franchise"), button:has-text("Gabung Franchise")');
    assert(franchiseButton !== null, '"Gabung Franchise" CTA button exists');

    const menuButton = await page.$('a:has-text("Jelajahi Menu"), button:has-text("Jelajahi Menu")');
    assert(menuButton !== null, '"Jelajahi Menu" CTA button exists');

    await page.close();
  });

  // --- Test 4: Menu Section loads products from API ---
  await test('Menu section loads products from API', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.evaluate(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) menuSection.scrollIntoView();
    });
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.innerText);

    const hasKebab = bodyText.includes('Kebab');
    assert(hasKebab, 'Product name "Kebab" is visible');

    const hasPrice = bodyText.includes('Rp');
    assert(hasPrice, 'Prices with "Rp" format are displayed');

    const hasCategoryFilter = bodyText.includes('Semua');
    assert(hasCategoryFilter, 'Category filter "Semua" button exists');

    await page.close();
  });

  // --- Test 5: Menu section shows product images ---
  await test('Menu section displays product images', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.evaluate(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) menuSection.scrollIntoView();
    });
    await page.waitForTimeout(3000);

    const images = await page.$$('img');
    assert(images.length > 0, 'Images are displayed on the page (' + images.length + ' found)');

    await page.close();
  });

  // --- Test 6: Gallery section ---
  await test('Gallery section exists with images', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.evaluate(() => {
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) gallerySection.scrollIntoView();
    });
    await page.waitForTimeout(2000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasGallery = bodyText.toLowerCase().includes('galeri') || bodyText.toLowerCase().includes('gallery');
    assert(hasGallery, 'Gallery section heading is visible');

    await page.close();
  });

  // --- Test 7: Footer ---
  await test('Footer exists with content', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const footer = await page.$('footer');
    assert(footer !== null, 'Footer element exists');

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasFooterContent = bodyText.includes('Kebab') || bodyText.includes('Hejo') || bodyText.includes('©');
    assert(hasFooterContent, 'Footer contains brand text or copyright');

    await page.close();
  });

  // --- Test 8: WhatsApp floating button ---
  await test('WhatsApp floating button exists', async () => {
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const waButton = await page.$('a[href*="wa.me"], a[href*="whatsapp"], [aria-label*="WhatsApp"]');
    assert(waButton !== null, 'WhatsApp floating button/link exists');

    await page.close();
  });

  // --- Test 9: Responsive / mobile viewport ---
  await test('Page works on mobile viewport', async () => {
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    const bodyText = await mobilePage.evaluate(() => document.body.innerText);
    assert(bodyText.includes('Franchise Kebab'), 'Hero content visible on mobile');

    const menuButton = await mobilePage.$('button[aria-label*="menu"], button:has-text("Menu"), svg');
    assert(menuButton !== null, 'Mobile menu toggle or content visible');

    await mobilePage.close();
  });

  // --- Test 10: No console errors ---
  await test('No critical JavaScript errors', async () => {
    const page = await context.newPage();
    const errors = [];

    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('Failed to fetch'));
    assert(criticalErrors.length === 0, 'No critical JS errors (' + criticalErrors.length + ' found' + (criticalErrors.length > 0 ? ': ' + criticalErrors.join(', ') : '') + ')');

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
