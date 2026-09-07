// Theme Preference Service
// ── DARK MODE THEME SYSTEM ──
const SUN_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const MOON_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

function initTheme() {
  const theme = localStorage.getItem('nh_theme') || 'light';
  const icon = document.querySelector('.theme-icon');
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    if (icon) icon.innerHTML = SUN_ICON;
  } else {
    document.body.classList.remove('dark-theme');
    if (icon) icon.innerHTML = MOON_ICON;
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark-theme');
  const icon = document.querySelector('.theme-icon');
  if (isDark) {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('nh_theme', 'light');
    if (icon) icon.innerHTML = MOON_ICON;
  } else {
    document.body.classList.add('dark-theme');
    localStorage.setItem('nh_theme', 'dark');
    if (icon) icon.innerHTML = SUN_ICON;
  }
}



export { initTheme, toggleTheme };
