const { chromium } = require('/Users/jackpaterson/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const { execSync } = require('child_process');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });

  // ── Wireframe full page ────────────────────────────────────────────────────
  await page.goto('http://localhost:3000/wireframe.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'wire_fullpage.png', fullPage: true });
  console.log('saved wire_fullpage.png');

  // Crop: just the frame (nav + hero)
  execSync(`python3 -c "
from PIL import Image
img = Image.open('wire_fullpage.png')
img.crop((0, 0, 1200, 520)).save('wire_crop_hero.png')
img.crop((0, 500, 1200, 980)).save('wire_crop_products.png')
print('wire crops saved')
"`);

  // ── Early stage skeleton ───────────────────────────────────────────────────
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/early-stage.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'skeleton_fullpage.png', fullPage: true });
  console.log('saved skeleton_fullpage.png');

  execSync(`python3 -c "
from PIL import Image
img = Image.open('skeleton_fullpage.png')
img.crop((0, 0, 1440, 500)).save('skeleton_crop_hero.png')
img.crop((0, 480, 1440, 900)).save('skeleton_crop_products.png')
print('skeleton crops saved')
"`);

  await browser.close();
  console.log('all done');
})();
