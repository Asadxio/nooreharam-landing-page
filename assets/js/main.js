/**
 * Noor-E-Haram Web App Entry Point
 * Enterprise Architecture (Phase 2)
 * Coordinates service initialization, central error handling, and event bindings.
 */

import { initTheme, toggleTheme } from './services/theme.js';
import { setLang, applyAllTranslations, currentLang } from './services/i18n.js';
import { initBranchLocator, filterBranches, updateCityDropdown } from './services/branches.js';
import { 
  selectWizardOption, 
  navigateWizard, 
  resetWizard, 
  copyWizardChecklist, 
  shareWizardWhatsApp 
} from './services/wizard.js';
import { calculateCost } from './services/forms.js';
import { toggleDuaAudio } from './services/audio.js';
import { initNavigation } from './controllers/navigation.js';
import { closeDrawer } from './controllers/drawer.js';
import { toggleFaq } from './controllers/faq.js';
import { initPageLoader } from './controllers/animations.js';
import { initScrollReveal } from './controllers/intersection.js';
import { initAnalytics } from './services/analytics.js';
import { initLazyLoading } from './services/lazyload.js';
import { initPremiumEffects } from './controllers/premium-effects.js';

// Central Error Handling & Logging
function initCentralErrorHandler() {
  window.NH_DEBUG = false; // Set to true to print detailed error logging

  window.addEventListener('error', (event) => {
    console.error('[NH Application Error]:', event.message, 'at', event.filename, ':', event.lineno);
    // Silent fail in production or send to error reporter if applicable
    event.preventDefault();
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[NH Unhandled Rejection]:', event.reason);
    event.preventDefault();
  });
}

// Bind event listeners dynamically to replace inline HTML onclick attributes
function bindDOMEvents() {
  // Theme Toggle Button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.removeAttribute('onclick'); // Remove inline handler if present
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Language Dropdown Buttons
  document.querySelectorAll('.lang-option').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => {
      setLang(el.dataset.lang);
    });
  });

  // Mobile Drawer Events
  const navToggle = document.getElementById('navToggle');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.getElementById('mobileDrawer').classList.add('open');
      drawerOverlay.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
    });
  }

  if (drawerOverlay) {
    drawerOverlay.removeAttribute('onclick');
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.removeAttribute('onclick');
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  // Drawer menu link bindings (closes drawer when a navigation link is clicked)
  document.querySelectorAll('.drawer-nav a').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', closeDrawer);
  });

  // Dua Audio Player Buttons
  document.querySelectorAll('.dua-audio-btn').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.duaId, 10);
      toggleDuaAudio(id, el);
    });
  });

  // Checklist Wizard Option Cards
  document.querySelectorAll('.wizard-option-card').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => {
      const category = el.dataset.category;
      const value = el.dataset.value;
      selectWizardOption(category, value, el);
    });
  });

  // Checklist Wizard Buttons
  const wizBtnWa = document.getElementById('wizBtnWa');
  const wizBtnCopy = document.getElementById('wizBtnCopy');
  const wizBtnPrint = document.getElementById('wizBtnPrint');
  const wizBtnPrev = document.getElementById('wizBtnPrev');
  const wizBtnNext = document.getElementById('wizBtnNext');
  const wizBtnReset = document.getElementById('wizBtnReset');

  if (wizBtnWa) {
    wizBtnWa.removeAttribute('onclick');
    wizBtnWa.addEventListener('click', shareWizardWhatsApp);
  }
  if (wizBtnCopy) {
    wizBtnCopy.removeAttribute('onclick');
    wizBtnCopy.addEventListener('click', copyWizardChecklist);
  }
  if (wizBtnPrint) {
    wizBtnPrint.removeAttribute('onclick');
    wizBtnPrint.addEventListener('click', () => window.print());
  }
  if (wizBtnPrev) {
    wizBtnPrev.removeAttribute('onclick');
    wizBtnPrev.addEventListener('click', () => navigateWizard(-1));
  }
  if (wizBtnNext) {
    wizBtnNext.removeAttribute('onclick');
    wizBtnNext.addEventListener('click', () => navigateWizard(1));
  }
  if (wizBtnReset) {
    wizBtnReset.removeAttribute('onclick');
    wizBtnReset.addEventListener('click', resetWizard);
  }

  // FAQ Accordion Collapsible Buttons
  document.querySelectorAll('.faq-question').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => {
      toggleFaq(el);
    });
  });

  // Cost Calculator input changes binding
  ['calcPkgType', 'calcSharing', 'calcAdults', 'calcKids', 'calcDeparture', 'calcVariant'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', calculateCost);
      el.addEventListener('input', calculateCost);
    }
  });

  // Escape key drawer closure listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Currency Switcher Event Binding
  let currentCurrency = 'INR';
  const currencyRates = { INR: 1, SAR: 0.045, USD: 0.012 };
  const currencySymbols = { INR: '₹', SAR: '﷼ ', USD: '$' };

  document.querySelectorAll('.currency-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.currency-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.dataset.currency;
      
      const rate = currencyRates[currentCurrency] || 1;
      const symbol = currencySymbols[currentCurrency] || '₹';
      document.querySelectorAll('.pkg-price-num, .price-val').forEach(el => {
        const inrPrice = parseFloat(el.dataset.inr || el.textContent.replace(/[^0-9.]/g, ''));
        if (!el.dataset.inr && inrPrice) el.dataset.inr = inrPrice;
        const base = parseFloat(el.dataset.inr || 0);
        if (base) {
          const converted = Math.round(base * rate);
          el.textContent = symbol + converted.toLocaleString();
        }
      });
    });
  });

  // Smart Package Filter Pills Event Binding
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      document.querySelectorAll('.package-card, .pkg-card').forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          const cardText = card.textContent.toLowerCase();
          const cardId = card.id || '';
          if (cardText.includes(filter) || cardId.includes(filter)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // Global Search Input Event Binding
  const globalSearchInput = document.getElementById('globalSearchInput');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.package-card, .pkg-card, .service-card, .branch-card').forEach(card => {
        if (!query) {
          card.style.display = '';
        } else {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(query) ? '' : 'none';
        }
      });
    });
  }

  // Quick Booking Modal Event Binding
  const quickBookModal = document.getElementById('quickBookModal');
  const closeQbBtn = document.getElementById('closeQuickBookModal');
  const qbSubmitBtn = document.getElementById('qbSubmitBtn');

  if (closeQbBtn && quickBookModal) {
    closeQbBtn.addEventListener('click', () => {
      quickBookModal.style.display = 'none';
    });
    quickBookModal.addEventListener('click', (e) => {
      if (e.target === quickBookModal) quickBookModal.style.display = 'none';
    });
  }

  window.openQuickBook = function(packageName) {
    if (!quickBookModal) return;
    document.getElementById('qbPackageName').value = packageName || 'Noor-E-Haram Package';
    quickBookModal.style.display = 'flex';
  };

  if (qbSubmitBtn) {
    qbSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg = document.getElementById('qbPackageName').value;
      const city = document.getElementById('qbDepartureCity').value;
      const month = document.getElementById('qbTravelMonth').value;
      const adults = document.getElementById('qbAdults').value || 1;
      const kids = document.getElementById('qbKids').value || 0;

      const msg = `Assalamu Alaikum. I am interested in booking:
- *Package:* ${pkg}
- *Departure City:* ${city}
- *Target Month:* ${month}
- *Travelers:* ${adults} Adults, ${kids} Children

Please share availability and package details.`;
      
      window.open(`https://wa.me/919986925592?text=${encodeURIComponent(msg)}`, '_blank');
      quickBookModal.style.display = 'none';
    });
  }
}

