/**
 * Generates official, indexable legal compliance pages for NOOR-E-HARAM:
 * 1. /privacy-policy/
 * 2. /terms-and-conditions/
 * 3. /refund-and-cancellation-policy/
 * 4. /payment-policy/
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const headerPartial = (activeTitle, canonicalUrl) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activeTitle} | NOOR-E-HARAM</title>
  <meta name="description" content="Official ${activeTitle} for NOOR-E-HARAM Tours &amp; Travels (Hubli, Karnataka). Compliance, transparent terms, pilgrim privacy, and booking security.">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:title" content="${activeTitle} | NOOR-E-HARAM">
  <meta property="og:description" content="Official compliance and policy documentation for NOOR-E-HARAM Tours &amp; Travels.">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4SZRN40VQ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4SZRN40VQ2');
  </script>

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">

  <style>
    .legal-hero {
      background: linear-gradient(135deg, #031812 0%, #06281e 50%, #0a3d2e 100%);
      color: #fff;
      padding: 120px 0 50px;
      text-align: center;
    }
    .legal-content-wrap {
      background: #fff;
      padding: 60px 0 100px;
    }
    .legal-article {
      max-width: 860px;
      margin: 0 auto;
      color: #334155;
      font-size: 1rem;
      line-height: 1.8;
    }
    .legal-article h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.85rem;
      color: #06281e;
      margin: 40px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid #e2e8f0;
    }
    .legal-article h3 {
      font-size: 1.25rem;
      color: #0f172a;
      margin: 24px 0 12px;
    }
    .legal-article p {
      margin-bottom: 18px;
    }
    .legal-article ul, .legal-article ol {
      margin-bottom: 24px;
      padding-left: 24px;
    }
    .legal-article li {
      margin-bottom: 8px;
    }
    .legal-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #C59B27;
      padding: 20px 24px;
      border-radius: 8px;
      margin: 28px 0;
    }
    .legal-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    .legal-table th, .legal-table td {
      border: 1px solid #cbd5e1;
      padding: 12px 16px;
      text-align: left;
      font-size: 0.95rem;
    }
    .legal-table th {
      background: #06281e;
      color: #E2C77F;
      font-weight: 700;
    }
    .legal-table tr:nth-child(even) {
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <!-- Navigation Header -->
  <header class="site-header" id="site-header">
    <div class="container header-container">
      <a href="/" class="brand-logo" aria-label="NOOR-E-HARAM Home">
        <span class="logo-mark">نور</span>
        <span class="logo-text">NOOR-E-HARAM</span>
      </a>

      <nav class="nav-desktop" aria-label="Primary Navigation">
        <a href="/" class="nav-link">Home</a>
        <a href="/packages/" class="nav-link">Packages</a>
        <a href="/departures/" class="nav-link">Live Departures</a>
        <a href="/umrah/" class="nav-link">Umrah</a>
        <a href="/hajj/" class="nav-link">Hajj</a>
        <a href="/ziyarat/41-ziyarat-places/" class="nav-link">41 Ziyarat</a>
        <a href="/trust/" class="nav-link">Trust</a>
      </nav>

      <div class="header-actions">
        <a href="https://wa.me/919986925592" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          WhatsApp Us
        </a>
      </div>
    </div>
  </header>`;

const footerPartial = `  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container footer-container">
      <div class="footer-brand">
        <span class="logo-text" style="color:#E2C77F;font-size:1.4rem;font-weight:800;">NOOR-E-HARAM</span>
        <p style="color:#94a3b8;font-size:0.85rem;margin-top:8px;">
          Government recognized &amp; trusted Hajj &amp; Umrah tour operator serving pilgrims across North Karnataka, Mumbai, and Bangalore.
        </p>
      </div>
      <div class="footer-links">
        <h4 style="color:#fff;font-size:0.95rem;margin-bottom:10px;">Legal &amp; Compliance</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;font-size:0.85rem;">
          <li><a href="/privacy-policy/" style="color:#cbd5e1;">Privacy Policy</a></li>
          <li><a href="/terms-and-conditions/" style="color:#cbd5e1;">Terms &amp; Conditions</a></li>
          <li><a href="/refund-and-cancellation-policy/" style="color:#cbd5e1;">Refund &amp; Cancellation Policy</a></li>
          <li><a href="/payment-policy/" style="color:#cbd5e1;">Payment Policy</a></li>
          <li><a href="/trust/" style="color:#cbd5e1;">Trust &amp; Verification</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4 style="color:#fff;font-size:0.95rem;margin-bottom:10px;">Contact &amp; Grievances</h4>
        <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">
          Darga Complex, Hubli, Karnataka, India<br>
          Official Email: <a href="mailto:info@nooreharam.com" style="color:#E2C77F;">info@nooreharam.com</a><br>
          Grievance Officer: [[GRIEVANCE_OFFICER]]<br>
          WhatsApp Support: <a href="https://wa.me/919986925592" style="color:#E2C77F;">+91 99869 25592</a>
        </p>
      </div>
    </div>
  </footer>
</body>
</html>`;

// 1. Privacy Policy Page
const privacyHtml = `${headerPartial('Privacy Policy', 'https://nooreharam.com/privacy-policy/')}
  <main id="main-content">
    <section class="legal-hero">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Compliance &amp; Data Protection</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Privacy Policy</h1>
        <p style="color:#cbd5e1;font-size:0.95rem;margin-top:10px;">Aligned with the Digital Personal Data Protection (DPDP) Act 2023 &amp; Indian Information Technology Rules</p>
        <p style="color:#94a3b8;font-size:0.8rem;margin-top:6px;">Last Reviewed: 24 November 2026</p>
      </div>
    </section>

    <section class="legal-content-wrap">
      <div class="container">
        <article class="legal-article">
          <div class="legal-box" style="border-left: 4px solid #eab308; background: #fefce8; padding: 20px 24px; border-radius: 8px;">
            <strong style="color: #854d0e; font-size: 1.05rem;">Status: Deduction Slabs Pending Official Management Confirmation</strong>
            <p style="margin: 8px 0 0; color: #713f12; font-size: 0.95rem; line-height: 1.6;">
              Exact percentage deduction slabs based on days before departure are currently <strong>To be confirmed by management ([[CANCELLATION_SLAB]])</strong>. 
              Because third-party supplier terms (airline group charter contracts and Saudi hotel room blocks) vary by season—particularly during peak Ramadan and Winter periods—cancellation deductions for each pilgrim are strictly governed by the specific terms stated on your individual booking invoice until standardized schedule slabs are officially ratified.
            </p>
          </div>

          <h2>1. Cancellation Deduction Schedule (Slabs)</h2>
          <p>Written cancellation must be submitted to our Hubli office or via official email (<a href="mailto:info@nooreharam.com">info@nooreharam.com</a>). The table below reflects the placeholder structure pending final percentage ratification by management:</p>

          <table class="legal-table">
            <thead>
              <tr>
                <th>Cancellation Notice Window</th>
                <th>Deduction / Retention Amount</th>
                <th>Estimated Refund Eligibility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>[[DAYS_WINDOW_1]]</strong> (e.g. 45+ days prior)</td>
                <td>[[DEDUCTION_SLAB_1 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_1 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>[[DAYS_WINDOW_2]]</strong> (e.g. 30–44 days prior)</td>
                <td>[[DEDUCTION_SLAB_2 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_2 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>[[DAYS_WINDOW_3]]</strong> (e.g. 15–29 days prior)</td>
                <td>[[DEDUCTION_SLAB_3 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_3 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>[[DAYS_WINDOW_4]]</strong> (e.g. under 14 days prior)</td>
                <td>[[DEDUCTION_SLAB_4 - To be confirmed by owner]]</td>
                <td>[[REFUND_ELIGIBILITY_4 - To be confirmed by owner]]</td>
              </tr>
              <tr>
                <td><strong>Same-Day / No-Show at Airport</strong></td>
                <td>Non-refundable (Subject to airline &amp; hotel contract forfeitures)</td>
                <td>No refund available</td>
              </tr>
            </tbody>
          </table>

          <h2>2. Non-Refundable Statutory &amp; Supplier Components</h2>
          <p>Irrespective of cancellation timing, the following direct costs incurred with third parties cannot be recovered once issued:</p>
          <ul>
            <li><strong>Saudi Ministry Visa Fees &amp; Mandatory Health Insurance:</strong> Once issued on the official Saudi portal, electronic visa fees are non-refundable per Saudi government regulations.</li>
            <li><strong>Non-Refundable Airline Group PNRs:</strong> Group booking flight tickets are governed by airline charter cancellation rules.</li>
            <li><strong>Bank &amp; Payment Gateway Charges:</strong> Transaction fees, GST, and foreign exchange conversion charges.</li>
          </ul>

          <h2>3. Refund Processing Timeline</h2>
          <p>Approved refunds are processed via NEFT/RTGS bank transfer to the pilgrim's verified bank account within the management-confirmed timeline ([[REFUND_PROCESSING_DAYS]]) following formal audit of unutilized supplier funds. Cash refunds are strictly prohibited under Indian tax and banking laws.</p>

          <h2>4. How to Submit a Cancellation Request</h2>
          <p>To request a cancellation, please email our office at <a href="mailto:info@nooreharam.com" style="color:#06281e;font-weight:700;">info@nooreharam.com</a> with the subject line: <code>Cancellation Request - [Booking ID / PNR] - [Pilgrim Name]</code>, attaching the original booking invoice and cancelled cheque / bank account details.</p>
        </article>
      </div>
    </section>
  </main>
${footerPartial}`;

// 4. Payment Policy Page
const paymentHtml = `${headerPartial('Payment Policy', 'https://nooreharam.com/payment-policy/')}
  <main id="main-content">
    <section class="legal-hero">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Financial Security &amp; Assurance</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Payment Policy</h1>
        <p style="color:#cbd5e1;font-size:0.95rem;margin-top:10px;">Official payment schedules, company bank account verification, and fraud prevention</p>
        <p style="color:#94a3b8;font-size:0.8rem;margin-top:6px;">Last Reviewed: 24 November 2026</p>
      </div>
    </section>

    <section class="legal-content-wrap">
      <div class="container">
        <article class="legal-article">
          <div class="legal-box" style="border-left-color:#dc2626;background:#fef2f2;">
            <strong style="color:#991b1b;">⚠️ Critical Security Warning — Avoid Scams:</strong>
            <p style="color:#991b1b;margin-top:6px;margin-bottom:0;">NOOR-E-HARAM never requests payments into personal savings accounts, unauthorized UPI IDs, or via unverified WhatsApp numbers. Always remit payments exclusively to our verified official company bank account. Demand an official, numbered stamped receipt for every transaction.</p>
          </div>

          <h2>1. Payment Schedule &amp; Milestones</h2>
          <p>To secure guaranteed airline seats, visa quotas, and hotel allotments, payments must follow our two-stage structure:</p>
          <ul>
            <li><strong>Stage 1 (At Booking):</strong> <strong>50% advance payment</strong> along with original passports and passport photographs to initiate visa processing and lock air ticket PNRs.</li>
            <li><strong>Stage 2 (Final Settlement):</strong> <strong>Remaining 50% balance</strong> must be cleared <strong>7 to 10 days prior to departure</strong>. Travel vouchers, flight tickets, and visa prints are issued upon complete balance reconciliation.</li>
          </ul>

          <h2>2. Approved Payment Modes</h2>
          <p>We accept payments through documented, secure banking channels only:</p>
          <ul>
            <li><strong>NEFT / RTGS / IMPS Direct Bank Transfer:</strong> Direct remittance to our designated corporate current account.</li>
            <li><strong>Official Company UPI:</strong> Scannable directly at our Hubli head office or on our official invoices.</li>
            <li><strong>Account Payee Cheque / Demand Draft:</strong> Drawn in favor of our official entity name: <code>[[LEGAL_ENTITY_NAME]]</code>.</li>
          </ul>

          <h2>3. Official Company Account Details</h2>
          <div class="legal-box">
            <h3 style="margin-top:0;color:#06281e;">Official Bank Details for Remittance</h3>
            <p style="margin-bottom:6px;"><strong>Beneficiary Name:</strong> [[LEGAL_ENTITY_NAME]] (NOOR-E-HARAM)</p>
            <p style="margin-bottom:6px;"><strong>Bank Name:</strong> [[PAYMENT_DETAILS - Bank Name]]</p>
            <p style="margin-bottom:6px;"><strong>Account Number:</strong> [[PAYMENT_DETAILS - Account Number]]</p>
            <p style="margin-bottom:6px;"><strong>IFSC Code:</strong> [[PAYMENT_DETAILS - IFSC]]</p>
            <p style="margin-bottom:6px;"><strong>Branch:</strong> Hubli, Karnataka</p>
            <p style="margin-bottom:0;"><strong>Official UPI VPA:</strong> [[PAYMENT_DETAILS - UPI ID]]</p>
          </div>

          <h2>4. Official Receipt Guarantee</h2>
          <p>Every transaction made to NOOR-E-HARAM is acknowledged with a digital or physical official stamped receipt containing our registration number, pilgrim name, package tier, and remaining balance. If you do not receive an official receipt within 24 hours of payment, please immediately contact our Director at <a href="mailto:info@nooreharam.com" style="color:#06281e;font-weight:700;">info@nooreharam.com</a> or <a href="tel:+919986925592" style="color:#06281e;font-weight:700;">+91 99869 25592</a>.</p>
        </article>
      </div>
    </section>
  </main>
${footerPartial}`;

// Write all pages
const pages = [
  { dir: 'privacy-policy', html: privacyHtml },
  { dir: 'terms-and-conditions', html: termsHtml },
  { dir: 'refund-and-cancellation-policy', html: refundHtml },
  { dir: 'payment-policy', html: paymentHtml }
];

pages.forEach(({ dir, html }) => {
  const targetDir = path.join(rootDir, dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`✅ Generated /${dir}/index.html`);
});
