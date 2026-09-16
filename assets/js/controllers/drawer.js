// Mobile Menu Drawer & Dialog UI Controller
const navToggle = document.getElementById('navToggle');
let drawerLastFocus = null;

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const isOpen = drawer && drawer.classList.contains('open');
    if (!isOpen && drawer && overlay) {
      drawerLastFocus = document.activeElement;
      drawer.classList.add('open');
      overlay.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      const closeBtn = document.getElementById('drawerCloseBtn');
      if (closeBtn) closeBtn.focus();
    } else {
      closeDrawer();
    }
  });
}

function closeDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
  }
  if (drawerLastFocus && typeof drawerLastFocus.focus === 'function') {
    drawerLastFocus.focus();
  }
}

// Global keyboard handler for Escape and focus trapping
document.addEventListener('keydown', (e) => {
  const drawer = document.getElementById('mobileDrawer');
  const isDrawerOpen = drawer && drawer.classList.contains('open');
  const qbModal = document.getElementById('quickBookModal');
  const isModalOpen = qbModal && (qbModal.style.display === 'flex' || qbModal.style.display === 'block');

  if (e.key === 'Escape') {
    if (isModalOpen) {
      if (typeof window.closeQuickBook === 'function') {
        window.closeQuickBook();
      } else {
        qbModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    } else if (isDrawerOpen) {
      closeDrawer();
    }
    return;
  }

  if (e.key === 'Tab') {
    if (isModalOpen) {
      const focusable = qbModal.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    } else if (isDrawerOpen) {
      const focusable = drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }
});

export { closeDrawer };
