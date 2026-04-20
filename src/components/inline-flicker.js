export function initInlineFlicker() {
  const INTERVAL = 120; // ms between frames

  const containers = document.querySelectorAll(
    '.hero-inline-img, .service-inline-img, .break-img'
  );

  containers.forEach(container => {
    const imgs = Array.from(container.querySelectorAll('img'));
    if (imgs.length < 2) return;

    let timer = null;
    let idx = 0;

    function advance() {
      imgs[idx].classList.remove('is-active');
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add('is-active');
    }

    container.addEventListener('mouseenter', () => {
      timer = setInterval(advance, INTERVAL);
    });

    container.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = null;
      imgs.forEach(img => img.classList.remove('is-active'));
      idx = 0;
      imgs[0].classList.add('is-active');
    });
  });
}
