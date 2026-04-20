import { initTheme }      from './components/theme.js';
import { initLoader }     from './components/loader.js';
import { initNav }        from './components/nav.js';
import { initHero }       from './components/hero.js';
import { initServices }   from './components/services.js';
import { initAbout }      from './components/about.js';
import { initCollection } from './components/collection.js';
import { initFooter }     from './components/footer.js';
import { initBasket }     from './components/basket.js';

// Always start at top on load/reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ markers: false });

// ── Lenis smooth scroll ──────────────────────────────────────
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

// Also sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

// ── Init everything ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initBasket();
  initServices();
  initAbout();
  initCollection();
  initFooter();

  // Loader runs first; hero animates in when loader exits
  initLoader(() => {
    initHero();
    // Refresh triggers after loader exits in case scroll position changed
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });

  // Ensure all triggers are evaluated at correct positions
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
