/**
 * Forms and Calculator Service
 * Implements centralized packages configuration validation,
 * dynamic select dropdown hydration, cost calculation, and inquiry form metadata bindings.
 */

import { PACKAGE_CONFIG } from '../config/packages.config.js';
import { translations } from '../config/translations.js';
import { trackEvent } from './analytics.js';

// --- CONFIGURATION VALIDATION LAYER (CTO Recommendation 10) ---
export function validatePackageConfig(config) {
  const errors = [];
  const packageIds = new Set();

  if (!config || !Array.isArray(config.packages)) {
    errors.push("Invalid configuration: packages is missing or not an array.");
    return { valid: false, errors };
  }

  config.packages.forEach(pkg => {
    // Check IDs
    if (!pkg.id) {
      errors.push("Package missing unique ID.");
    } else if (packageIds.has(pkg.id)) {
      errors.push(`Duplicate Package ID detected: ${pkg.id}`);
    } else {
      packageIds.add(pkg.id);
    }

    // Check Status
    const validStatuses = ['active', 'upcoming', 'sold_out', 'hidden'];
    if (!pkg.status || !validStatuses.includes(pkg.status)) {
      errors.push(`Package ${pkg.id || 'unknown'} has invalid status: ${pkg.status}`);
    }

    // Check pricing and variants
    if (pkg.variants) {
      const variantIds = new Set();
      pkg.variants.forEach(v => {
        if (!v.id) {
          errors.push(`Package ${pkg.id} variant missing ID.`);
        } else if (variantIds.has(v.id)) {
          errors.push(`Package ${pkg.id} has duplicate variant ID: ${v.id}`);
        } else {
          variantIds.add(v.id);
        }

        if (typeof v.price !== 'number' || v.price < 0) {
          errors.push(`Package ${pkg.id} variant ${v.id || 'unknown'} has negative or invalid price: ${v.price}`);
        }
      });
    } else if (pkg.departures) {
      pkg.departures.forEach(dep => {
        if (!dep.city) {
          errors.push(`Package ${pkg.id} departure missing city name.`);
        }
        
        const variantIds = new Set();
        if (dep.variants) {
          dep.variants.forEach(v => {
            if (!v.id) {
              errors.push(`Package ${pkg.id} (${dep.city}) variant missing ID.`);
            } else if (variantIds.has(v.id)) {
              errors.push(`Package ${pkg.id} (${dep.city}) duplicate variant ID: ${v.id}`);
            } else {
              variantIds.add(v.id);
            }

            if (typeof v.price !== 'number' || v.price < 0) {
              errors.push(`Package ${pkg.id} (${dep.city}) variant ${v.id || 'unknown'} has invalid price: ${v.price}`);
            }
          });
        } else {
          errors.push(`Package ${pkg.id} (${dep.city}) missing price variants.`);
        }
      });
    } else {
      errors.push(`Package ${pkg.id} missing both variants and departures pricing.`);
    }
  });

  if (errors.length > 0) {
    console.error('[NH Config Validation Failed]:', errors);
    return { valid: false, errors };
  }
  return { valid: true, errors: [] };
}

// Run validation on load
const validationResult = validatePackageConfig(PACKAGE_CONFIG);
if (!validationResult.valid) {
  // Graceful fallback defaults if config is broken
  console.warn("NH Packages Config is invalid. App falling back to defensive mode.");
}

// Get package by ID or city departure helper
function getPackageData(pkgId, departureCity = null) {
  const pkgs = PACKAGE_CONFIG.packages;
  if (pkgId === 'group') {
    // Return group-mumbai or group-hubli based on departure city selected
    const targetId = departureCity === 'hubli' ? 'group-hubli' : 'group-mumbai';
    return pkgs.find(p => p.id === targetId);
  }
  return pkgs.find(p => p.id === pkgId);
}

