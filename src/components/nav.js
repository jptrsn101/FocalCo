export function initNav() {
  const nav         = document.getElementById('nav');
  const menuBtn     = document.getElementById('nav-menu-btn');
  const overlay     = document.getElementById('nav-overlay');
  const closeBtn    = document.getElementById('nav-overlay-close');
  const overlayLinks = overlay.querySelectorAll('.nav-overlay-link');

  let lastY      = 0;
  let hidden     = false;
  let overlayOpen = false;

  // Open overlay
  function openOverlay() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    overlayOpen = true;
    document.body.style.overflow = 'hidden';

    gsap.fromTo(overlayLinks,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }

  // Close overlay
  function closeOverlay() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    overlayOpen = false;
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openOverlay);
  closeBtn.addEventListener('click', closeOverlay);

  overlayLinks.forEach(link => {
    link.addEventListener('click', closeOverlay);
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlayOpen) closeOverlay();
  });

  // Hide nav on scroll down, show on scroll up
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate(self) {
      if (overlayOpen) return;
      const scrollY = self.scroll();
      if (scrollY > lastY && scrollY > 120 && !hidden) {
        gsap.to(nav, { y: -80, duration: 0.4, ease: 'power2.inOut' });
        hidden = true;
      } else if (scrollY < lastY && hidden) {
        gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.out' });
        hidden = false;
      }
      lastY = scrollY;
    }
  });
}
