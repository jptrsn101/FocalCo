export function initAbout() {
  const quote = document.querySelector('.about-quote');
  if (!quote) return;

  const rawText = quote.textContent.trim();
  const words   = rawText.split(/\s+/);

  quote.innerHTML = words.map(w =>
    `<span class="quote-word"><span class="quote-word-inner">${w}</span></span>`
  ).join(' ');

  gsap.set('.quote-word-inner', { y: '105%', force3D: true });
  gsap.to('.quote-word-inner', {
    y: '0%',
    duration: 0.9,
    stagger: 0.035,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.about-quote',
      start: 'top 80%',
      once: true
    }
  });

  const galleryItems = document.querySelectorAll('.about-gallery-item');
  gsap.set(galleryItems, { y: 40, opacity: 0 });
  gsap.to(galleryItems, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    stagger: 0.08,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.about-gallery',
      start: 'top 85%',
      once: true
    }
  });

  gsap.set('.about-cta', { opacity: 0, y: 16 });
  gsap.to('.about-cta', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.about-cta',
      start: 'top 88%',
      once: true
    }
  });

  // ── Editorial spread clip reveals ─────────────────────────
  document.querySelectorAll('.editorial-img-wrap').forEach((wrap, i) => {
    const inner = wrap.querySelector('.editorial-img-inner');
    const img   = wrap.querySelector('.editorial-img');

    if (inner) {
      gsap.set(inner, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.to(inner, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: 'power4.out',
        force3D: true,
        scrollTrigger: {
          trigger: wrap,
          start: 'top 82%',
          once: true
        },
        delay: i * 0.15
      });
    }

    if (img) {
      gsap.set(img, { scale: 1.08, force3D: true });
      gsap.to(img, {
        scale: 1,
        duration: 1.5,
        ease: 'power4.out',
        force3D: true,
        scrollTrigger: {
          trigger: wrap,
          start: 'top 82%',
          once: true
        },
        delay: i * 0.15
      });

      // Parallax while scrolling past
      gsap.to(img, {
        yPercent: -10,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }
  });
}
