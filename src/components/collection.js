function applyRandomIndent(lines, maxVw = 10) {
  lines.forEach(el => {
    const vw = (Math.random() * maxVw).toFixed(2);
    el.style.paddingLeft = `${vw}vw`;
  });
}

export function initCollection() {
  if (!document.querySelector('.collection')) return;

  // ── Title lines clip-mask reveal ───────────────────────────
  const titleLines = document.querySelectorAll('.coll-title-line');
  applyRandomIndent(titleLines);
  gsap.set(titleLines, { y: '105%', force3D: true });
  gsap.to(titleLines, {
    y: '0%',
    duration: 1.2,
    stagger: 0.1,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.collection-header',
      start: 'top 80%',
      once: true
    }
  });

  gsap.set('.collection-intro', { opacity: 0, y: 18 });
  gsap.to('.collection-intro', {
    opacity: 1, y: 0,
    duration: 0.9,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: { trigger: '.collection-header', start: 'top 75%', once: true }
  });

  // ── Per-product entry animations ───────────────────────────
  document.querySelectorAll('.product-entry').forEach((entry, i) => {
    const img      = entry.querySelector('.product-img-inner img');
    const name     = entry.querySelector('.product-name');
    const meta     = entry.querySelector('.product-meta');
    const desc     = entry.querySelector('.product-desc');
    const purchase = entry.querySelector('.product-purchase');
    const specs    = entry.querySelector('.product-specs');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: entry,
        start: 'top 75%',
        once: true
      }
    });

    // Image: reveal with clip-path + slight scale
    if (img) {
      gsap.set(img, { scale: 1.08, force3D: true });
      tl.to(img, {
        scale: 1,
        duration: 1.4,
        ease: 'power4.out',
        force3D: true
      }, 0);

      const wrap = entry.querySelector('.product-img-wrap');
      gsap.set(wrap, { clipPath: 'inset(100% 0% 0% 0%)' });
      tl.to(wrap, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: 'power4.out'
      }, 0);
    }

    // Product name clip reveal
    if (name) {
      gsap.set(name, { y: '105%', force3D: true });
      tl.to(name, {
        y: '0%',
        duration: 1.1,
        ease: 'power4.out',
        force3D: true
      }, 0.15);
    }

    // Meta, desc, purchase, specs — staggered fade up
    const details = [meta, desc, purchase, specs].filter(Boolean);
    gsap.set(details, { opacity: 0, y: 22, force3D: true });
    tl.to(details, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power4.out',
      force3D: true
    }, 0.3);
  });

  // ── Editorial break ─────────────────────────────────────────
  const breakTextLines = document.querySelectorAll('.break-line--left, .break-line--right');
  applyRandomIndent(breakTextLines);
  gsap.set(breakTextLines, { y: '105%', force3D: true });
  gsap.to(breakTextLines, {
    y: '0%',
    duration: 1.2,
    stagger: 0.14,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.collection-break',
      start: 'top 82%',
      once: true
    }
  });

  const breakInline = document.querySelector('.break-line--inline');
  if (breakInline) {
    gsap.set(breakInline, { opacity: 0, scale: 0.92, force3D: true });
    gsap.to(breakInline, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'power4.out',
      force3D: true,
      scrollTrigger: {
        trigger: '.collection-break',
        start: 'top 80%',
        once: true
      }
    });
  }

  // ── Collection footer ───────────────────────────────────────
  gsap.set('.collection-all-cta, .collection-note', { opacity: 0, y: 20 });
  gsap.to('.collection-all-cta, .collection-note', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.collection-footer',
      start: 'top 88%',
      once: true
    }
  });

  // ── Parallax on product images while scrolling ──────────────
  document.querySelectorAll('.product-img-inner img').forEach(img => {
    gsap.to(img, {
      yPercent: -8,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: img.closest('.product-entry'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });
}
