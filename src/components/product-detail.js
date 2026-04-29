export function initProductDetail() {
  // ── Hero ──────────────────────────────────────────────────

  // Name clip-reveal from bottom
  gsap.from('.pdp-name', {
    y: '105%',
    duration: 1.3,
    ease: 'power4.out',
    delay: 0.15,
    force3D: true
  });

  // Label + meta fade up
  gsap.from('.pdp-label, .pdp-back-link, .pdp-hero-meta', {
    opacity: 0,
    y: 20,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power4.out',
    delay: 0.4,
    force3D: true
  });

  // Hero image subtle zoom out on load
  gsap.from('.pdp-hero-img', {
    scale: 1.06,
    duration: 1.6,
    ease: 'power3.out',
    delay: 0.1,
    force3D: true
  });

  // Hero image parallax while scrolling past
  gsap.to('.pdp-hero-img', {
    yPercent: -8,
    ease: 'none',
    force3D: true,
    scrollTrigger: {
      trigger: '.pdp-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // ── Details section ───────────────────────────────────────
  gsap.from('.pdp-desc-wrap', {
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: { trigger: '.pdp-details', start: 'top 78%', once: true }
  });

  gsap.from('.pdp-purchase-wrap', {
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: { trigger: '.pdp-details', start: 'top 73%', once: true }
  });

  // ── Mockup section ────────────────────────────────────────
  const mockupImg = document.querySelector('.pdp-mockup-img');
  if (mockupImg) {
    const wrap = document.querySelector('.pdp-mockup-img-wrap');
    if (wrap) {
      gsap.set(wrap, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.to(wrap, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: 'power4.out',
        force3D: true,
        scrollTrigger: { trigger: '.pdp-mockup', start: 'top 78%', once: true }
      });
      gsap.set(mockupImg, { scale: 1.08, force3D: true });
      gsap.to(mockupImg, {
        scale: 1,
        duration: 1.4,
        ease: 'power4.out',
        force3D: true,
        scrollTrigger: { trigger: '.pdp-mockup', start: 'top 78%', once: true }
      });
    }
  }

  gsap.from('.pdp-mockup-headline', {
    y: '105%',
    duration: 1.1,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: { trigger: '.pdp-mockup', start: 'top 76%', once: true }
  });

  gsap.from('.pdp-mockup-copy', {
    opacity: 0,
    y: 20,
    duration: 0.9,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: { trigger: '.pdp-mockup', start: 'top 72%', once: true }
  });

  // ── Packaging section ─────────────────────────────────────
  gsap.from('.pdp-pack-label', {
    y: '105%',
    duration: 1.2,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: { trigger: '.pdp-packaging-header', start: 'top 82%', once: true }
  });

  gsap.from('.pdp-pack-sub', {
    opacity: 0,
    y: 20,
    duration: 0.9,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: { trigger: '.pdp-packaging-header', start: 'top 76%', once: true }
  });

  // Packaging image parallax (moves upward as you scroll down)
  const packImg = document.querySelector('.pdp-packaging-img');
  if (packImg) {
    gsap.fromTo(packImg,
      { yPercent: -10 },
      {
        yPercent: 0,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: '.pdp-packaging-img-wrap',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      }
    );
  }
}
