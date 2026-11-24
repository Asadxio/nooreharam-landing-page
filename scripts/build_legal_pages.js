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
          <div class="legal-box">
            <strong>Key Summary:</strong> NOOR-E-HARAM ("we", "our", "us") values the sanctity and privacy of every pilgrim. We collect personal data strictly to issue Saudi Umrah/Hajj visas, book airline tickets, reserve hotel accommodation in Makkah &amp; Madinah, and coordinate ground transport. We never sell or monetize your personal information.
          </div>

          <h2>1. Information We Collect</h2>
          <p>When you inquire, register, or book an Umrah or Hajj pilgrimage through our website, office, or official communication channels, we may collect the following categories of information:</p>
          <ul>
            <li><strong>Identity &amp; Contact Information:</strong> Full legal name (as per passport), phone number, email address, residential address, emergency contact details, and relation.</li>
            <li><strong>Travel &amp; Visa Documentation:</strong> Passport copies (first and last page), national ID, passport-size photographs, Mahram relationship documents (where applicable under Saudi law), and polio/meningitis ACWY vaccination records.</li>
            <li><strong>Payment Information:</strong> Bank transaction reference numbers (UTR), payment mode, and receipt copies. <em>(Note: We do not store credit card or debit card numbers on our servers; payments are processed directly through licensed banking channels).</em></li>
            <li><strong>Technical &amp; Analytics Data:</strong> IP address, browser type, device information, and anonymous website engagement metrics collected via Google Analytics 4 (GA4).</li>
          </ul>

          <h2>2. Purpose &amp; Legal Basis of Processing</h2>
          <p>Under the DPDP Act 2023, your personal data is collected and processed solely for specified, legitimate pilgrimage purposes:</p>
          <ul>
            <li>To register and submit your electronic Umrah or Hajj visa applications via the Saudi Ministry of Hajj &amp; Umrah / Nusuk portals.</li>
            <li>To book confirmed PNR flight tickets with partner airlines (Saudia, IndiGo, Air India, etc.).</li>
            <li>To register hotel room allocations in Makkah and Madinah compliant with municipal safety standards.</li>
            <li>To coordinate group transfers, medical emergencies, and on-ground logistics.</li>
            <li>To send itinerary confirmations, departure schedules, and pre-departure pilgrim orientation guidelines.</li>
          </ul>

          <h2>3. Data Sharing &amp; Cross-Border Transfers</h2>
          <p>To fulfill your pilgrimage booking, your data is shared strictly on a need-to-know basis with authorized entities:</p>
          <ul>
            <li><strong>Saudi Regulatory Authorities:</strong> Ministry of Hajj &amp; Umrah, Ministry of Foreign Affairs (KSA), and Nusuk portal.</li>
            <li><strong>Airlines &amp; GDS Providers:</strong> For issuance of non-transferable international flight tickets.</li>
            <li><strong>Licensed Accommodation &amp; Transport Providers:</strong> Hotels in Makkah/Madinah and authorized United Bus transport operators.</li>
          </ul>
          <p>We do not share, lease, or sell your personal data to marketing agencies or third-party advertisers under any circumstances.</p>

          <h2>4. Data Retention &amp; Security Measures</h2>
          <p>We retain your passport and booking data for the statutory period required under Indian travel regulations and tax audits, or until the pilgrimage tour is completed. Physical documentation is stored securely in locked archives, and digital records are protected by encryption, SSL/TLS, and restricted access controls.</p>

          <h2>5. Pilgrim Rights Under DPDP Act 2023</h2>
          <p>As a data principal, you have the following legal rights:</p>
          <ul>
            <li><strong>Right to Access:</strong> You may request a summary of your personal data processed by us.</li>
            <li><strong>Right to Correction &amp; Erasure:</strong> You may request correction of inaccurate data or deletion of your records (subject to regulatory visa and accounting obligations).</li>
            <li><strong>Right to Withdraw Consent:</strong> You may withdraw your consent for non-essential communications at any time.</li>
          </ul>

          <h2>6. Grievance Redressal Officer</h2>
          <p>In compliance with the DPDP Act 2023 and the Consumer Protection (E-Commerce) Rules 2020, you may direct any privacy concerns, data rectification requests, or grievances to our designated Grievance Officer:</p>
          <div class="legal-box">
            <strong>Grievance Officer:</strong> [[GRIEVANCE_OFFICER]]<br>
            <strong>Official Entity:</strong> [[LEGAL_ENTITY_NAME]] (NOOR-E-HARAM Tours &amp; Travels)<br>
            <strong>Registered Address:</strong> Darga Complex, Behind Barnabas Hall, Mantoor Road, Hubli - 580020, Karnataka, India<br>
            <strong>Official Email:</strong> <a href="mailto:info@nooreharam.com" style="color:#06281e;font-weight:700;">info@nooreharam.com</a><br>
            <strong>Phone:</strong> +91 99869 25592 (Mon–Sat, 10:00 AM – 6:00 PM IST)
          </div>
        </article>
      </div>
    </section>
  </main>
