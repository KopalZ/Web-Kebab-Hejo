const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('[' + msg.type() + '] ' + msg.text()));
  page.on('pageerror', err => console.log('[PAGE_ERROR] ' + err.message));
  await page.goto('https://admin-dashboard-alpha-sage-15.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  const text = await page.evaluate(() => document.body.innerText);
  console.log('[BODY_TEXT]');
  console.log(text);
  console.log('[HTML_SNIPPET]');
  const html = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.substring(0, 500) || 'empty');
  console.log(html);
  await browser.close();
})();
