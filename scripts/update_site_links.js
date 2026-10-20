const fs = require('fs');
const path = require('path');

// 1. Update index.html
let indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Add to Nav
if (!indexHtml.includes('/departures/')) {
  indexHtml = indexHtml.replace(
    '<a href="#about" data-i18n="nav.about">About</a>',
    '<a href="#about" data-i18n="nav.about">About</a>\n        <a href="/departures/" style="color:#C59B27;font-weight:700;">Live Departures</a>'
  );
  indexHtml = indexHtml.replace(
    '<div class="nav-dropdown">\n            <a href="/umrah/" class="nav-dd-item">Umrah Packages Hub</a>',
    '<div class="nav-dropdown">\n            <a href="/departures/" class="nav-dd-item" style="color:#C59B27;font-weight:700;">✈️ 51+ Live Flight Departures</a>\n            <a href="/umrah/" class="nav-dd-item">Umrah Packages Hub</a>'
  );
  // Add CTA in #batches
  const batchCta = `    </div>

    <div style="text-align:center;margin-top:32px;">
      <a href="/departures/" class="btn btn-primary" style="padding:14px 28px;font-size:1.05rem;font-weight:700;display:inline-flex;align-items:center;gap:10px;box-shadow:0 4px 14px rgba(6,40,30,0.25);">
        <span>✈️ View All 51+ Verified Live Flight Departures &amp; Tier Rates</span>
        <span aria-hidden="true">→</span>
      </a>
      <p style="color:#64748b;font-size:0.85rem;margin-top:10px;">Direct departures from Mumbai, Bengaluru, Delhi, Ahmedabad &amp; Lucknow with real-time seat tracking.</p>
    </div>

    <!-- Verified Hotel Proximity Simulator Box -->`;

  indexHtml = indexHtml.replace('    </div>\r\n\r\n    <!-- Verified Hotel Proximity Simulator Box -->', batchCta);
  indexHtml = indexHtml.replace('    </div>\n\n    <!-- Verified Hotel Proximity Simulator Box -->', batchCta);

  // Add to footer
  indexHtml = indexHtml.replace(
    '<li><a href="/packages/">All Packages Catalog</a></li>',
    '<li><a href="/packages/">All Packages Catalog</a></li>\n          <li><a href="/departures/" style="color:#E2C77F;font-weight:700;">✈️ Live Flight Departures (51 Batches)</a></li>'
  );

  fs.writeFileSync(path.join(__dirname, '..', 'index.html'), indexHtml, 'utf8');
  console.log('✅ index.html updated with /departures/ links.');
} else {
  console.log('ℹ️ index.html already contains /departures/.');
}

// 2. Update packages/index.html
const pkgPath = path.join(__dirname, '..', 'packages', 'index.html');
if (fs.existsSync(pkgPath)) {
  let pkgHtml = fs.readFileSync(pkgPath, 'utf8');
  if (!pkgHtml.includes('/departures/')) {
    pkgHtml = pkgHtml.replace(
      '<div class="container">',
      `<div class="container">
      <div style="background:linear-gradient(135deg, #06281e 0%, #0b3d2e 100%);color:#fff;padding:20px 24px;border-radius:12px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;border:1px solid #C59B27;">
        <div>
          <span style="background:#C59B27;color:#031812;padding:3px 10px;border-radius:9999px;font-size:0.75rem;font-weight:800;text-transform:uppercase;">Live Flight Radar</span>
          <h3 style="color:#fff;margin:6px 0 4px;font-size:1.15rem;">51+ Confirmed Group Departures Available Now</h3>
          <p style="color:#cbd5e1;font-size:0.88rem;margin:0;">Direct flights from Mumbai, Bengaluru, Delhi, Ahmedabad &amp; Lucknow with confirmed airline PNRs.</p>
        </div>
        <a href="/departures/" class="btn btn-primary" style="background:#C59B27;color:#031812;font-weight:700;white-space:nowrap;">View Live Departures &amp; Seats →</a>
      </div>`
    );
    // Add to footer
    pkgHtml = pkgHtml.replace(
      '<li><a href="/packages/">All Packages Catalog</a></li>',
      '<li><a href="/packages/">All Packages Catalog</a></li>\n          <li><a href="/departures/" style="color:#E2C77F;font-weight:700;">Live Flight Departures</a></li>'
    );
    fs.writeFileSync(pkgPath, pkgHtml, 'utf8');
    console.log('✅ packages/index.html updated with /departures/ banner.');
  }
}

// 3. Update umrah/index.html
const umrahPath = path.join(__dirname, '..', 'umrah', 'index.html');
if (fs.existsSync(umrahPath)) {
  let umrahHtml = fs.readFileSync(umrahPath, 'utf8');
  if (!umrahHtml.includes('/departures/')) {
    umrahHtml = umrahHtml.replace(
      '<li><a href="/packages/">All Packages Catalog</a></li>',
      '<li><a href="/packages/">All Packages Catalog</a></li>\n          <li><a href="/departures/" style="color:#E2C77F;font-weight:700;">Live Flight Departures</a></li>'
    );
    fs.writeFileSync(umrahPath, umrahHtml, 'utf8');
    console.log('✅ umrah/index.html updated with /departures/ link.');
  }
}

// 4. Update tools/index.html
const toolsPath = path.join(__dirname, '..', 'tools', 'index.html');
if (fs.existsSync(toolsPath)) {
  let toolsHtml = fs.readFileSync(toolsPath, 'utf8');
  if (!toolsHtml.includes('/departures/')) {
    toolsHtml = toolsHtml.replace(
      '<li><a href="/packages/">All Packages Catalog</a></li>',
      '<li><a href="/packages/">All Packages Catalog</a></li>\n          <li><a href="/departures/" style="color:#E2C77F;font-weight:700;">Live Flight Departures</a></li>'
    );
    fs.writeFileSync(toolsPath, toolsHtml, 'utf8');
    console.log('✅ tools/index.html updated with /departures/ link.');
  }
}
// 5. Update service-worker.js
const swPath = path.join(__dirname, '..', 'service-worker.js');
let swContent = fs.readFileSync(swPath, 'utf8');
if (!swContent.includes('/departures/')) {
  swContent = swContent.replace('nh-cache-v16', 'nh-cache-v17');
  swContent = swContent.replace(
    "'./assets/css/tools.css',",
    "'./assets/css/tools.css',\n  './departures/',\n  './departures/index.html',\n  './data/live-departures.json',"
  );
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('✅ service-worker.js updated to v17 with /departures/.');
}

// 6. Update tests/validate_all.js
const testPath = path.join(__dirname, '..', 'tests', 'validate_all.js');
let testContent = fs.readFileSync(testPath, 'utf8');
if (!testContent.includes('/departures/')) {
  testContent = testContent.replace(
    "'/packages/',",
    "'/packages/',\n  '/departures/',"
  );
  fs.writeFileSync(testPath, testContent, 'utf8');
  console.log('✅ tests/validate_all.js updated with /departures/.');
}
