export function initFooter() {
  const footerSvg = document.querySelector('.footer-type-svg');

  if (footerSvg) {
    gsap.set(footerSvg, { y: 50, opacity: 0, force3D: true });
    gsap.to(footerSvg, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power4.out',
      force3D: true,
      scrollTrigger: {
        trigger: '.footer-type-wrap',
        start: 'top 95%',
        once: true
      }
    });
  }

  gsap.set('.footer-top', { opacity: 0, y: 20 });
  gsap.to('.footer-top', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 98%',
      once: true
    }
  });
}
