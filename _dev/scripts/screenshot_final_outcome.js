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

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `#loader { display: none !important; }` });
  await page.waitForTimeout(500);

  // Full scroll pass to fire every animation
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= totalHeight; y += 200) {
    await page.evaluate(yy => window.scrollTo(0, yy), y);
    await page.waitForTimeout(55);
  }
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Make sure we're in light mode
  const isDark = await page.evaluate(() => document.documentElement.dataset.theme === 'dark');
  if (isDark) { await page.click('#nav-theme-btn'); await page.waitForTimeout(500); }

  async function snap(filename, scrollY, height = 900) {
    await page.evaluate(y => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(350);
    await page.screenshot({ path: '_raw.png' });
    crop('_raw.png', filename, 0, 0, 1440, height);
  }

  // Get key section positions
  const positions = await page.evaluate(() => {
    const get = sel => {
      const el = document.querySelector(sel);
      return el ? Math.max(0, el.offsetTop - 20) : null;
    };
    return {
      hero:     0,
      product:  get('.product-detail') || get('[class*="product"]') || 1400,
      quote:    get('[class*="quote"]') || get('blockquote') || document.body.scrollHeight * 0.38,
      services: get('[class*="service"]') || document.body.scrollHeight * 0.6,
      frames:   get('[class*="frame-grid"]') || get('[class*="collection"]') || document.body.scrollHeight * 0.7,
      footer:   get('footer') || document.body.scrollHeight - 600,
    };
  });

  // 1. Hero — full viewport, the headline filling the screen
  await snap('final_1_hero.png', 0, 900);

  // 2. Hero scrolled — show more of the headline + "CLEAR VISION"
  await snap('final_2_hero_lower.png', 400, 900);

  // 3. Product detail — The Arcadian with real photography
  await snap('final_3_product.png', positions.product, 900);

  // 4. About quote — editorial serif pull quote
  await snap('final_4_quote.png', positions.quote, 900);

  // 5. Frames grid — the three frames in a row
  await snap('final_5_frames.png', positions.frames - 100, 900);

  // 6. Footer — dark base, large wordmark
  await snap('final_6_footer.png', positions.footer - 60, 900);

  execSync('rm -f _raw.png');
  await browser.close();
  console.log('all done');
})();
