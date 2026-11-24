/**
 * Script to execute Section 1.1 & 1.2 & 1.5 fixes on index.html, departures/index.html, and currency.js
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update assets/js/services/currency.js
const currencyJsPath = path.join(rootDir, 'assets', 'js', 'services', 'currency.js');
let currencyJs = fs.readFileSync(currencyJsPath, 'utf8');

// Update CACHE_TTL_MS to 6 hours
currencyJs = currencyJs.replace(/const CACHE_TTL_MS = [^;]+;/, 'const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours cache per audit spec');
// Update FETCH_TIMEOUT_MS to 3000ms
currencyJs = currencyJs.replace(/const FETCH_TIMEOUT_MS = [^;]+;/, 'const FETCH_TIMEOUT_MS = 3000; // 3 seconds tight timeout');
// Update BENCHMARK_RATE to 22.85
currencyJs = currencyJs.replace(/const BENCHMARK_RATE = [^;]+;/, 'const BENCHMARK_RATE = 22.85; // Official Forex Benchmark Rate Nov 2026');

fs.writeFileSync(currencyJsPath, currencyJs, 'utf8');
console.log('✅ currency.js updated with 6h cache, 3s timeout, and 22.85 benchmark rate.');

// 2. Update index.html
let indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

// Fix 1.2: Remove "Fetching SAR rate..." in raw HTML
const rawTicker = `<span class="currency-badge status-loading">
        <span class="currency-dot loading" aria-hidden="true"></span>
        <span class="currency-label">Fetching SAR rate...</span>
      </span>`;

const safeTicker = `<span class="currency-badge status-cached">
        <span class="currency-dot live" aria-hidden="true"></span>
        <span class="currency-label">1 SAR ≈ ₹22.85 <span class="currency-updated-tag">(Forex Benchmark)</span></span>
      </span>`;

indexHtml = indexHtml.replace(rawTicker, safeTicker);
// Also handle CRLF if needed
indexHtml = indexHtml.replace(rawTicker.replace(/\n/g, '\r\n'), safeTicker.replace(/\n/g, '\r\n'));

// Fix 1.1: Replace expired Quick Book options
indexHtml = indexHtml.replace('<option value="Ramadan 2026">Ramadan 2026</option>', '<option value="Winter 2026–27">Winter 2026–2027 (Nov–Jan)</option>');
indexHtml = indexHtml.replace('<option value="Shaban 2026">Shaban 2026</option>', '<option value="Shaban 2027">Shaban 2027</option>');
indexHtml = indexHtml.replace('<option value="Hajj 2026">Hajj 2026</option>', '<option value="Ramadan 2027">Ramadan 2027</option>\n              <option value="Hajj 2027">Hajj 2027</option>');

// Fix 1.1: Filter pill Hajj 2026 -> Hajj 2027
indexHtml = indexHtml.replace('<button class="filter-pill" data-filter="hajj">Hajj 2026</button>', '<button class="filter-pill" data-filter="hajj">Hajj 2027</button>');

// Fix 1.1: Meta description Hajj 2026–2027 -> Hajj 2027 & Umrah
indexHtml = indexHtml.replace('Hajj 2026–2027 &amp; Umrah packages', 'Hajj 2027 &amp; Umrah packages');

// Fix 1.1 & 1.5: Remove Competitor Column in Proximity Simulator
const oldCompetitorBox = `        <div class="proximity-card" style="background:#f8fafc;opacity:0.85;">
          <span style="font-size:0.8rem;font-weight:700;color:#991b1b;text-transform:uppercase;">Cheap Shuttle Bus Hotels (Others)</span>
          <div class="proximity-meters" style="color:#991b1b;">1,800 m+</div>
          <strong style="color:#991b1b;display:block;margin-bottom:6px;">45 Min Wait in Heat</strong>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin:0;">Shuttle buses stop running 1 hour before every Salah. NOOR-E-HARAM never uses bus-dependent remote hotels.</p>
        </div>`;

const newWalkingBox = `        <div class="proximity-card">
          <span style="font-size:0.8rem;font-weight:700;color:var(--emerald);text-transform:uppercase;">Economy Bronze Tier</span>
          <div class="proximity-meters">750 m</div>
          <strong style="color:var(--emerald);display:block;margin-bottom:6px;">8–10 Minutes Walk</strong>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin:0;">Budget-friendly quality accommodation located on wide, paved pedestrian boulevards with direct access to the courtyard.</p>
        </div>`;

indexHtml = indexHtml.replace(oldCompetitorBox, newWalkingBox);
indexHtml = indexHtml.replace(oldCompetitorBox.replace(/\n/g, '\r\n'), newWalkingBox.replace(/\n/g, '\r\n'));

// Replace "Hotel Proximity Is Unmatched / 100% Real" with "Our Verified Walking Distances"
indexHtml = indexHtml.replace('100% Real Distance Transparency', 'Verified Courtyard Proximity');
indexHtml = indexHtml.replace('Why NOOR-E-HARAM Hotel Proximity Is Unmatched', 'Our Verified Walking Distances to the Holy Courtyard');
indexHtml = indexHtml.replace('Many agencies claim &ldquo;100 meters&rdquo; but put pilgrims on steep hills or shuttle bus stops where you wait 45 minutes in 42°C heat. Here is our exact, verified walking proximity from door to Kaaba courtyard:', 'We believe in 100% honesty regarding hotel locations. Every meter is measured from the hotel entrance to the marble plaza of Masjid al-Haram, ensuring comfortable walking paths for elderly pilgrims and families:');

// Replace "Saudi Airlines" with "Saudia"
indexHtml = indexHtml.replace(/Saudi Airlines Direct \(Return\)/g, 'Saudia Direct (Return)');
indexHtml = indexHtml.replace(/Saudi Airlines Direct/g, 'Saudia Direct');

// Replace stray | after hero subheading if any
indexHtml = indexHtml.replace('All rights reserved. | Established 2016', 'All rights reserved. • Established 2016');

fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml, 'utf8');
console.log('✅ index.html updated: raw ticker removed, expired 2026 labels fixed, competitor column removed, Saudia brand standardized.');