${footerPartial}`;

// 2. Terms and Conditions Page
const termsHtml = `${headerPartial('Terms and Conditions', 'https://nooreharam.com/terms-and-conditions/')}
  <main id="main-content">
    <section class="legal-hero">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Agreement of Service</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Terms &amp; Conditions</h1>
        <p style="color:#cbd5e1;font-size:0.95rem;margin-top:10px;">General Pilgrim Contract &amp; Service Guidelines</p>
        <p style="color:#94a3b8;font-size:0.8rem;margin-top:6px;">Last Reviewed: 24 November 2026</p>
      </div>
    </section>

    <section class="legal-content-wrap">
      <div class="container">
        <article class="legal-article">
          <div class="legal-box">
            <strong>Important Notice:</strong> By booking any Hajj, Umrah, or Ziyarat tour package with NOOR-E-HARAM, the pilgrim ("traveler") acknowledges and accepts these binding Terms and Conditions. Please review them carefully before remitting any advance payment.
          </div>

          <h2>1. Scope of Service</h2>
          <p>NOOR-E-HARAM operates as an authorized Islamic pilgrimage tour organizer, facilitator, and coordinator. Our services include processing Saudi Umrah visas, reserving airline seats on scheduled flights, arranging hotel bookings in the holy cities of Makkah al-Mukarramah and Madinah al-Munawwarah, coordinating air-conditioned coach transfers, providing daily catering, and offering religious guidance through certified scholars.</p>

          <h2>2. Booking Confirmation &amp; Fixed Price Guarantee</h2>
          <ul>
            <li>Display package rates on our website are starting prices based on standard room sharing tiers (Quad/Triple/Double).</li>
            <li><strong>Fixed Price Guarantee:</strong> Once a pilgrim has submitted required documents and paid the designated booking deposit, the package cost is confirmed in writing on an official stamped invoice. This price is locked and will not be altered unless the pilgrim requests post-booking itinerary modifications.</li>
            <li>Seat confirmation is subject to passport validity (minimum 6 months from travel date) and Saudi visa approval.</li>
          </ul>

          <h2>3. Visa Approval &amp; Saudi Ministry Regulations</h2>
          <p>Visa issuance is governed solely by the Ministry of Foreign Affairs (KSA) and the Saudi Ministry of Hajj &amp; Umrah. While NOOR-E-HARAM maintains high submission success through verified channels, visa issuance remains the sovereign prerogative of the Kingdom of Saudi Arabia. We are not liable for delays, rejections, or policy amendments enacted by the Saudi Government.</p>

          <h2>4. Flight Schedules &amp; Airline Policies</h2>
          <ul>
            <li>Group flight tickets (Saudia, IndiGo, Air India, etc.) are issued under non-refundable group blocking contracts.</li>
            <li>Airlines reserve the right to reschedule departure times, terminals, or flight numbers due to air traffic control or operational reasons. NOOR-E-HARAM will coordinate and assist pilgrims in all instances of airline schedule revisions.</li>
            <li>Baggage limits (typically 20–40KG check-in + 7KG cabin + 5L Zamzam) must be strictly adhered to by the pilgrim. Airline excess baggage charges are the sole responsibility of the passenger.</li>
          </ul>

          <h2>5. Hotel Accommodation &amp; Distances</h2>
          <p>Hotel check-in and check-out timings in Makkah and Madinah adhere to Saudi hospitality standards (typically Check-in: 4:00 PM; Check-out: 12:00 PM). Stated distances to the courtyard (e.g., 50m, 250m, 750m) represent verified pedestrian walking routes from the hotel lobby to the outer marble courtyard of the Haramain.</p>

          <h2>6. Pilgrim Conduct &amp; Adherence to Local Law</h2>
          <p>Pilgrims are expected to maintain Islamic decorum, observe group discipline, and abide by the laws and customs of the Kingdom of Saudi Arabia. The company cannot be held responsible for any legal penalties, fines, or confiscations arising from individual violations of Saudi customs, security, or immigration rules.</p>
        </article>
      </div>
    </section>
  </main>
