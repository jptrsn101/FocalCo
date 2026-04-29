const { chromium } = require('/Users/jackpaterson/.npm/_npx/705bc6b22212b352/node_modules/playwright');

async function cropShot(page, filename, scrollY, height) {
  await page.evaluate(y => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(300);
  const clip = { x: 0, y: 0, width: 1440, height: height };
  await page.screenshot({ path: filename, clip });
  console.log('saved', filename);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Kill loader only
  await page.addStyleTag({ content: `#loader { display: none !important; }` });
  await page.waitForTimeout(500);

  // Scroll slowly through the entire page so every ScrollTrigger fires naturally
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const steps = Math.ceil(totalHeight / 200);
  for (let i = 0; i <= steps; i++) {
    await page.evaluate(y => window.scrollTo(0, y), i * 200);
    await page.waitForTimeout(60);
  }

  // Wait for all animations to fully settle
  await page.waitForTimeout(2500);

  // Back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // Find section positions now that everything is laid out
  const productsY = await page.evaluate(() => {
    const el = document.querySelector('.product-detail') ||
               document.querySelector('[class*="product"]');
    return el ? Math.max(0, el.offsetTop - 80) : 1400;
  });

  const lowerY = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const target = sections[Math.floor(sections.length * 0.55)];
    return target ? Math.max(0, target.offsetTop - 40) : 2800;
  });

  // ── LIGHT MODE ────────────────────────────────────────────────────────────
  const isDark = await page.evaluate(() => document.documentElement.dataset.theme === 'dark');
  if (isDark) {
    await page.click('#nav-theme-btn');
    await page.waitForTimeout(600);
  }

  await cropShot(page, 'light_1_hero.png', 0, 820);
  await cropShot(page, 'light_2_products.png', productsY, 820);
  await cropShot(page, 'light_3_lower.png', lowerY, 820);

  // ── DARK MODE ─────────────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#nav-theme-btn');
  await page.waitForTimeout(600);

  await cropShot(page, 'dark_1_hero.png', 0, 820);
  await cropShot(page, 'dark_2_products.png', productsY, 820);
  await cropShot(page, 'dark_3_lower.png', lowerY, 820);

  await browser.close();
  console.log('all done');
})();
