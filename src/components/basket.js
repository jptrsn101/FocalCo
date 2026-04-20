const STORAGE_KEY = 'focal-cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function initBasket() {
  const cartBtn    = document.getElementById('nav-cart-btn');
  const countEl    = document.getElementById('nav-cart-count');
  const drawer     = document.getElementById('cart-drawer');
  const scrim      = document.getElementById('cart-scrim');
  const totalEl    = document.getElementById('cart-drawer-total');
  const listEl     = document.getElementById('cart-drawer-list');
  const emptyEl    = document.getElementById('cart-drawer-empty');
  const checkoutEl = drawer.querySelector('.cart-drawer-checkout');

  let cart      = loadCart();
  let isOpen    = false;

  // ── Render ──────────────────────────────────────────────────
  function render() {
    listEl.innerHTML = '';

    const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

    // Count badge
    countEl.textContent = totalQty;
    totalQty > 0 ? countEl.removeAttribute('hidden') : countEl.setAttribute('hidden', '');

    // Total headline
    totalEl.textContent = `£${totalPrice.toLocaleString('en-GB')}`;

    if (cart.length === 0) {
      emptyEl.classList.add('is-visible');
      checkoutEl.classList.remove('is-visible');
      return;
    }

    emptyEl.classList.remove('is-visible');

    cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'cart-drawer-item';
      li.innerHTML = `
        <span class="cart-drawer-item-name">${item.name}</span>
        <span class="cart-drawer-item-qty">× ${item.qty}</span>
        <span class="cart-drawer-item-price">£${(item.price * item.qty).toLocaleString('en-GB')}</span>
        <button class="cart-drawer-item-remove" aria-label="Remove ${item.name}">×</button>
      `;
      li.querySelector('.cart-drawer-item-remove').addEventListener('click', () => removeItem(idx));
      listEl.appendChild(li);

      // Stagger visible class so items animate in sequence
      requestAnimationFrame(() => {
        setTimeout(() => li.classList.add('is-visible'), idx * 60);
      });
    });

    checkoutEl.classList.add('is-visible');
  }

  // ── Open / close ────────────────────────────────────────────
  function openDrawer() {
    isOpen = true;
    render();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-active');
  }

  function closeDrawer() {
    isOpen = false;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-active');
  }

  cartBtn.addEventListener('click', () => isOpen ? closeDrawer() : openDrawer());
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeDrawer(); });

  // ── Mutations ───────────────────────────────────────────────
  function bump() {
    cartBtn.classList.remove('is-bumping');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('is-bumping');
    cartBtn.addEventListener('animationend', () => cartBtn.classList.remove('is-bumping'), { once: true });
  }

  function addItem(name, price) {
    const existing = cart.find(i => i.name === name);
    existing ? existing.qty += 1 : cart.push({ name, price, qty: 1 });
    saveCart(cart);
    render();
    bump();
    if (isOpen) {
      // Re-render already handled; re-stagger items
    }
  }

  function removeItem(idx) {
    const li = listEl.querySelectorAll('.cart-drawer-item')[idx];
    if (li) {
      li.style.transition = 'opacity 0.2s, transform 0.2s';
      li.style.opacity    = '0';
      li.style.transform  = 'translateX(12px)';
      setTimeout(() => {
        cart.splice(idx, 1);
        saveCart(cart);
        render();
      }, 200);
    }
  }

  // ── Wire up product buttons ──────────────────────────────────
  document.querySelectorAll('.product-cta[data-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      addItem(btn.dataset.product, Number(btn.dataset.price));

      const arrow = btn.querySelector('span');
      const label = btn.childNodes[0];
      const prev  = label.textContent.trim();
      label.textContent = 'Added ';
      if (arrow) arrow.textContent = '✓';
      setTimeout(() => {
        label.textContent = prev + ' ';
        if (arrow) arrow.textContent = '→';
      }, 1200);
    });
  });

  render();
}
