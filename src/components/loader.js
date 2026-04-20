export function initLoader(onComplete) {
  const loader  = document.getElementById('loader');
  const counter = document.getElementById('loader-counter');
  const imgs    = loader.querySelectorAll('.loader-img');
  let currentImg = 0;

  const cycleInterval = setInterval(() => {
    imgs[currentImg].classList.remove('is-active');
    currentImg = (currentImg + 1) % imgs.length;
    imgs[currentImg].classList.add('is-active');
  }, 650);

  const duration  = 2200;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
    counter.textContent = pct + '%';

    if (pct < 100) {
      requestAnimationFrame(tick);
    } else {
      clearInterval(cycleInterval);
      setTimeout(exit, 180);
    }
  }

  function exit() {
    gsap.to(loader, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power4.inOut',
      force3D: true,
      onComplete: () => {
        loader.style.display = 'none';
        if (onComplete) onComplete();
      }
    });
  }

  requestAnimationFrame(tick);
}
