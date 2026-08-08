// Page Loader Fadeout UI Controller
export function initPageLoader() {
  function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.style.display = 'none';
          loader.remove();
        }
      }, 400);
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 100);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 100));
    document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 200));
    setTimeout(hideLoader, 800); // Fast safety fallback
  }
}