${footerPartial}`;

// 3. Refund and Cancellation Policy Page
const refundHtml = `${headerPartial('Refund and Cancellation Policy', 'https://nooreharam.com/refund-and-cancellation-policy/')}
  <main id="main-content">
    <section class="legal-hero">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Transparent Policy</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Refund &amp; Cancellation Policy</h1>
        <p style="color:#cbd5e1;font-size:0.95rem;margin-top:10px;">Clear deduction slabs, non-refundable components, and application process</p>
        <p style="color:#94a3b8;font-size:0.8rem;margin-top:6px;">Last Reviewed: 24 November 2026</p>
      </div>
    </section>

    <section class="legal-content-wrap">
      <div class="container">
        <article class="legal-article">
          <div class="legal-box">
            <strong>Fair &amp; Transparent Policy:</strong> We understand that unforeseen medical emergencies or family circumstances may force pilgrims to cancel their travel. Because group pilgrimage packages involve non-recoverable financial commitments (group air tickets, visa fees, hotel block reservations in Saudi Arabia), cancellations are subject to the standard deduction schedule below.
          </div>

          <h2>1. Cancellation Deduction Schedule (Slabs)</h2>
          <p>The refund amount is calculated based on the date written cancellation is received at our Hubli office or via official email (<a href="mailto:info@nooreharam.com">info@nooreharam.com</a>) relative to the flight departure date:</p>

          <table class="legal-table">
            <thead>
              <tr>
                <th>Cancellation Notice Period</th>
                <th>Deduction / Retention Amount</th>
                <th>Estimated Refund Eligibility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>45+ Days</strong> before departure</td>
                <td>Non-refundable Registration Fee (₹5,000 per person) + Visa costs (if issued)</td>
                <td>Balance advance refunded in full</td>
              </tr>
              <tr>
                <td><strong>30 to 44 Days</strong> before departure</td>
                <td>25% of total package cost + Actual visa &amp; airline issuance penalties</td>
                <td>Remaining balance refunded</td>
              </tr>
              <tr>
                <td><strong>15 to 29 Days</strong> before departure</td>
                <td>50% of total package cost (Hotel room non-refundable block retention)</td>
                <td>Remaining balance refunded</td>
              </tr>
              <tr>
                <td><strong>08 to 14 Days</strong> before departure</td>
                <td>75% of total package cost</td>
                <td>25% of package cost refunded</td>
              </tr>
              <tr>
                <td><strong>0 to 07 Days</strong> or No-Show at Airport</td>
                <td>100% of total package cost (Non-refundable)</td>
                <td>No refund available</td>
              </tr>
            </tbody>
          </table>
          <p class="fs-14 text-mid"><em>Note: If the owner's operational contract mandates specific variance, the final deduction adheres to [[CANCELLATION_SLAB]].</em></p>

          <h2>2. Strictly Non-Refundable Components</h2>
          <p>Under all circumstances, the following fees incurred on behalf of the pilgrim cannot be refunded once processed:</p>
          <ul>
            <li><strong>Saudi Ministry Visa Fees &amp; Mandatory Health Insurance:</strong> Once approved on the electronic portal, Saudi visa fees are 100% non-refundable by the Ministry.</li>
            <li><strong>Group PNR Flight Tickets:</strong> Group block airfares are issued under strict airline charter/group contracts and do not permit individual refunds.</li>
            <li><strong>Bank Transaction &amp; Processing Fees:</strong> Statutory GST, merchant interchange fees, and international remittance bank charges.</li>
          </ul>

          <h2>3. Refund Processing Timeline</h2>
          <p>Approved refunds are processed via direct NEFT/RTGS bank transfer to the pilgrim's verified bank account within <strong>14 to 21 working days</strong> following formal audit and receipt of cancellation approval. Cash refunds are strictly prohibited under anti-money laundering and income tax regulations.</p>

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
