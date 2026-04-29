const { chromium } = require('/Users/jackpaterson/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const { execSync } = require('child_process');

function crop(src, dst, x, y, w, h) {
  execSync(`python3 -c "
from PIL import Image
img = Image.open('${src}')
img.crop((${x}, ${y}, ${x+w}, ${y+h})).save('${dst}')
print('saved ${dst}')
"`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // ── Load and scroll through to fire all animations ────────────────────────
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `#loader { display: none !important; }` });
  await page.waitForTimeout(500);

  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= totalHeight; y += 200) {
    await page.evaluate(yy => window.scrollTo(0, yy), y);
    await page.waitForTimeout(55);
  }
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // ── COLOUR 1: Yellow accent #f4ec5f — logo pill in light mode nav ─────────
  await page.screenshot({ path: '_raw.png' });
  crop('_raw.png', 'colour_1_yellow_nav.png', 0, 0, 320, 80);

  // ── COLOUR 2: Yellow in dark mode — hero headline ─────────────────────────
  await page.click('#nav-theme-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '_raw.png' });
  crop('_raw.png', 'colour_2_yellow_dark.png', 0, 55, 1440, 420);

  // ── COLOUR 3: Dark base #1a1b0f — footer ─────────────────────────────────
  const footerY = await page.evaluate(() => {
    const el = document.querySelector('footer');
    return el ? el.offsetTop : totalHeight - 600;
  });
  await page.evaluate(y => window.scrollTo(0, y), footerY);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_raw.png' });
  crop('_raw.png', 'colour_3_dark_base.png', 0, 100, 1440, 400);

  // ── COLOUR 4: Cream #f0ece3 — switch back to light, crop hero bg ──────────
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#nav-theme-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '_raw.png' });
  crop('_raw.png', 'colour_4_cream_bg.png', 0, 55, 1440, 500);

  // ── COLOUR 5: Blue/purple #6079bb — Add to Cart button ───────────────────
  const productY = await page.evaluate(() => {
    const el = document.querySelector('.product-detail') ||
               document.querySelector('[class*="product"]');
    return el ? Math.max(0, el.offsetTop - 80) : 1400;
  });
  await page.evaluate(y => window.scrollTo(0, y), productY);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_raw.png' });
  crop('_raw.png', 'colour_5_blue_cta.png', 860, 280, 580, 220);

  // ── COLOUR 6: Muted gold #b4af4c — product specs / secondary text ─────────
  crop('_raw.png', 'colour_6_muted_gold.png', 860, 400, 580, 260);

  execSync(`rm -f _raw.png`);

  // ── EVALUATION screenshots — clean finished sections ─────────────────────
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // Eval 1: hero full clean
  await page.screenshot({ path: '_raw.png' });
  execSync(`python3 -c "
from PIL import Image
Image.open('_raw.png').crop((0,0,1440,820)).save('eval_1_hero.png')
print('saved eval_1_hero.png')
"`);

  // Eval 2: product detail
  await page.evaluate(y => window.scrollTo(0, y), productY);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_raw.png' });
  execSync(`python3 -c "
from PIL import Image
Image.open('_raw.png').crop((0,0,1440,820)).save('eval_2_product.png')
print('saved eval_2_product.png')
"`);

  // Eval 3: about quote section
  const quoteY = await page.evaluate(() => {
    const el = document.querySelector('[class*="quote"]') ||
               document.querySelector('blockquote');
    if (el) return Math.max(0, el.offsetTop - 60);
    return document.body.scrollHeight * 0.38;
  });
  await page.evaluate(y => window.scrollTo(0, y), quoteY);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_raw.png' });
  execSync(`python3 -c "
from PIL import Image
Image.open('_raw.png').crop((0,0,1440,820)).save('eval_3_quote.png')
print('saved eval_3_quote.png')
"`);

  execSync(`rm -f _raw.png`);

  await browser.close();
  console.log('all done');
})();
