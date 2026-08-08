/**
 * Analytics & Telemetry Service
 * Configuration-driven service to track user interactions and business-critical CTAs.
 * Abstracted to support GA4, custom API, or third-party CRM integrations.
 */

// Helper to log event to console in development and forward to GA4/other tracker if present
export function trackEvent(category, action, label = null, value = null) {
  const payload = { category, action, label, value };
  
  // Console logging in development or debug mode
  if (window.NH_DEBUG || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('[NH Analytics Event]:', payload);
  }
  
  // Forward to Google Analytics (gtag)
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

// Initialize scroll depth tracking
export function initScrollDepthTracking() {
  let trackedThresholds = new Set();
  
  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    
    const scrollPercentage = Math.round((window.scrollY / scrollHeight) * 100);
    
    // Track thresholds at 25%, 50%, 75%, 100%
    [25, 50, 75, 100].forEach(threshold => {
      if (scrollPercentage >= threshold && !trackedThresholds.has(threshold)) {
        trackedThresholds.add(threshold);
        trackEvent('Engagement', 'Scroll Depth', `${threshold}%`);
      }
    });
  }, { passive: true });
}

// Bind analytics to critical DOM elements
export function initAnalytics() {
  initScrollDepthTracking();
  
  // Track WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(el => {
    el.addEventListener('click', () => {
      const location = el.closest('section')?.id || el.closest('footer')?.tagName || 'Floating Button';
      trackEvent('Conversion', 'WhatsApp Click', location);
    });
  });
  
  // Track Phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', () => {
      trackEvent('Conversion', 'Phone Click', el.getAttribute('href'));
    });
  });
  
  // Track Email clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    el.addEventListener('click', () => {
      trackEvent('Conversion', 'Email Click', el.getAttribute('href'));
    });
  });
  
  // Track Navigation link clicks
  document.querySelectorAll('.desktop-nav a, .drawer-nav a').forEach(el => {
    el.addEventListener('click', () => {
      trackEvent('Navigation', 'Menu Click', el.textContent.trim());
    });
  });

  // Track Hero CTA clicks
  document.querySelectorAll('.hero-buttons .btn').forEach(el => {
    el.addEventListener('click', () => {
      trackEvent('Navigation', 'Hero CTA Click', el.textContent.trim());
    });
  });

  // Track Package link clicks
  document.querySelectorAll('.package-card .btn, .tour-card .btn').forEach(el => {
    el.addEventListener('click', () => {
      const pkgTitle = el.closest('.package-card, .tour-card')?.querySelector('h3, h4')?.textContent.trim() || 'Unknown Package';
      trackEvent('Engagement', 'Package Click', pkgTitle);
    });
  });
}
