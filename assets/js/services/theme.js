// Theme Preference Service
// ── DARK MODE THEME SYSTEM ──
function initTheme() {
  const theme = localStorage.getItem('nh_theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-theme');
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = '🌙';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark-theme');
  const icon = document.querySelector('.theme-icon');
  if (isDark) {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('nh_theme', 'light');
    if (icon) icon.textContent = '🌙';
  } else {
    document.body.classList.add('dark-theme');
    localStorage.setItem('nh_theme', 'dark');
    if (icon) icon.textContent = '☀️';
  }
}



export { initTheme, toggleTheme };
