/**
 * Lazy Loading Service
 * Lazy loads below-the-fold image, picture, and iframe elements using IntersectionObserver.
 * Improves initial page load performance and reduces layout shifts.
 */

export function initLazyLoading() {
  // Support for standard images, pictures, and iframes
  const lazyElements = document.querySelectorAll('img[data-src], picture[data-src], iframe[data-src]');
  
  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // If it's a picture element, update sources
          if (el.tagName === 'PICTURE') {
            const sources = el.querySelectorAll('source');
            sources.forEach(source => {
              if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
              }
            });
            const img = el.querySelector('img');
            if (img && img.dataset.src) {
              img.src = img.dataset.src;
            }
          } else {
            // For standard img or iframe
            if (el.dataset.src) {
              el.src = el.dataset.src;
            }
            if (el.dataset.srcset) {
              el.srcset = el.dataset.srcset;
            }
          }
          
          el.classList.add('lazy-loaded');
          lazyObserver.unobserve(el);
        }
      });
    }, {
      rootMargin: '0px 0px 300px 0px', // Preload assets 300px before they enter the viewport
      threshold: 0.01
    });
    
    lazyElements.forEach(el => lazyObserver.observe(el));
  } else {
    // Fallback for older browsers without IntersectionObserver support
    lazyElements.forEach(el => {
      if (el.tagName === 'PICTURE') {
        el.querySelectorAll('source').forEach(src => {
          if (src.dataset.srcset) src.srcset = src.dataset.srcset;
        });
        const img = el.querySelector('img');
        if (img && img.dataset.src) img.src = img.dataset.src;
      } else {
        if (el.dataset.src) el.src = el.dataset.src;
        if (el.dataset.srcset) el.srcset = el.dataset.srcset;
      }
    });
  }
}