// Populate dropdown fields dynamically based on the selected package context
export function updateCalculatorFields() {
  const pkgType = document.getElementById('calcPkgType').value;
  const departureSelect = document.getElementById('calcDeparture');
  const variantSelect = document.getElementById('calcVariant');
  
  if (!departureSelect || !variantSelect) return;

  // Save current values if any to restore them if valid
  const prevDep = departureSelect.value;
  const prevVar = variantSelect.value;

  // 1. Update Departures dropdown
  departureSelect.innerHTML = '';
  if (pkgType === 'group') {
    departureSelect.disabled = false;
    const optionMumb = new Option('Mumbai Departure', 'mumbai');
    const optionHubl = new Option('Hubli Departure', 'hubli');
    departureSelect.add(optionMumb);
    departureSelect.add(optionHubl);
    if (prevDep === 'mumbai' || prevDep === 'hubli') {
      departureSelect.value = prevDep;
    }
  } else {
    // Other packages don't have multiple departures in the config
    departureSelect.disabled = true;
    const optDefault = new Option('N/A (Standard)', 'standard');
    departureSelect.add(optDefault);
    departureSelect.value = 'standard';
  }

  // 2. Update Variants dropdown based on selected package and departure city
  variantSelect.innerHTML = '';
  const activeDepCity = departureSelect.value;
  const pkgData = getPackageData(pkgType, activeDepCity);

  if (pkgData) {
    variantSelect.disabled = false;
    const variants = pkgData.variants || (pkgData.departures && pkgData.departures.find(d => d.city.toLowerCase() === activeDepCity)?.variants) || [];
    
    variants.forEach(v => {
      const label = v.isStartingLabel ? `${v.name} (Onwards)` : v.name;
      const opt = new Option(label, v.id);
      variantSelect.add(opt);
    });

    // Try to restore previous variant selection
    const hasVar = Array.from(variantSelect.options).some(o => o.value === prevVar);
    if (hasVar) {
      variantSelect.value = prevVar;
    }
  } else {
    variantSelect.disabled = true;
    const optDefault = new Option('Standard', 'std');
    variantSelect.add(optDefault);
    variantSelect.value = 'std';
  }
}

// --- COST CALCULATOR FORM LOGIC ---
export function calculateCost() {
  const pkgType = document.getElementById('calcPkgType').value;
  const departureSelect = document.getElementById('calcDeparture');
  const variantSelect = document.getElementById('calcVariant');
  const sharingSelect = document.getElementById('calcSharing');
  
  if (!departureSelect || !variantSelect || !sharingSelect) return;

  const depCity = departureSelect.value;
  const variantId = variantSelect.value;
  const sharing = sharingSelect.value;

  let adults = parseInt(document.getElementById('calcAdults').value) || 1;
  let kids = parseInt(document.getElementById('calcKids').value) || 0;
  if (adults < 1) { adults = 1; document.getElementById('calcAdults').value = 1; }
  if (kids < 0) { kids = 0; document.getElementById('calcKids').value = 0; }

  // 1. Get Base price from packages configuration
  const pkgData = getPackageData(pkgType, depCity);
  let basePrice = 0;
  let hasStartingMarker = false;

  if (pkgData) {
    let variants = [];
    if (pkgData.variants) {
      variants = pkgData.variants;
    } else if (pkgData.departures) {
      const depConfig = pkgData.departures.find(d => d.city.toLowerCase() === depCity);
      if (depConfig) {
        variants = depConfig.variants;
      }
    }
    const selectedVariant = variants.find(v => v.id === variantId);
    if (selectedVariant) {
      basePrice = selectedVariant.price;
      hasStartingMarker = selectedVariant.isStartingLabel || false;
    }
  }

  // 2. Room Sharing multipliers
  const sharingMultipliers = {
    quad: 1.0,
    triple: 1.1,
    double: 1.25,
    single: 1.6
  };
  const multiplier = sharingMultipliers[sharing] || 1.0;

  // Calculate pricing (Hajj, Couple, Family have package-total base prices rather than per-person,
  // except we divide Couple by 2 and Family by 4 in basePrice per person to run calculations correctly)
  let calcBase = basePrice;
  if (pkgData && pkgData.id === 'couple') {
    calcBase = basePrice / 2;
  } else if (pkgData && pkgData.id === 'family') {
    calcBase = basePrice / 4;
  }

  const adultPrice = Math.round(calcBase * multiplier);
  const kidPrice = Math.round(calcBase * 0.75 * multiplier);
  const total = (adultPrice * adults) + (kidPrice * kids);

  // Format currency
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  const formattedTotal = formatter.format(total);
  const priceDisplayEl = document.getElementById('calcEstimatedPrice');
  if (priceDisplayEl) {
    priceDisplayEl.textContent = hasStartingMarker ? `${formattedTotal} onwards` : formattedTotal;
  }

  // --- UPDATE METADATA HIDDEN FIELDS ON INQUIRY FORM (CTO Recommendation 5) ---
  const inqPkgSelect = document.getElementById('inq-package');
  const inqPkgId = document.getElementById('inq-packageId');
  const inqDepId = document.getElementById('inq-departureId');
  const inqVarId = document.getElementById('inq-variantId');
  const inqPrice = document.getElementById('inq-calculatedPrice');

  if (pkgData) {
    if (inqPkgSelect) {
      // Sync package selection value in the contact form
      inqPkgSelect.value = pkgData.id;
    }
    if (inqPkgId) inqPkgId.value = pkgData.id;
    if (inqDepId) inqDepId.value = depCity !== 'standard' ? depCity : 'Default';
    if (inqVarId) inqVarId.value = variantId;
    if (inqPrice) inqPrice.value = total;
  }

  // --- TELEMETRY TRACKER (CTO Recommendation 7) ---
  trackEvent('calculator_change', 'Calculate Cost', pkgData ? pkgData.id : pkgType, total);

  // --- DYNAMIC WHATSAPP QUERY GENERATION (CTO Recommendation 6) ---
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const pkgName = translations[lang][pkgData?.nameKey] || pkgType;
  const sharingName = translations[lang][`calc.sharing.${sharing}`] || sharing;
  const variantName = variantSelect.options[variantSelect.selectedIndex]?.text || variantId;
  const departureName = depCity !== 'standard' ? departureSelect.options[departureSelect.selectedIndex]?.text : 'Standard';

  const messageText = `Assalamu Alaikum. I calculated an estimated package cost on your website:
- *Package:* ${pkgName}
- *Departure:* ${departureName}
- *Variant:* ${variantName}
- *Room Sharing:* ${sharingName}
- *Adults:* ${adults}
- *Children:* ${kids}
- *Estimated Total:* ${formattedTotal}${hasStartingMarker ? ' onwards' : ''}

Please assist me with booking and options.`;

  const encodedText = encodeURIComponent(messageText);
  const calcWaBtn = document.getElementById('calcWhatsAppBtn');
  if (calcWaBtn) {
    calcWaBtn.href = `https://wa.me/919986925592?text=${encodedText}`;
    calcWaBtn.addEventListener('click', () => {
      trackEvent('whatsapp_click', 'Calculator WhatsApp Submit', pkgData?.id, total);
    });
  }
}

