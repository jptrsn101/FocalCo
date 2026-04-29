export function initTubes() {
  const section = document.querySelector('.tubes-section');
  if (!section) return;

  const img     = section.querySelector('.tubes-img');
  const content = section.querySelector('.tubes-content');

  // Parallax — image moves up slower than scroll, revealing more
  if (img) {
    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      }
    );
  }

  // Content fades/slides up as section reaches mid-screen
  if (content) {
    gsap.from(content, {
      opacity: 0,
      y: 48,
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        once: true
      }
    });
  }
}