// Service initialization
function initApp() {
  try {
    // Expose functions globally for inline HTML event handlers
    window.toggleTheme = toggleTheme;
    window.setLang = setLang;
    window.filterBranches = filterBranches;
    window.updateCityDropdown = updateCityDropdown;
    window.closeDrawer = closeDrawer;
    window.toggleFaq = toggleFaq;
    window.toggleDuaAudio = toggleDuaAudio;
    window.selectWizardOption = selectWizardOption;
    window.navigateWizard = navigateWizard;
    window.resetWizard = resetWizard;
    window.copyWizardChecklist = copyWizardChecklist;
    window.shareWizardWhatsApp = shareWizardWhatsApp;
    window.calculateCost = calculateCost;

    initCentralErrorHandler();
    initTheme();
    
    // Set initial i18n localization values
    setLang(currentLang);
    
    initBranchLocator();
    bindDOMEvents();
    
    // Initialize UI Controllers
    initNavigation();
    initPageLoader();
    initScrollReveal();
    
    // Premium 3D Effects (all effects bundled in premium-effects.js)
    initPremiumEffects();

    initLazyLoading();
    initAnalytics();
    
    // Register service worker for PWA support (Task 8)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(reg => {
            if (window.NH_DEBUG) console.log('[PWA ServiceWorker]: Registered with scope:', reg.scope);
          })
          .catch(err => {
            console.error('[PWA ServiceWorker]: Registration failed:', err);
          });
      });
    }
  } catch (error) {
    console.error('[NH Critical Startup Failure]:', error);
    
    // Force hide loader immediately (Step 3)
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 700);
    }
    
    // Display user-friendly notification screen banner dynamically
    const errorBanner = document.createElement('div');
    errorBanner.style.cssText = 'position:fixed; bottom:16px; left:16px; right:16px; background:#fde2e2; color:#a33; border:1px solid #f5c6cb; padding:12px 16px; border-radius:8px; font-size:14px; z-index:100000; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:flex; justify-content:space-between; align-items:center;';
    errorBanner.innerHTML = `
      <span>⚠️ <strong>System Notice:</strong> Some interactive elements failed to load. You can still browse the page or contact us on WhatsApp.</span>
      <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#a33; font-weight:bold; cursor:pointer; font-size:16px; margin-left:12px;">×</button>
    `;
    document.body.appendChild(errorBanner);
  }
}

// Execute application bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