// Initialize Inquiry form link generation and inputs tracker
(function() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  function buildMessage() {
    const name = document.getElementById('inq-name').value.trim();
    const phone = document.getElementById('inq-phone').value.trim();
    const email = document.getElementById('inq-email').value.trim();
    const pkgSelect = document.getElementById('inq-package');
    const pkg = pkgSelect.options[pkgSelect.selectedIndex]?.text || '';
    const msg = document.getElementById('inq-message').value.trim();
    
    let lines = ['Assalamu Alaikum.', 'I am interested in a Noor-E-Haram package.'];
    if (name) lines.push('Name: ' + name);
    if (phone) lines.push('Phone: ' + phone);
    if (email) lines.push('Email: ' + email);
    if (pkg) lines.push('Package: ' + pkg);
    
    const hiddenPrice = document.getElementById('inq-calculatedPrice').value;
    if (hiddenPrice) {
      const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
      lines.push('Estimated Calculator Cost: ' + formatter.format(hiddenPrice));
    }
    
    if (msg) lines.push('Message: ' + msg);
    return lines.join('\n');
  }

  function updateLinks() {
    const text = buildMessage();
    const waBtn = document.getElementById('waSendBtn');
    const emailBtn = document.getElementById('emailSendBtn');
    if (waBtn) waBtn.href = 'https://wa.me/919986925592?text=' + encodeURIComponent(text);
    if (emailBtn) emailBtn.href = 'mailto:nooreharamindia@gmail.com?subject=' + encodeURIComponent('Package Inquiry - Noor-E-Haram') + '&body=' + encodeURIComponent(text);
  }

  ['inq-name','inq-phone','inq-email','inq-package','inq-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateLinks);
  });

  // Track package selection change in inquiry form
  const inqPkgSelect = document.getElementById('inq-package');
  if (inqPkgSelect) {
    inqPkgSelect.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      trackEvent('package_select', 'Inquiry Form Dropdown Select', selectedId);
      updateLinks();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = document.documentElement.getAttribute('lang') || 'en';
    const statusBox = document.getElementById('formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const pkgId = document.getElementById('inq-packageId')?.value || (inqPkgSelect ? inqPkgSelect.value : 'general');
    const calculatedPrice = document.getElementById('inq-calculatedPrice')?.value || 0;

    trackEvent('calculator_submit', 'Form Submit Attempt', pkgId, calculatedPrice);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    try {
      const formData = new FormData(form);
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      statusBox.style.display = 'block';
      if (res.ok) {
        statusBox.style.background = '#e1f5ee';
        statusBox.style.color = '#0f6e56';
        statusBox.textContent = translations[lang]['contact.form.success'] || 'Thank you! Your inquiry has been sent to Noor-E-Haram team. We will contact you shortly.';
        trackEvent('book_now', 'Form Submit Success', pkgId, calculatedPrice);
        form.reset();
        updateLinks();
      } else {
        statusBox.style.background = '#fde2e2';
        statusBox.style.color = '#a33';
        statusBox.textContent = translations[lang]['contact.form.error'] || 'Something went wrong. Please try WhatsApp or Email instead.';
      }
    } catch (err) {
      statusBox.style.display = 'block';
      statusBox.style.background = '#fde2e2';
      statusBox.style.color = '#a33';
      statusBox.textContent = translations[lang]['contact.form.error'] || 'Could not send. Please try WhatsApp or Email instead.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '📨 Submit Inquiry';
    }
  });
})();
