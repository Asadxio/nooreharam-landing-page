const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove the 3 inline sections
const startSection = '<section class="section p-section-sm border-top-border" id="privacy-policy">';
const endSection = '</section>\n\n</main>';
const endSectionCRLF = '</section>\r\n\r\n</main>';

const idx1 = html.indexOf(startSection);
if (idx1 !== -1) {
  let idx2 = html.indexOf(endSection, idx1);
  let len = endSection.length;
  if (idx2 === -1) {
    idx2 = html.indexOf(endSectionCRLF, idx1);
    len = endSectionCRLF.length;
  }
  if (idx2 !== -1) {
    html = html.slice(0, idx1) + '</main>' + html.slice(idx2 + len);
    console.log('✅ Removed inline legal sections from index.html');
  }
}

// 2. Replace hash links with clean canonical URLs
html = html.replace(/href="#privacy-policy"/g, 'href="/privacy-policy/"');
html = html.replace(/href="#terms-conditions"/g, 'href="/terms-and-conditions/"');
html = html.replace(/href="#refund-policy"/g, 'href="/refund-and-cancellation-policy/"');

// Add Payment Policy link to footer bottom links if not present
if (!html.includes('/payment-policy/')) {
  html = html.replace(
    '<a href="/refund-and-cancellation-policy/" class="footer-legal-link">Refund Policy</a>',
    '<a href="/refund-and-cancellation-policy/" class="footer-legal-link">Refund Policy</a>\n        <a href="/payment-policy/" class="footer-legal-link">Payment Policy</a>'
  );
}

// 3. Add Cookie / DPDP Consent Banner before </body>
const cookieBannerHtml = `
<!-- ── DPDP ACT 2023 & COOKIE CONSENT BANNER ── -->
<div id="nhConsentBanner" class="consent-banner" role="region" aria-label="Privacy and Cookie Consent" style="display:none;position:fixed;bottom:20px;right:20px;max-width:420px;background:#06281e;color:#fff;border:1.5px solid #C59B27;border-radius:12px;padding:18px 20px;box-shadow:0 12px 36px rgba(0,0,0,0.35);z-index:9999;">
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <span style="font-size:1.4rem;">🍪</span>
    <div>
      <h4 style="font-size:0.95rem;color:#E2C77F;margin:0 0 6px;">Your Privacy &amp; Consent</h4>
      <p style="font-size:0.82rem;color:#cbd5e1;line-height:1.5;margin:0 0 12px;">
        We use essential cookies and anonymous analytics to improve your pilgrimage booking experience in compliance with India's DPDP Act 2023. By continuing, you agree to our <a href="/privacy-policy/" style="color:#E2C77F;text-decoration:underline;">Privacy Policy</a>.
      </p>
      <div style="display:flex;gap:10px;">
        <button id="acceptConsentBtn" class="btn btn-primary btn-sm" style="background:#C59B27;color:#031812;font-weight:700;padding:6px 14px;border:none;border-radius:6px;cursor:pointer;">
          Accept
        </button>
        <button id="declineConsentBtn" class="btn btn-outline btn-sm" style="background:transparent;color:#cbd5e1;border:1px solid #64748b;padding:6px 12px;border-radius:6px;cursor:pointer;">
          Essential Only
        </button>
      </div>
    </div>
  </div>
</div>

<script>
  (function() {
    try {
      var consent = localStorage.getItem('nh_cookie_consent');
      var banner = document.getElementById('nhConsentBanner');
      if (!consent && banner) {
        banner.style.display = 'block';
      }
      var acceptBtn = document.getElementById('acceptConsentBtn');
      var declineBtn = document.getElementById('declineConsentBtn');
      if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
          localStorage.setItem('nh_cookie_consent', 'accepted');
          banner.style.display = 'none';
        });
      }
      if (declineBtn) {
        declineBtn.addEventListener('click', function() {
          localStorage.setItem('nh_cookie_consent', 'essential');
          banner.style.display = 'none';
        });
      }
    } catch(e) {}
  })();
</script>
`;

if (!html.includes('id="nhConsentBanner"')) {
  html = html.replace('</body>', cookieBannerHtml + '\n</body>');
  console.log('✅ Added DPDP Act 2023 consent banner to index.html');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ index.html legal links and banner updated.');
