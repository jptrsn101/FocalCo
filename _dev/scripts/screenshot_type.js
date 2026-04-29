const { chromium } = require('/Users/jackpaterson/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const { execSync } = require('child_process');

async function shot(page, filename, scrollY, cropY, cropH, cropX = 0, cropW = 1440) {
  await page.evaluate(y => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(300);
  await page.screenshot({ path: filename + '_raw.png', fullPage: false });
  // Crop using PIL via python
  execSync(`python3 -c "
from PIL import Image
img = Image.open('${filename}_raw.png')
cropped = img.crop((${cropX}, ${cropY}, ${cropX + cropW}, ${cropY + cropH}))
cropped.save('${filename}.png')
print('saved ${filename}.png')
"`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `#loader { display: none !important; }` });
  await page.waitForTimeout(500);

  // Full scroll pass to fire all animations
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= totalHeight; y += 200) {
    await page.evaluate(yy => window.scrollTo(0, yy), y);
    await page.waitForTimeout(55);
  }
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // ── 1. Hero display type — massive PP Fragment Glare headline ──────────────
  // Crop tight into just the letterforms, cutting nav off
  await shot(page, 'type_1_hero_display', 0, 55, 700);

  // ── 2. Hero — bottom two lines "CLEAR VISION" tight crop ──────────────────
  await shot(page, 'type_2_hero_bottom', 200, 0, 560);

  // ── 3. Product name — "The Arcadian" serif at medium scale ────────────────
  const productY = await page.evaluate(() => {
    const el = document.querySelector('.product-name') ||
               document.querySelector('[class*="product-name"]');
    return el ? el.getBoundingClientRect().top + window.scrollY - 100 : 1400;
  });
  await shot(page, 'type_3_product_name', productY, 80, 420, 860, 560);

  // ── 4. Body copy — Poppins paragraph for contrast with display ────────────
  const descY = await page.evaluate(() => {
    const el = document.querySelector('.product-desc') ||
               document.querySelector('[class*="desc"]');
    return el ? el.getBoundingClientRect().top + window.scrollY - 60 : 1600;
  });
  await shot(page, 'type_4_body_copy', descY, 40, 320, 860, 540);

  // ── 5. About/quote — large italic or editorial serif quote ────────────────
  const quoteY = await page.evaluate(() => {
    const el = document.querySelector('.about-quote') ||
               document.querySelector('[class*="quote"]') ||
               document.querySelector('blockquote');
    if (el) return el.getBoundingClientRect().top + window.scrollY - 60;
    // fallback: find a section around 40% down
    return document.body.scrollHeight * 0.38;
  });
  await shot(page, 'type_5_quote', quoteY, 0, 500);

  // ── 6. Footer wordmark — large Focal&Co. SVG type at bottom ───────────────
  const footerY = await page.evaluate(() => {
    const el = document.querySelector('footer') ||
               document.querySelector('.footer');
    return el ? el.getBoundingClientRect().top + window.scrollY - 20 : totalHeight - 400;
  });
  await shot(page, 'type_6_footer', footerY, 0, 500);

  // Cleanup raw files
  execSync(`rm -f *_raw.png`);

  await browser.close();
  console.log('all typography shots done');
})();
