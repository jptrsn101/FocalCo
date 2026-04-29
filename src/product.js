import { initTheme }         from './components/theme.js';
import { initNav }           from './components/nav.js';
import { initBasket }        from './components/basket.js';
import { initFooter }        from './components/footer.js';
import { initProductDetail } from './components/product-detail.js';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ markers: false });

const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.75,
  touchMultiplier: 1.2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initBasket();
  initFooter();
  initProductDetail();

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
