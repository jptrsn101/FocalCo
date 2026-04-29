const { chromium } = require('/Users/jackpaterson/.npm/_npx/705bc6b22212b352/node_modules/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Kill the loader immediately and disable all animations
  await page.addStyleTag({ content: `
    #loader { display: none !important; }
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `});

  // Force all scroll-animated elements visible
  await page.evaluate(() => {
    // Remove any hidden/pre-animation classes, force opacity/transform to final state
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.opacity === '0') el.style.opacity = '1';
      if (style.visibility === 'hidden') el.style.visibility = 'visible';
    });

    // Scroll through the whole page to trigger IntersectionObserver callbacks
    const totalHeight = document.body.scrollHeight;
    window.scrollTo(0, totalHeight);
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(1000);

  // Force visible again after scroll triggers
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.opacity === '0') el.style.opacity = '1';
      if (style.visibility === 'hidden') el.style.visibility = 'visible';
      if (style.transform && style.transform !== 'none') {
        // reset any translate transforms that hide elements off-screen
      }
    });
  });

  await page.waitForTimeout(500);

  await page.screenshot({ path: 'screenshot_stage3_full.png', fullPage: true });
  console.log('done');
  await browser.close();
})();
