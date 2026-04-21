export function initHero() {
  const lines = document.querySelectorAll('.hero-line');

  lines.forEach(line => {
    if (!line.classList.contains('hero-line--inline')) {
      line.style.paddingLeft = `${(Math.random() * 10).toFixed(2)}vw`;
    }
    const clip = document.createElement('div');
    clip.style.cssText = 'overflow:hidden; padding-bottom:0.18em; margin-bottom:-0.18em; padding-top:0.45em; margin-top:-0.45em;';
    line.parentNode.insertBefore(clip, line);
    clip.appendChild(line);
  });

  gsap.set(lines, { y: '105%', opacity: 1, force3D: true });
  gsap.to(lines, {
    y: '0%',
    duration: 1.2,
    stagger: 0.1,
    ease: 'power4.out',
    delay: 0.05,
    force3D: true
  });

  const inlineImg = document.querySelector('.hero-inline-img');
  if (inlineImg) {
    gsap.to(inlineImg, {
      y: -30,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.8
      }
    });
  }
}
