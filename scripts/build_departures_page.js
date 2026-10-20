/**
 * Generates /departures/index.html from data/live-departures.json and data/live-hotels.json
 */
const fs = require('fs');
const path = require('path');

const departures = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'live-departures.json'), 'utf8'));
const hotels = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'live-hotels.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'sync-meta.json'), 'utf8'));

// Format currency in Indian comma format
function formatINR(num) {
  return '₹' + Number(num).toLocaleString('en-IN');
}

// Generate the departure cards HTML
function generateCard(d) {
  const percentFilled = Math.round(((d.total_seats - d.available_seats) / d.total_seats) * 100);
  const urgencyColor = d.available_seats <= 3 ? '#b91c1c' : (d.available_seats <= 10 ? '#d97706' : '#15803d');
  const monthKey = d.departure_date.slice(0, 7);

  const budgetPrice = formatINR(d.pricing.budget);
  const bronzePrice = formatINR(d.pricing.bronze);
  const silverPrice = formatINR(d.pricing.silver);
  const goldPrice = formatINR(d.pricing.gold);

  const waBudgetMsg = encodeURIComponent(`Assalamu Alaikum Noor-E-Haram! I want to book Umrah departure from ${d.departure_city} on ${d.departure_date_formatted} (${d.airline}) - Budget Tier (${budgetPrice}). PNR: ${d.pnr_code}. Please confirm availability.`);

  return `
      <article class="departure-card" 
               data-city="${d.departure_city.toLowerCase()}" 
               data-month="${monthKey}" 
               data-airline="${d.airline.toLowerCase()}" 
               data-pnr="${d.pnr_code.toLowerCase()}"
               data-budget="${d.pricing.budget}"
               data-bronze="${d.pricing.bronze}"
               data-silver="${d.pricing.silver}"
               data-gold="${d.pricing.gold}">
        <div class="dep-card-header">
          <div class="dep-pill-group">
            <span class="dep-city-tag">${d.departure_city} (${d.departure_code})</span>
            <span class="dep-airline-tag">${d.airline}</span>
            <span class="dep-type-tag">${d.flight_type}</span>
          </div>
          <span class="dep-urgency-tag" style="background:${urgencyColor}15; color:${urgencyColor}; border-color:${urgencyColor}40;">
            ${d.urgency_badge}
          </span>
        </div>

        <div class="dep-body">
          <div class="dep-flight-route">
            <div class="flight-leg">
              <div class="flight-city-label">${d.departure_code}</div>
              <div class="flight-date">${d.departure_date_formatted}</div>
              <div class="flight-time">${d.departure_time || 'Direct'}</div>
            </div>
            <div class="flight-path">
              <span class="flight-duration">${d.duration_days} Days Tour</span>
              <div class="flight-arrow-line">
                <span class="flight-plane-icon">✈️</span>
              </div>
              <span class="flight-no">${d.departure_flight_number ? d.airline + ' ' + d.departure_flight_number : d.departure_sector}</span>
            </div>
            <div class="flight-leg text-right">
              <div class="flight-city-label">JED / MED</div>
              <div class="flight-date">${d.return_date_formatted}</div>
              <div class="flight-time">${d.saudi_arrival_time || 'Arrival'}</div>
            </div>
          </div>

          <div class="dep-meta-bar">
            <span>🧳 <strong>Baggage:</strong> ${d.baggage_policy}</span>
            <span>🎫 <strong>PNR:</strong> ${d.pnr_code}</span>
          </div>

          <div class="dep-seat-bar-wrap">
            <div class="dep-seat-labels">
              <span><strong>${d.available_seats} Seats Left</strong> of ${d.total_seats}</span>
              <span style="color:${urgencyColor};"><strong>${percentFilled}% Booked</strong></span>
            </div>
            <div class="dep-progress-bg">
              <div class="dep-progress-fill" style="width: ${percentFilled}%; background: ${urgencyColor};"></div>
            </div>
          </div>

          <div class="dep-tier-prices">
            <div class="tier-col active-tier" data-tier="budget">
              <span class="tier-name">Budget</span>
              <span class="tier-val">${budgetPrice}</span>
            </div>
            <div class="tier-col" data-tier="bronze">
              <span class="tier-name">Bronze</span>
              <span class="tier-val">${bronzePrice}</span>
            </div>
            <div class="tier-col" data-tier="silver">
              <span class="tier-name">Silver</span>
              <span class="tier-val">${silverPrice}</span>
            </div>
            <div class="tier-col" data-tier="gold">
              <span class="tier-name">Gold</span>
              <span class="tier-val">${goldPrice}</span>
            </div>
          </div>

          <div class="dep-inclusions">
            <span>✓ Return Flights</span>
            <span>✓ Umrah Visa &amp; Insurance</span>
            <span>✓ 3x Buffet Meals</span>
            <span>✓ AC Transfers</span>
            <span>✓ 41 Ziyarat Points</span>
          </div>

          <div class="dep-action-wrap">
            <a href="https://wa.me/919986925592?text=${waBudgetMsg}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-primary dep-book-btn">
              <span>💬 Book Seat via WhatsApp</span>
            </a>
          </div>
        </div>
      </article>`;
}

