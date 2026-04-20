export function initServices() {
  const clickableRows = document.querySelectorAll('.service-row--clickable');

  clickableRows.forEach(row => {
    const trigger = row.querySelector('.service-trigger');
    const panel   = row.querySelector('.service-panel');

    gsap.set(panel, { height: 0, opacity: 0 });

    let isOpen = false;

    const isTriggerHidden = () => trigger && window.getComputedStyle(trigger).display === 'none';

    const toggle = () => {
      if (!isOpen) {
        gsap.to(panel, {
          height: 'auto',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.inOut',
          onStart: () => { panel.style.overflow = 'hidden'; }
        });
        isOpen = true;
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        row.classList.add('is-open');
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power4.inOut'
        });
        isOpen = false;
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        row.classList.remove('is-open');
      }
    };

    if (trigger) {
      trigger.addEventListener('click', toggle);
    }
    row.addEventListener('click', e => {
      if (isTriggerHidden() && !e.target.closest('.service-panel')) {
        toggle();
      }
    });
  });

  // Clip-mask reveal for service words
  const serviceWords = document.querySelectorAll('.service-word');
  serviceWords.forEach(word => {
    const clip = document.createElement('span');
    clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-top:0.4em;margin-top:-0.4em;padding-bottom:0.1em;margin-bottom:-0.1em;';
    word.parentNode.insertBefore(clip, word);
    clip.appendChild(word);
  });

  gsap.set(serviceWords, { y: '110%', opacity: 1, force3D: true });
  gsap.to(serviceWords, {
    y: '0%',
    duration: 1.0,
    stagger: 0.06,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.services',
      start: 'top 82%',
      once: true
    }
  });

  const serviceImgs = document.querySelectorAll('.service-inline-img');
  gsap.set(serviceImgs, { scale: 0.9, opacity: 0 });
  gsap.to(serviceImgs, {
    scale: 1,
    opacity: 1,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power4.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.services',
      start: 'top 72%',
      once: true
    }
  });
}
