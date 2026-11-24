/**
 * Builds the 4 new dedicated pages:
 * 1. /about/
 * 2. /branches/
 * 3. /contact/
 * 4. /faq/
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const baseNav = (activePage) => `
  <header class="site-header" id="site-header">
    <div class="container header-container">
      <a href="/" class="brand-logo" aria-label="NOOR-E-HARAM Home">
        <span class="logo-mark">نور</span>
        <span class="logo-text">NOOR-E-HARAM</span>
      </a>

      <nav class="nav-desktop" aria-label="Primary Navigation">
        <a href="/" class="nav-link">Home</a>
        <a href="/about/" class="nav-link ${activePage === 'about' ? 'active' : ''}">About</a>
        <a href="/packages/" class="nav-link">Packages</a>
        <a href="/departures/" class="nav-link">Live Departures</a>
        <a href="/branches/" class="nav-link ${activePage === 'branches' ? 'active' : ''}">Branches</a>
        <a href="/trust/" class="nav-link ${activePage === 'trust' ? 'active' : ''}">Trust</a>
        <a href="/faq/" class="nav-link ${activePage === 'faq' ? 'active' : ''}">FAQ</a>
        <a href="/contact/" class="nav-link ${activePage === 'contact' ? 'active' : ''}">Contact</a>
      </nav>

      <div class="header-actions">
        <a href="https://wa.me/919986925592" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          WhatsApp Us
        </a>
      </div>
    </div>
  </header>`;

const baseFooter = `
  <footer class="site-footer">
    <div class="container footer-container">
      <div class="footer-brand">
        <span class="logo-text" style="color:#E2C77F;font-size:1.4rem;font-weight:800;">NOOR-E-HARAM</span>
        <p style="color:#94a3b8;font-size:0.85rem;margin-top:8px;">
          Government recognized &amp; trusted Hajj &amp; Umrah tour operator serving pilgrims across North Karnataka, Mumbai, and Bangalore since 2016.
        </p>
      </div>
      <div class="footer-links">
        <h4 style="color:#fff;font-size:0.95rem;margin-bottom:10px;">Quick Links</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;font-size:0.85rem;">
          <li><a href="/" style="color:#cbd5e1;">Home</a></li>
          <li><a href="/about/" style="color:#cbd5e1;">About Our Journey</a></li>
          <li><a href="/packages/" style="color:#cbd5e1;">Packages</a></li>
          <li><a href="/departures/" style="color:#cbd5e1;">Live Flight Departures</a></li>
          <li><a href="/branches/" style="color:#cbd5e1;">Office Locations</a></li>
          <li><a href="/trust/" style="color:#cbd5e1;">Trust &amp; Verification</a></li>
          <li><a href="/faq/" style="color:#cbd5e1;">Pilgrim FAQ</a></li>
          <li><a href="/contact/" style="color:#cbd5e1;">Contact Us</a></li>
          <li><a href="/privacy-policy/" style="color:#cbd5e1;">Privacy Policy</a></li>
          <li><a href="/terms-and-conditions/" style="color:#cbd5e1;">Terms &amp; Conditions</a></li>
          <li><a href="/refund-and-cancellation-policy/" style="color:#cbd5e1;">Refund Policy</a></li>
          <li><a href="/payment-policy/" style="color:#cbd5e1;">Payment Policy</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4 style="color:#fff;font-size:0.95rem;margin-bottom:10px;">Head Office</h4>
        <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">
          Darga Complex, Behind Barnabas Hall, Mantoor Road, Hubli - 580020, Karnataka, India<br>
          Official Email: <a href="mailto:info@nooreharam.com" style="color:#E2C77F;">info@nooreharam.com</a><br>
          Direct Line: <a href="tel:+919986925592" style="color:#E2C77F;">+91 99869 25592</a>
        </p>
      </div>
    </div>
  </footer>
</body>
</html>`;

// 1. /about/
const aboutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About NOOR-E-HARAM | Ethical Hajj &amp; Umrah Operators India</title>
  <meta name="description" content="Discover the founding story of NOOR-E-HARAM Tours &amp; Travels (established 2016 in Hubli). Dedicated scholar leadership, honest hotel distances, and verified pilgrim service.">
  <link rel="canonical" href="https://nooreharam.com/about/">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4SZRN40VQ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4SZRN40VQ2');
  </script>

  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://nooreharam.com/about/#webpage",
        "url": "https://nooreharam.com/about/",
        "name": "About NOOR-E-HARAM | Ethical Hajj & Umrah Operators India",
        "description": "Founding story, core values, scholar leadership, and verified operations of NOOR-E-HARAM Tours & Travels since 2016."
      },
      {
        "@type": "Organization",
        "@id": "https://nooreharam.com/#organization",
        "name": "NOOR-E-HARAM Tours & Travels",
        "url": "https://nooreharam.com/",
        "foundingDate": "2016",
        "email": "info@nooreharam.com",
        "telephone": "+919986925592"
      }
    ]
  }
  </script>
</head>
<body>
  ${baseNav('about')}

  <main id="main-content">
    <section class="page-hero" style="background:linear-gradient(135deg, #031812 0%, #06281e 50%, #0a3d2e 100%);color:#fff;padding:120px 0 60px;text-align:center;">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Established in 2016 • Hubli, Karnataka</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">About NOOR-E-HARAM</h1>
        <p style="color:#cbd5e1;max-width:760px;margin:16px auto 0;font-size:1.05rem;line-height:1.7;">
          Founded on the uncompromising pillars of religious authenticity, operational honesty, and sincere Khidmat (service) to the guests of Allah (Dhuyuf ar-Rahman).
        </p>
      </div>
    </section>

    <section style="padding:70px 0;background:#fff;">
      <div class="container" style="max-width:860px;">
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin-bottom:16px;">Our Founding Story</h2>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          In 2016, <strong>NOOR-E-HARAM</strong> was established in Hubli, Karnataka, by Dr. Khwaja Ibrahim A Darga with a clear mission: to eliminate the deception, hidden charges, and exaggerated hotel claims that too often distress Indian pilgrims. Many families would embark on what should be the most spiritually transformative journey of their lives, only to be placed in remote hotels, stranded without guidance, or subjected to unexpected price hikes.
        </p>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          We built NOOR-E-HARAM on the principle that serving pilgrims is not a transactional business, but a sacred religious trust (Amanah). Starting from North Karnataka, our operations have steadily grown to escort thousands of pilgrims from Mumbai, Bangalore, Hubli, and regional towns across India.
        </p>

        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin:40px 0 16px;">Our Core Operating Values</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin:24px 0;">
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #C59B27;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">1. Truth in Distance</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">We never exaggerate walking distances. Every meter is measured to the courtyard entrance, ensuring elderly pilgrims are never misled.</p>
          </div>
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #06281e;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">2. Scholar Accompaniment</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">Every group is guided by certified Islamic scholars fluent in Urdu, English, and Kannada to conduct rituals strictly per Sunnah.</p>
          </div>
          <div style="background:#f8fafc;padding:20px;border-radius:10px;border-left:4px solid #166534;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">3. Fixed Price Guarantee</h3>
            <p style="font-size:0.9rem;color:#475569;margin:0;">Once confirmed in writing, your quote is fixed. We do not demand unexpected surcharges at the airport or hotel desk.</p>
          </div>
        </div>

        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#06281e;margin:40px 0 16px;">Leadership &amp; Scholar Guidance</h2>
        <p style="color:#334155;line-height:1.8;font-size:1.02rem;">
          Our tours are led under the direct supervision of Dr. Khwaja Ibrahim A Darga alongside senior scholars. From pre-departure Manasik orientation workshops in Hubli and Bangalore to the farewell Tawaf in Makkah, our scholars are present 24/7 on the ground to answer Fiqh queries, lead group Du'as, and attend to elderly pilgrims.
        </p>
      </div>
    </section>
  </main>
  ${baseFooter}`;

// 2. /branches/
const branchesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Branch Offices &amp; Locations Across India | NOOR-E-HARAM</title>
  <meta name="description" content="Visit NOOR-E-HARAM branch offices. Head office in Hubli, Karnataka, with regional consultation desks. Verified addresses, Google Maps directions, and phone numbers.">
  <link rel="canonical" href="https://nooreharam.com/branches/">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4SZRN40VQ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4SZRN40VQ2');
  </script>

  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "NOOR-E-HARAM Tours & Travels Head Office",
    "url": "https://nooreharam.com/branches/",
    "telephone": "+919986925592",
    "email": "info@nooreharam.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Behind Barnabas Hall, Mantoor Road",
      "addressLocality": "Hubli",
      "addressRegion": "Karnataka",
      "postalCode": "580020",
      "addressCountry": "IN"
    },
    "hasMap": "https://maps.google.com/?cid=9110780512781257798",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "10:00",
      "closes": "19:00"
    }
  }
  </script>
</head>
<body>
  ${baseNav('branches')}

  <main id="main-content">
    <section class="page-hero" style="background:linear-gradient(135deg, #031812 0%, #06281e 50%, #0a3d2e 100%);color:#fff;padding:120px 0 60px;text-align:center;">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Physical Branch Presence</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Our Branch Offices</h1>
        <p style="color:#cbd5e1;max-width:760px;margin:16px auto 0;font-size:1.05rem;">
          Visit our verified physical offices in Hubli and Karnataka for in-person passport submission, itinerary walk-throughs, and face-to-face pilgrimage consultations.
        </p>
      </div>
    </section>

    <section style="padding:60px 0;background:#f8fafc;">
      <div class="container" style="max-width:960px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;">
          <!-- Hubli Head Office -->
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.05);">
            <span style="background:#06281e;color:#E2C77F;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:999px;">HEADQUARTERS</span>
            <h2 style="font-size:1.35rem;color:#06281e;margin:12px 0 8px;">Hubli Head Office</h2>
            <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin-bottom:14px;">
              Darga Complex, Behind Barnabas Hall, Mantoor Road, Hubli - 580020, Karnataka, India
            </p>
            <div style="font-size:0.88rem;color:#334155;margin-bottom:16px;line-height:1.6;">
              <p style="margin:4px 0;">📞 <strong>Phone:</strong> <a href="tel:+919986925592" style="color:#06281e;">+91 99869 25592</a></p>
              <p style="margin:4px 0;">✉️ <strong>Email:</strong> <a href="mailto:info@nooreharam.com" style="color:#06281e;">info@nooreharam.com</a></p>
              <p style="margin:4px 0;">🕒 <strong>Hours:</strong> Mon – Sat: 10:00 AM – 7:00 PM</p>
            </div>
            <a href="https://maps.google.com/?cid=9110780512781257798" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="width:100%;text-align:center;display:block;">
              📍 Open Google Maps Directions
            </a>
          </div>

          <!-- Hangal & North Karnataka Desk -->
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.05);">
            <span style="background:#f1f5f9;color:#334155;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:999px;">REGIONAL DESK</span>
            <h2 style="font-size:1.35rem;color:#06281e;margin:12px 0 8px;">Hangal &amp; Haveri Desk</h2>
            <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin-bottom:14px;">
              Regional pilgrim assistance coordinator for Haveri, Hangal, Savanur &amp; Sirsi pilgrims.
            </p>
            <div style="font-size:0.88rem;color:#334155;margin-bottom:16px;line-height:1.6;">
              <p style="margin:4px 0;">📞 <strong>Coordinator:</strong> <a href="tel:+919986925592" style="color:#06281e;">+91 99869 25592</a></p>
              <p style="margin:4px 0;">✉️ <strong>Email:</strong> <a href="mailto:info@nooreharam.com" style="color:#06281e;">info@nooreharam.com</a></p>
              <p style="margin:4px 0;">🕒 <strong>Consultation:</strong> By Appointment</p>
            </div>
            <a href="https://wa.me/919986925592?text=Assalamu%20Alaikum%20Hangal%20Coordinator" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="width:100%;text-align:center;display:block;">
              💬 Chat with Hangal Coordinator
            </a>
          </div>
        </div>

        <div style="text-align:center;margin-top:40px;background:#fff;padding:24px;border-radius:12px;border:1px dashed #cbd5e1;">
          <p style="color:#475569;margin:0;font-size:0.95rem;">
            Looking for group departure assistance from <strong>Mumbai</strong> or <strong>Bangalore</strong>? 
            Our dedicated airport departure escorts assist all pilgrims at Terminal 2 (BOM) and Terminal 2 (BLR).
          </p>
        </div>
      </div>
    </section>
  </main>
  ${baseFooter}`;

// 3. /contact/
const contactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact NOOR-E-HARAM | 24/7 Pilgrim Support &amp; Bookings</title>
  <meta name="description" content="Get in touch with NOOR-E-HARAM Tours &amp; Travels. Official phone, WhatsApp hotline +91 99869 25592, official email info@nooreharam.com, and Hubli office location.">
  <link rel="canonical" href="https://nooreharam.com/contact/">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4SZRN40VQ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4SZRN40VQ2');
  </script>

  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">
</head>
<body>
  ${baseNav('contact')}

  <main id="main-content">
    <section class="page-hero" style="background:linear-gradient(135deg, #031812 0%, #06281e 50%, #0a3d2e 100%);color:#fff;padding:120px 0 60px;text-align:center;">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Direct Channels • Zero Middlemen</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Contact NOOR-E-HARAM</h1>
        <p style="color:#cbd5e1;max-width:760px;margin:16px auto 0;font-size:1.05rem;">
          Have questions about Umrah packages, visa documentation, or senior citizen wheelchair assistance? Our team is available 24/7 to guide you.
        </p>
      </div>
    </section>

    <section style="padding:60px 0;background:#fff;">
      <div class="container" style="max-width:960px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;">
          <!-- Contact Info -->
          <div>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#06281e;margin-top:0;">Official Direct Channels</h2>
            <p style="color:#475569;font-size:0.95rem;line-height:1.6;">
              To protect pilgrims from unverified agents, please verify that you are communicating only through our official contacts below:
            </p>

            <div style="margin:24px 0;display:flex;flex-direction:column;gap:16px;">
              <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:1.2rem;">📞</span>
                <div>
                  <strong style="color:#0f172a;display:block;">Central Helpline:</strong>
                  <a href="tel:+919986925592" style="color:#06281e;font-weight:700;font-size:1.05rem;">+91 99869 25592</a>
                </div>
              </div>

              <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:1.2rem;">💬</span>
                <div>
                  <strong style="color:#0f172a;display:block;">Official WhatsApp:</strong>
                  <a href="https://wa.me/919986925592" target="_blank" rel="noopener noreferrer" style="color:#166534;font-weight:700;">+91 99869 25592</a>
                </div>
              </div>

              <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:1.2rem;">✉️</span>
                <div>
                  <strong style="color:#0f172a;display:block;">Official Inquiries:</strong>
                  <a href="mailto:info@nooreharam.com" style="color:#06281e;font-weight:600;">info@nooreharam.com</a>
                </div>
              </div>

              <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:1.2rem;">🏢</span>
                <div>
                  <strong style="color:#0f172a;display:block;">Registered Office:</strong>
                  <p style="margin:0;color:#475569;font-size:0.9rem;">Darga Complex, Behind Barnabas Hall, Mantoor Road, Hubli - 580020, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Form -->
          <div style="background:#f8fafc;padding:30px;border-radius:12px;border:1px solid #e2e8f0;">
            <h3 style="color:#06281e;margin-top:0;margin-bottom:16px;font-size:1.2rem;">Send Direct Inquiry</h3>
            <form id="contactPageForm" onsubmit="event.preventDefault(); window.open('https://wa.me/919986925592?text=' + encodeURIComponent('Assalamu Alaikum! Name: ' + document.getElementById('cName').value + ' | City: ' + document.getElementById('cCity').value + ' | Msg: ' + document.getElementById('cMsg').value));">
              <div style="margin-bottom:14px;">
                <label for="cName" style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;">Full Name *</label>
                <input type="text" id="cName" required class="form-control" style="width:100%;padding:8px 12px;border-radius:6px;border:1px solid #cbd5e1;">
              </div>
              <div style="margin-bottom:14px;">
                <label for="cPhone" style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;">Mobile / WhatsApp Number (+91) *</label>
                <input type="tel" id="cPhone" pattern="[0-9]{10}" placeholder="10-digit mobile number" required class="form-control" style="width:100%;padding:8px 12px;border-radius:6px;border:1px solid #cbd5e1;">
              </div>
              <div style="margin-bottom:14px;">
                <label for="cCity" style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;">Your City *</label>
                <input type="text" id="cCity" placeholder="e.g. Hubli, Mumbai, Bangalore" required class="form-control" style="width:100%;padding:8px 12px;border-radius:6px;border:1px solid #cbd5e1;">
              </div>
              <div style="margin-bottom:18px;">
                <label for="cMsg" style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;">Message / Package Requirement</label>
                <textarea id="cMsg" rows="3" class="form-control" style="width:100%;padding:8px 12px;border-radius:6px;border:1px solid #cbd5e1;"></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;font-weight:700;">Submit via Official WhatsApp</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
  ${baseFooter}`;

// 4. /faq/
const faqHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frequently Asked Questions (FAQ) | NOOR-E-HARAM</title>
  <meta name="description" content="Comprehensive answers to 40+ questions on Umrah booking, visa rules, flight schedules, hotel proximity, wheelchair support, and refund policies.">
  <link rel="canonical" href="https://nooreharam.com/faq/">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4SZRN40VQ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4SZRN40VQ2');
  </script>

  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does NOOR-E-HARAM ensure pricing transparency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every booking includes a stamped written agreement detailing flights, hotel distances, 3-time meals, visas, and Ziyarat. We do not charge surprise airport or hotel fees."
        }
      },
      {
        "@type": "Question",
        "name": "Can women perform Umrah without a Mahram?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Saudi Ministry regulations allow women to perform Umrah in an organized group without a Mahram. Last verified: November 2026."
        }
      },
      {
        "@type": "Question",
        "name": "How is wheelchair assistance arranged for elderly parents?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We arrange dedicated wheelchair escorts (Khadim) in Mataf and Masa'a, ground-floor or elevator-accessible rooms, and flat walking paths to Haram."
        }
      }
    ]
  }
  </script>
</head>
<body>
  ${baseNav('faq')}

  <main id="main-content">
    <section class="page-hero" style="background:linear-gradient(135deg, #031812 0%, #06281e 50%, #0a3d2e 100%);color:#fff;padding:120px 0 60px;text-align:center;">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Pilgrim Knowledge Base</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Frequently Asked Questions</h1>
        <p style="color:#cbd5e1;max-width:760px;margin:16px auto 0;font-size:1.05rem;">
          Verified answers covering booking procedures, Saudi Ministry guidelines, hotel standards, and spiritual preparation.
        </p>
      </div>
    </section>

    <section style="padding:60px 0;background:#f8fafc;">
      <div class="container" style="max-width:860px;">
        <!-- Category: Booking & Payments -->
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#06281e;margin-bottom:16px;">1. Booking, Pricing &amp; Payments</h2>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:16px;">
          <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">Are package prices fixed or indicative?</h3>
          <p style="color:#475569;font-size:0.92rem;margin:0;line-height:1.6;">
            Starting prices are displayed per person based on Quad sharing. Once your advance is received and documents are submitted, your final invoice quote is locked in writing and will not change.
          </p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:16px;">
          <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">What is the payment milestone structure?</h3>
          <p style="color:#475569;font-size:0.92rem;margin:0;line-height:1.6;">
            We require 50% advance at booking to lock air tickets and initiate visa processing. The remaining 50% balance must be settled 7–10 days before flight departure.
          </p>
        </div>

        <!-- Category: Visas & Rules -->
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#06281e;margin:36px 0 16px;">2. Visa &amp; Saudi Regulations</h2>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:16px;">
          <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">Can women travel for Umrah without a Mahram?</h3>
          <p style="color:#475569;font-size:0.92rem;margin:0;line-height:1.6;">
            Yes, current Saudi Ministry of Hajj &amp; Umrah rules permit women to travel in authorized group tours without a Mahram. (Last verified: November 2026).
          </p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:16px;">
          <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">Which vaccines are mandatory for Umrah?</h3>
          <p style="color:#475569;font-size:0.92rem;margin:0;line-height:1.6;">
            Meningitis Quadrivalent (ACWY) vaccination taken at least 10 days before arrival in Saudi Arabia is mandatory under Saudi Ministry of Health regulations.
          </p>
        </div>

        <!-- Category: Elderly & Special Needs -->
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#06281e;margin:36px 0 16px;">3. Elderly Pilgrims &amp; Hotel Logistics</h2>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:16px;">
          <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">How far are the hotels from the Haram courtyard?</h3>
          <p style="color:#475569;font-size:0.92rem;margin:0;line-height:1.6;">
            We offer tiers from 50m (Clock Tower VIP) to 750m (Bronze Tier). Every hotel has a completely flat walking path without steep hills or stairs.
          </p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:16px;">
          <h3 style="font-size:1.1rem;color:#06281e;margin-top:0;">Can you provide wheelchair assistance?</h3>
          <p style="color:#475569;font-size:0.92rem;margin:0;line-height:1.6;">
            Yes. We coordinate dedicated wheelchair escorts (Khadim) for Tawaf and Sa'i, ground-floor room placements, and slow-paced Ziyarat tours for elderly pilgrims.
          </p>
        </div>

        <div style="text-align:center;margin-top:40px;">
          <p style="color:#475569;font-size:0.95rem;">Have a specific Islamic jurisprudence (Masail) question?</p>
          <a href="/guides/umrah-masail-faq/" class="btn btn-outline" style="margin-top:8px;">Search 50+ Umrah Fiqh Masail ➔</a>
        </div>
      </div>
    </section>
  </main>
  ${baseFooter}`;

const newPages = [
  { dir: 'about', html: aboutHtml },
  { dir: 'branches', html: branchesHtml },
  { dir: 'contact', html: contactHtml },
  { dir: 'faq', html: faqHtml }
];

newPages.forEach(({ dir, html }) => {
  const targetDir = path.join(rootDir, dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`✅ Generated /${dir}/index.html`);
});
