const { chromium } = require('/Users/jackpaterson/.npm/_npx/705bc6b22212b352/node_modules/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `#loader { display: none !important; }` });
  await page.waitForTimeout(500);

  // Scroll slowly through entire page to fire every animation and load every image
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= totalHeight; y += 150) {
    await page.evaluate(yy => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }

  // Wait for all animations to fully settle
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Ensure light mode
  const isDark = await page.evaluate(() => document.documentElement.dataset.theme === 'dark');
  if (isDark) { await page.click('#nav-theme-btn'); await page.waitForTimeout(600); }

  // Full page light
  await page.screenshot({ path: 'fullpage_light.png', fullPage: true });
  console.log('saved fullpage_light.png');

  // Switch to dark
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#nav-theme-btn');
  await page.waitForTimeout(600);

  // Full page dark
  await page.screenshot({ path: 'fullpage_dark.png', fullPage: true });
  console.log('saved fullpage_dark.png');

  await browser.close();
  console.log('done');
})();
