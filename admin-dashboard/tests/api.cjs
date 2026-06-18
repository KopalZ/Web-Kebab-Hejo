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

  // --- Test 1: GET /api/menus ---
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

  // --- Test 2: GET /api/menus - all products have names ---
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

  // --- Test 3: GET /api/outlets ---
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

  // --- Test 4: GET /api/gallery ---
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

  // --- Test 5: GET /api/hero-slides ---
  await test('GET /api/hero-slides returns slides', async () => {
    const res = await fetch(API_BASE + '/api/hero-slides');
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(Array.isArray(data), 'Response is an array');

    if (data.length > 0) {
      assert(typeof data[0].image_url === 'string', 'Slide has image_url');
    }
  });

  // --- Test 6: POST /api/login - correct credentials ---
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

  // --- Test 7: POST /api/login - wrong credentials ---
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

  // --- Test 8: CORS headers ---
  await test('CORS headers are set correctly', async () => {
    const res = await fetch(API_BASE + '/api/menus', {
      method: 'OPTIONS'
    });

    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert(allowOrigin === '*', 'Access-Control-Allow-Origin is *');
  });

  // --- Test 9: DELETE non-existent product returns error ---
  await test('DELETE non-existent product returns error', async () => {
    const res = await fetch(API_BASE + '/api/products/999999', {
      method: 'DELETE'
    });

    assert(!res.ok || res.status === 500, 'Deleting non-existent product returns error (got ' + res.status + ')');
  });

  // --- Test 10: GET /api/settings/franchise-link ---
  await test('GET /api/settings/franchise-link returns link', async () => {
    const res = await fetch(API_BASE + '/api/settings/franchise-link');
    assert(res.ok, 'Status is 200 OK (got ' + res.status + ')');

    const data = await res.json();
    assert(typeof data.value === 'string', 'Setting has a value');
    assert(data.key === 'franchise_link', 'Setting key is franchise_link');
  });

  // --- Results ---
  console.log('\n=== Results ===');
  console.log('Passed: ' + passed);
  console.log('Failed: ' + failed);
  console.log('Total:  ' + (passed + failed));

  process.exit(failed > 0 ? 1 : 0);
})();
