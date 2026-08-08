// Scrolled Header Navigation UI Controller
export function initNavigation() {
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) { header.classList.add('scrolled'); header.classList.remove('hero-mode'); }
  else { header.classList.remove('scrolled'); header.classList.add('hero-mode'); }
}, { passive: true });



}
