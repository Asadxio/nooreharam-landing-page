const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace Batch 1 (stale past date 12 Nov 2026)
const oldBatch1 = `<h3 class="batch-title">15-Day Economy Executive</h3>
          <div class="batch-meta-row">
            <span>✈️ <strong>Flight:</strong> Saudia Direct (Return)</span>
            <span>📅 <strong>Dates:</strong> 12 Nov 2026 – 26 Nov 2026</span>`;

const newBatch1 = `<h3 class="batch-title">15-Day Economy Executive</h3>
          <div class="batch-meta-row">
            <span>✈️ <strong>Flight:</strong> Air India Direct (BOM-JED)</span>
            <span>📅 <strong>Dates:</strong> 30 Nov 2026 – 15 Dec 2026</span>`;

html = html.replace(oldBatch1, newBatch1);
html = html.replace('Nov%2012', 'Nov%2030');

// Replace Batch 2 dates
html = html.replace('26 Nov 2026 – 10 Dec 2026', '08 Dec 2026 – 22 Dec 2026');
html = html.replace('Nov%2026', 'Dec%2008');

// Replace Batch 3 dates
html = html.replace('08 Dec 2026 – 22 Dec 2026', '18 Dec 2026 – 02 Jan 2027');
html = html.replace('Dec%2008', 'Dec%2018');

// Add LAST UPDATED badge under subtitle
const subtitleTarget = `<p class="section-subtitle">Transparent seat counts across our Mumbai, Bangalore, and North Karnataka direct departure groups.</p>`;
const subtitleRepl = `<p class="section-subtitle">Transparent seat counts across our Mumbai, Bangalore, and North Karnataka direct departure groups.</p>
      <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(6,40,30,0.06);border:1px solid rgba(6,40,30,0.12);padding:4px 14px;border-radius:9999px;font-size:0.8rem;color:#06281e;margin-top:10px;font-weight:600;">
        <span>🕒 LAST UPDATED: 24 November 2026</span>
        <span>•</span>
        <span style="color:#166534;">Active Winter 2026–27 Schedule</span>
      </div>`;

if (!html.includes('LAST UPDATED: 24 November 2026')) {
  html = html.replace(subtitleTarget, subtitleRepl);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ index.html batch cards updated with upcoming dates and LAST UPDATED stamp.');