const cardsHtml = departures.map(generateCard).join('\n');

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verified Live Umrah Departures &amp; Package Rates 2026–2027 | NOOR-E-HARAM</title>
  <meta name="description" content="Browse 51+ live verified Umrah group departures from Mumbai, Bengaluru, Delhi, Ahmedabad &amp; Lucknow. Confirmed airline PNRs, real-time seats, and transparent packages from ₹79,786.">
  <link rel="canonical" href="https://nooreharam.com/departures/">

  <!-- Open Graph -->
  <meta property="og:title" content="Verified Live Umrah Departures &amp; Package Rates 2026–2027 | NOOR-E-HARAM">
  <meta property="og:description" content="Live confirmed seats and transparent package rates from Mumbai, Bengaluru, Delhi &amp; North Karnataka. Real airline PNRs with instant WhatsApp reservation.">
  <meta property="og:url" content="https://nooreharam.com/departures/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://nooreharam.com/assets/images/hero-makkah.webp">

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
    .dep-hero {
      background: linear-gradient(135deg, #031812 0%, #06281e 50%, #0a3d2e 100%);
      color: #fff;
      padding: 120px 0 60px;
      text-align: center;
      position: relative;
    }
    .dep-filter-section {
      background: #f8fafc;
      padding: 30px 0 20px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 70px;
      z-index: 40;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .filter-pills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-bottom: 16px;
    }
    .filter-btn {
      background: #fff;
      border: 1px solid #cbd5e1;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-btn:hover, .filter-btn.active {
      background: #06281e;
      color: #fff;
      border-color: #06281e;
      box-shadow: 0 2px 8px rgba(6,40,30,0.2);
    }
    .tier-toggle-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px dashed #cbd5e1;
    }
    .tier-toggle-btn {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .tier-toggle-btn.active {
      background: #C59B27;
      color: #031812;
      border-color: #9A771C;
    }
    .dep-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
      padding: 40px 0 80px;
    }
    .departure-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      display: flex;
      flex-direction: column;
    }
    .departure-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(6,40,30,0.12);
      border-color: #C59B27;
    }
    .dep-card-header {
      background: #f8fafc;
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .dep-pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .dep-city-tag {
      background: #06281e;
      color: #E2C77F;
      font-weight: 700;
      font-size: 0.78rem;
      padding: 4px 10px;
      border-radius: 6px;
    }
    .dep-airline-tag {
      background: #e0e7ff;
      color: #3730a3;
      font-weight: 600;
      font-size: 0.78rem;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .dep-type-tag {
      background: #ecfdf5;
      color: #065f46;
      font-weight: 600;
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .dep-urgency-tag {
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .dep-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 16px;
    }
    .dep-flight-route {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #edf2f7;
      padding: 14px;
      border-radius: 12px;
    }
    .flight-leg {
      flex: 1;
    }
    .flight-city-label {
      font-size: 1.15rem;
      font-weight: 800;
      color: #06281e;
    }
    .flight-date {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }
    .flight-time {
      font-size: 0.78rem;
      color: #64748b;
    }
    .flight-path {
      text-align: center;
      padding: 0 10px;
      position: relative;
    }
    .flight-duration {
      font-size: 0.72rem;
      font-weight: 700;
      color: #d97706;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .flight-arrow-line {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 2px;
      background: #cbd5e1;
      margin: 6px auto;
      position: relative;
    }
    .flight-plane-icon {
      font-size: 0.8rem;
      background: #f8fafc;
      padding: 0 4px;
    }
    .flight-no {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }
    .dep-meta-bar {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: #475569;
      background: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px dashed #cbd5e1;
    }
    .dep-seat-bar-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .dep-seat-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: #334155;
    }
    .dep-progress-bg {
      height: 8px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
    }
    .dep-progress-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
    .dep-tier-prices {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: #f1f5f9;
      padding: 8px;
      border-radius: 10px;
      text-align: center;
    }
    .tier-col {
      padding: 8px 4px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tier-col.active-tier {
      background: #06281e;
      color: #fff;
      box-shadow: 0 2px 6px rgba(6,40,30,0.25);
    }
    .tier-col.active-tier .tier-name {
      color: #E2C77F;
    }
    .tier-col.active-tier .tier-val {
      color: #fff;
    }
    .tier-name {
      font-size: 0.72rem;
      font-weight: 700;
      color: #64748b;
      display: block;
      text-transform: uppercase;
    }
    .tier-val {
      font-size: 0.92rem;
      font-weight: 800;
      color: #0f172a;
      display: block;
      margin-top: 2px;
    }
    .dep-inclusions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 0.78rem;
      color: #166534;
      background: #f0fdf4;
      padding: 10px 12px;
      border-radius: 8px;
    }
    .dep-action-wrap {
      margin-top: auto;
    }
    .dep-book-btn {
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 10px;
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      color: #fff;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(22,101,52,0.25);
      transition: transform 0.2s, background 0.2s;
    }
    .dep-book-btn:hover {
      background: linear-gradient(135deg, #166534 0%, #14532d 100%);
      transform: translateY(-2px);
    }
    .no-results {
      text-align: center;
      padding: 60px 20px;
      grid-column: 1 / -1;
      display: none;
    }
  </style>

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://nooreharam.com/departures/#webpage",
        "url": "https://nooreharam.com/departures/",
        "name": "Verified Live Umrah Departures & Package Rates 2026–2027",
        "description": "51+ live verified Umrah group departures from Mumbai, Bengaluru, Delhi, Ahmedabad & Lucknow with real-time seats and pricing.",
        "breadcrumb": {
          "@id": "https://nooreharam.com/departures/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://nooreharam.com/departures/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://nooreharam.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Live Departures",
            "item": "https://nooreharam.com/departures/"
          }
        ]
      },
      {
        "@type": "TravelAgency",
        "@id": "https://nooreharam.com/#organization",
        "name": "NOOR-E-HARAM Tours & Travels",
        "url": "https://nooreharam.com/",
        "telephone": "+919986925592",
        "priceRange": "₹79,786 - ₹1,59,786"
      }
    ]
  }
  </script>
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
        <a href="/departures/" class="nav-link active" style="color:var(--gold-light);font-weight:700;">Live Departures</a>
        <a href="/umrah/" class="nav-link">Umrah</a>
        <a href="/hajj/" class="nav-link">Hajj</a>
        <a href="/ziyarat/41-ziyarat-places/" class="nav-link">41 Ziyarat</a>
        <a href="/tools/" class="nav-link">Tools</a>
        <a href="/trust/" class="nav-link">Trust</a>
      </nav>

      <div class="header-actions">
        <a href="https://wa.me/919986925592" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          WhatsApp Us
        </a>
      </div>
    </div>
  </header>

  <!-- Main Hero -->
  <main id="main-content">
    <section class="dep-hero">
      <div class="container">
        <span class="eyebrow eyebrow-gold">Direct Partner Fixed Departures • 100% Guaranteed PNR</span>
        <h1 class="hero-title" style="color:#fff;margin-top:12px;">Live Umrah Group Departures &amp; Package Rates</h1>
        <p class="hero-subtitle" style="color:#cbd5e1;max-width:760px;margin:16px auto 0;">
          Browse 51+ live verified flight departures from Mumbai, Bengaluru, Delhi, Ahmedabad, and Lucknow. 
          Real airline PNRs, verified remaining seats, and transparent all-inclusive packages from <strong>₹79,786</strong>.
        </p>

        <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:24px;">
          <span style="background:rgba(197,155,39,0.15);border:1px solid #C59B27;color:#E2C77F;padding:6px 14px;border-radius:9999px;font-size:0.85rem;font-weight:600;">
            ✈️ Verified Airline PNRs
          </span>
          <span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:6px 14px;border-radius:9999px;font-size:0.85rem;font-weight:600;">
            🧳 20–40KG Baggage + Free Zamzam
          </span>
          <span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:6px 14px;border-radius:9999px;font-size:0.85rem;font-weight:600;">
            🏨 4 Tiers: Budget to Gold
          </span>
          <span style="background:rgba(34,197,94,0.15);border:1px solid #22c55e;color:#86efac;padding:6px 14px;border-radius:9999px;font-size:0.85rem;font-weight:600;">
            ⚡ Instant WhatsApp Confirmation
          </span>
        </div>
      </div>
    </section>

    <!-- Filter Control Bar -->
    <section class="dep-filter-section" id="filter-controls">
      <div class="container">
        <!-- City Pills -->
        <div class="filter-pills-row" id="city-pills">
          <button type="button" class="filter-btn active" data-filter-city="all">All Departure Cities (51)</button>
          <button type="button" class="filter-btn" data-filter-city="mumbai">Mumbai (22)</button>
          <button type="button" class="filter-btn" data-filter-city="delhi">Delhi (22)</button>
          <button type="button" class="filter-btn" data-filter-city="bengaluru">Bengaluru (1)</button>
          <button type="button" class="filter-btn" data-filter-city="ahmedabad">Ahmedabad (3)</button>
          <button type="button" class="filter-btn" data-filter-city="lucknow">Lucknow (3)</button>
        </div>

        <!-- Month Pills -->
        <div class="filter-pills-row" id="month-pills">
          <button type="button" class="filter-btn active" data-filter-month="all">All Months</button>
          <button type="button" class="filter-btn" data-filter-month="2026-10">October 2026 (4)</button>
          <button type="button" class="filter-btn" data-filter-month="2026-11">November 2026 (9)</button>
          <button type="button" class="filter-btn" data-filter-month="2026-12">December 2026 (18)</button>
          <button type="button" class="filter-btn" data-filter-month="2027-01">January 2027 (17)</button>
          <button type="button" class="filter-btn" data-filter-month="2027-02">February 2027 (3)</button>
        </div>

        <!-- Search Bar -->
        <div style="max-width:540px;margin:0 auto 10px;">
          <input type="text" 
                 id="departure-search" 
                 class="form-control" 
                 placeholder="🔍 Search airline (IndiGo, Saudi), PNR code, or date..." 
                 style="width:100%;padding:10px 18px;border-radius:9999px;border:1px solid #cbd5e1;font-size:0.92rem;">
        </div>

        <!-- Global Tier Active Switcher -->
        <div class="tier-toggle-row">
          <span style="font-size:0.85rem;font-weight:700;color:#334155;align-self:center;">View Tier Prices:</span>
          <button type="button" class="tier-toggle-btn active" data-select-tier="budget">🥉 Budget (from ₹79,786)</button>
          <button type="button" class="tier-toggle-btn" data-select-tier="bronze">🥉 Bronze (from ₹89,786)</button>
          <button type="button" class="tier-toggle-btn" data-select-tier="silver">🥈 Silver (from ₹99,786)</button>
          <button type="button" class="tier-toggle-btn" data-select-tier="gold">🥇 Gold (from ₹1,23,786)</button>
        </div>
      </div>
    </section>

    <!-- Departures Grid -->
    <section style="background:#f1f5f9;min-height:500px;">
      <div class="container">
        <div class="dep-grid" id="departures-container">
          ${cardsHtml}

          <div class="no-results" id="no-results">
            <h3>No departures match your filter</h3>
            <p style="color:#64748b;margin-top:8px;">Try clearing filters or search to see all 51 available departure dates.</p>
            <button type="button" class="btn btn-outline" id="reset-filters" style="margin-top:16px;">Reset All Filters</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Inclusions & Explanations -->
    <section style="padding:60px 0;background:#fff;border-top:1px solid #e2e8f0;">
      <div class="container" style="max-width:960px;">
        <div class="text-center mb-40">
          <span class="eyebrow eyebrow-gold">What's Included</span>
          <h2 class="section-title">Transparent Package Inclusions Across All Tiers</h2>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">
          <div style="background:#f8fafc;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-bottom:12px;">✈️ Flights &amp; Transport</h3>
            <ul style="padding-left:18px;color:#475569;font-size:0.9rem;line-height:1.6;">
              <li>Return confirmed direct/group flights on Saudi Airlines, IndiGo, Air India.</li>
              <li>Complete air-conditioned luxury coach transfers (Jeddah–Makkah–Madinah–Airport).</li>
              <li>Free 5-Litre Zamzam water can per pilgrim included.</li>
            </ul>
          </div>

          <div style="background:#f8fafc;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-bottom:12px;">🏨 Accommodation Tiers</h3>
            <ul style="padding-left:18px;color:#475569;font-size:0.9rem;line-height:1.6;">
              <li><strong>Budget:</strong> Clean economy hotels with frequent 24/7 Haram transport.</li>
              <li><strong>Bronze:</strong> 750m–900m walking distance to Haram.</li>
              <li><strong>Silver:</strong> 400m–600m close walking radius.</li>
              <li><strong>Gold:</strong> Premium 5-star / Luxury Haram-facing stays.</li>
            </ul>
          </div>

          <div style="background:#f8fafc;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.1rem;color:#06281e;margin-bottom:12px;">🍽️ Food &amp; Spiritual Guidance</h3>
            <ul style="padding-left:18px;color:#475569;font-size:0.9rem;line-height:1.6;">
              <li>Fresh Indian buffet catering: Breakfast, Lunch, and Dinner served daily.</li>
              <li>Guided comprehensive tour of 41 blessed Ziyarat landmarks with scholar narration.</li>
              <li>Dedicated Islamic scholar escort throughout the 15-day pilgrimage.</li>
            </ul>
          </div>
        </div>

        <div style="text-align:center;margin-top:40px;">
          <p style="color:#64748b;font-size:0.92rem;">
            Need a custom departure date or private family package? 
            <a href="https://wa.me/919986925592?text=Assalamu%20Alaikum%2C%20I%20need%20a%20customized%20Umrah%20package%20quote." 
               target="_blank" rel="noopener noreferrer" style="color:#C59B27;font-weight:700;text-decoration:underline;">
              Chat with our Director on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container footer-container">
      <div class="footer-brand">
        <span class="logo-text" style="color:#E2C77F;font-size:1.4rem;font-weight:800;">NOOR-E-HARAM</span>
        <p style="color:#94a3b8;font-size:0.85rem;margin-top:8px;">
          Government recognized &amp; trusted Hajj &amp; Umrah tour operator serving pilgrims across North Karnataka, Mumbai, and Bangalore.
        </p>
      </div>
      <div class="footer-links">
        <h4 style="color:#fff;font-size:0.95rem;margin-bottom:10px;">Quick Links</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;font-size:0.85rem;">
          <li><a href="/" style="color:#cbd5e1;">Home</a></li>
          <li><a href="/packages/" style="color:#cbd5e1;">All Packages</a></li>
          <li><a href="/departures/" style="color:#E2C77F;font-weight:700;">Live Departures</a></li>
          <li><a href="/tools/" style="color:#cbd5e1;">Pilgrim Tools</a></li>
          <li><a href="/trust/" style="color:#cbd5e1;">Trust &amp; Verification</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4 style="color:#fff;font-size:0.95rem;margin-bottom:10px;">Head Office</h4>
        <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;">
          Darga Complex, Hubli, Karnataka, India<br>
          WhatsApp: <a href="https://wa.me/919986925592" style="color:#E2C77F;">+91 99869 25592</a>
        </p>
      </div>
    </div>
  </footer>

  <!-- Interactive JavaScript Engine -->
  <script>
    (function() {
      var currentCity = 'all';
      var currentMonth = 'all';
      var currentTier = 'budget';
      var searchQuery = '';

      var cards = document.querySelectorAll('.departure-card');
      var cityPills = document.querySelectorAll('[data-filter-city]');
      var monthPills = document.querySelectorAll('[data-filter-month]');
      var tierToggleBtns = document.querySelectorAll('[data-select-tier]');
      var searchInput = document.getElementById('departure-search');
      var noResults = document.getElementById('no-results');
      var resetBtn = document.getElementById('reset-filters');

      function updateCardWhatsAppLinks(card, tier) {
        var price = card.getAttribute('data-' + tier);
        var pnr = card.getAttribute('data-pnr').toUpperCase();
        var city = card.querySelector('.dep-city-tag').textContent;
        var date = card.querySelector('.flight-date').textContent;
        var airline = card.querySelector('.dep-airline-tag').textContent;
        var formattedPrice = '₹' + Number(price).toLocaleString('en-IN');

        var bookBtn = card.querySelector('.dep-book-btn');
        if (bookBtn) {
          var msg = 'Assalamu Alaikum Noor-E-Haram! I want to book Umrah departure from ' + city + ' on ' + date + ' (' + airline + ') - ' + tier.toUpperCase() + ' Tier (' + formattedPrice + '). PNR: ' + pnr + '. Please confirm availability.';
          bookBtn.href = 'https://wa.me/919986925592?text=' + encodeURIComponent(msg);
        }
      }

      function filterCards() {
        var visibleCount = 0;

        cards.forEach(function(card) {
          var city = card.getAttribute('data-city');
          var month = card.getAttribute('data-month');
          var airline = card.getAttribute('data-airline');
          var pnr = card.getAttribute('data-pnr');
          var textContent = (city + ' ' + airline + ' ' + pnr + ' ' + card.innerText).toLowerCase();

          var matchCity = (currentCity === 'all') || (city.indexOf(currentCity) !== -1);
          var matchMonth = (currentMonth === 'all') || (month === currentMonth);
          var matchSearch = (!searchQuery) || (textContent.indexOf(searchQuery) !== -1);

          if (matchCity && matchMonth && matchSearch) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (visibleCount === 0) {
          noResults.style.display = 'block';
        } else {
          noResults.style.display = 'none';
        }
      }

      // City filter events
      cityPills.forEach(function(btn) {
        btn.addEventListener('click', function() {
          cityPills.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentCity = btn.getAttribute('data-filter-city');
          filterCards();
        });
      });

      // Month filter events
      monthPills.forEach(function(btn) {
        btn.addEventListener('click', function() {
          monthPills.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentMonth = btn.getAttribute('data-filter-month');
          filterCards();
        });
      });

      // Tier switcher events
      tierToggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          tierToggleBtns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentTier = btn.getAttribute('data-select-tier');

          cards.forEach(function(card) {
            var tierCols = card.querySelectorAll('.tier-col');
            tierCols.forEach(function(col) {
              if (col.getAttribute('data-tier') === currentTier) {
                col.classList.add('active-tier');
              } else {
                col.classList.remove('active-tier');
              }
            });
            updateCardWhatsAppLinks(card, currentTier);
          });
        });
      });

      // Individual card tier column clicks
      cards.forEach(function(card) {
        var tierCols = card.querySelectorAll('.tier-col');
        tierCols.forEach(function(col) {
          col.addEventListener('click', function() {
            tierCols.forEach(function(c) { c.classList.remove('active-tier'); });
            col.classList.add('active-tier');
            var selectedTier = col.getAttribute('data-tier');
            updateCardWhatsAppLinks(card, selectedTier);
          });
        });
      });

      // Search event
      searchInput.addEventListener('input', function() {
        searchQuery = searchInput.value.trim().toLowerCase();
        filterCards();
      });

      // Reset
      resetBtn.addEventListener('click', function() {
        currentCity = 'all';
        currentMonth = 'all';
        searchQuery = '';
        searchInput.value = '';
        cityPills.forEach(function(b, idx) { b.classList.toggle('active', idx === 0); });
        monthPills.forEach(function(b, idx) { b.classList.toggle('active', idx === 0); });
        filterCards();
      });
    })();
  </script>
</body>
</html>`;

const outPath = path.join(__dirname, '..', 'departures', 'index.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, fullHtml, 'utf8');

console.log('✅ Successfully generated /departures/index.html with ' + departures.length + ' live departures!');
