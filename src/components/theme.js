export function initTheme() {
  const btn   = document.getElementById('nav-theme-btn');
  const root  = document.documentElement;
  const icon  = btn.querySelector('.nav-theme-icon');
  const label = btn.querySelector('.nav-theme-label');

  function apply(theme) {
    if (theme === 'dark') {
      root.dataset.theme = 'dark';
      icon.textContent   = '○';
      label.textContent  = 'Light';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      delete root.dataset.theme;
      icon.textContent   = '●';
      label.textContent  = 'Dark';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
    localStorage.setItem('focal-theme', theme);
  }

  // Sync button state with whatever the anti-FOUC script applied
  const saved = localStorage.getItem('focal-theme');
  apply(saved === 'dark' ? 'dark' : 'light');

  btn.addEventListener('click', () => {
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}
