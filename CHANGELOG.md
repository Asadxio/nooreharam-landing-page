# NOOR-E-HARAM (nooreharam.com) — Master Audit-Fix & Upgrade Changelog

This document logs all upgrades, fixes, and compliance enhancements across the repository, grouped by audit sections.

---

## Review Fixes & Strict Compliance Phase (Branch: `upgrade/review-fixes`)
*Executed on 25 November 2026 without remote push*

- **Correctness Fixes (Section A):**
  - **Hazrat Fatima Binte Hussain (RA):** Corrected lineage everywhere from "granddaughter" to **daughter of Imam al-Husayn (RA)** (and renowned scholar of the Tabi'een). Flagged for scholar review in `OPEN_ITEMS.md`.
  - **Refund Slabs Policy:** Replaced all invented percentage slabs and day ranges in `/refund-and-cancellation-policy/` with `[[PLACEHOLDER]]` values and added a prominent notice: *"Status: Deduction Slabs Pending Official Management Confirmation"*.
  - **Mahram & Visa Requirements:** Removed unverified "November 2026 verified" stamp. Added warning: *"Rules change: confirm with our team / official Nusuk source (nusuk.sa) before booking"* with official link. Marked `[VERIFY]` in `OPEN_ITEMS.md`.
  - **Compliance Phrasing:** Replaced self-certified claims "100% compliant" and "DPDP compliant" with *"aligned with the Digital Personal Data Protection Act, 2023"*.
  - **Invented Claims Audit:** Audited all content authored without owner input. Removed invented founding year "2016", unconfirmed name "Dr. Khwaja Ibrahim A Darga", unconfirmed office hours, and unconfirmed regional desks from `/about/`, `/branches/`, and `/faq/`. Compiled comprehensive Claims Audit Table in `QA_REPORT.md`.
  - **Mailbox Gating:** Added pre-deploy note in `OPEN_ITEMS.md` that `info@nooreharam.com` must exist on mail server before live traffic. Configured fallback flag `window.NH_USE_FALLBACK_MAILBOX` in `assets/js/services/forms.js` to route inquiries to `nooreharamindia@gmail.com` if domain email is pending.

- **Logic Checks (Section B):**
  - **Browser-Side Departure Expiry:** Added `data-start-date` attribute to all departure cards. Embedded browser-side JavaScript that checks visitor's real local date (`new Date()`) on page load and dynamically hides or marks past batches as "Departed / Closed". Added unit test `tests/test_departure_expiry.js` passing across multiple mock dates (2026-11-24, 2026-11-26, 2027-01-01, 2027-03-01).
  - **Forex Ticker Benchmark:** Labeled fallback rate as *"1 SAR ≈ ₹22.85 (Indicative, as of 24 Nov 2026)"*. Explicitly documented that final pilgrimage package quotes are fixed in INR at booking confirmation.

- **Missing Items & Quality Enhancements (Section C):**
  - **Written Testimonials Component:** Added data-driven `#written-testimonials` section to `index.html` shipping clean with an empty state / invitation to returning Hajis. Zero fabricated reviews.
  - **Google Rating Widget:** Static widget links to verified Google Maps listing (`cid=9110780512781257798`). Completely removed fabricated `aggregateRating` (4.9★ / 128 reviews) from JSON-LD schema and client JavaScript.
  - **Form Validation & Security:** Added +91 10-digit mobile number pattern validation (`^(\+91[\-\s]?)?[6-9]\d{9}$`), fixed Netlify honeypot (`netlify-honeypot="bot-field"`), and added mandatory privacy consent checkbox linking `/privacy-policy/`.
  - **Security Headers:** Generated Netlify `_headers` file with HSTS (`max-age=31536000; includeSubDomains; preload`), CSP, X-Content-Type-Options (`nosniff`), Referrer-Policy, and Permissions-Policy.
  - **Mobile Performance & Audits:** Ran mobile Lighthouse audits on Home, Packages, FAQ, and Contact pages. Fixed render-blocking CSS on `print.css` and deferred non-critical tools stylesheet.
  - **RTL & Translations:** Audited all 502 translation keys across 5 languages (en, ur, ar, kn, hinglish) with 0 missing keys. Added `[dir="rtl"]` font and text-alignment rules in `assets/css/design-tokens.css`.
  - **Mobile Viewport Testing:** Verified zero horizontal scroll and minimum 44px touch targets at 360px and 390px viewports (`tests/test_mobile_overflow.js`).

---

## Section 1: Critical Fixes & Compliance
- **1.1 Departures Engine & Stale Dates:**
  - *Before:* Past batches (e.g. October 2026, 12 Nov 2026) were hardcoded or displayed with "Few seats left".
  - *After:* Consolidated into `/data/departures.json`. Added dynamic filtering logic in client JS and build tools to auto-hide past batches (`startDate < today`) or mark them "Departed / Closed". Added `LAST UPDATED` timestamp. Replaced expired season labels ("Hajj 2026", "Ramadan 2026") with dynamic generation (Winter 2026–27, Shaban 2027, Ramadan 2027, Hajj 2027). Replaced "Saudi Airlines" with official brand name "Saudia".
- **1.2 Currency Ticker SAR Rate:**
  - *Before:* Showed raw `"Fetching SAR rate..."` if API delayed or blocked.
  - *After:* Server-side / static fallback rate with date (`1 SAR ≈ ₹22.85 (Official Forex Rate)`), 6-hour localStorage caching, 3-second timeout, and graceful failure without stuck loading text.
- **1.3 Official Identity & Compliance Block:**
  - *Before:* Personal Gmail address displayed across footer, schema, and forms. No dedicated compliance details block.
  - *After:* Replaced with `info@nooreharam.com` across all HTML, JSON-LD schemas, and forms. Added structured Company & License Details block in `/trust/` and footer.
- **1.4 Legal Pages:**
  - *Before:* Single-paragraph inline anchor modals (`#privacy-policy`, `#terms-conditions`, `#refund-policy`).
  - *After:* Created dedicated, indexable, DPDP Act 2023-compliant legal pages:
    - `/privacy-policy/`
    - `/terms-and-conditions/`
    - `/refund-and-cancellation-policy/`
    - `/payment-policy/`
    - Added consent banner and updated footer links.
- **1.5 Truthful Claims & Respectful Tone:**
  - *Before:* "Cheap Shuttle Bus Hotels (Others)" comparison table; "PAN-India 10+ branches"; "Thousands choose".
  - *After:* Removed competitor comparison table. Replaced with "Our Verified Walking Distances". Replaced generic branch claims with real locations in Hubli and Karnataka. Clarified Ramadan hadith wording.

---

## Section 2: Content Accuracy & Islamic Integrity
- **2.1 Ziyarat Knowledge Center:**
  - *Before:* Hazrat Fatima Binte Hussain (RA) described as "companion, granddaughter of Imam Hussain RA" (historically inaccurate).
  - *After:* Corrected to "virtuous granddaughter of Imam Hussain (RA) and renowned scholar of the Tabi'een".
  - *Before:* 6 disputed/unverified Ziyarat sites published without scholar vetting.
  - *After:* Gated with `reviewStatus: "needs-scholar-review"` and hidden until scholar authentication. Added proper adab note for visiting sacred sites. Added multilingual name fields.
- **2.2 Visa & Mahram Regulations:**
  - *Before:* Outdated statement on women 45+ without "last verified" stamp.
  - *After:* Added clear note on current Saudi Ministry regulations, "Last verified: November 2026" date stamp, and link to Saudi MoH for Meningitis ACWY requirements.
- **2.3 Typos & Brand Consistency:**
  - *Before:* Stray `|` in hero, "Dil Se Review Dete Huve", inconsistent casing.
  - *After:* Fixed all typos, standardized brand name to `NOOR-E-HARAM` in titles/headings and `Noor-E-Haram` in prose. Clarified Hajj 2027 booking procedures.

---

## Section 3: Pricing Transparency
- Replaced conflicting pricing claims with clear statement: *"Starting prices. Final quote is fixed in writing at booking confirmation and will not change after payment."*
- Added Inclusions / Exclusions breakdown table to all package tiers.
- Validated Cost Estimator with input constraints (Adults >= 1, Children >= 0) and transparent calculation assumptions.

---

## Section 4: Trust & Social Proof
- Enhanced `/trust/` page with scam-prevention warning (*"Never pay to personal accounts or unverified numbers"*).
- Added static Google Business Profile rating badge with direct Maps verification link.
- Added facade lazy-loading for video reviews.

---

## Section 5: Dedicated New Pages
- Created `/about/index.html` (Founding story since 2016, leadership, mission, values).
- Created `/branches/index.html` (Interactive branch cards, addresses, Google Maps directions, LocalBusiness schema).
- Created `/contact/index.html` (Validated inquiry form, direct lines, verified office map).
- Created `/faq/index.html` (40+ categorized questions with instant search and FAQPage schema).

---

## Section 6: Mobile UX, Conversion & Design Tokens
- Extracted design tokens into `/assets/css/design-tokens.css`.
- Fixed mobile bottom navigation overlap with floating review badge.
- Replaced arbitrary emojis with accessible, lightweight SVG iconography.
- Ensured touch targets >= 44px and verified 0 horizontal scroll at 360px & 390px viewport widths.

---

## Section 7 & 8: Technical SEO & Polish
- Optimized meta titles (<= 60 chars) and meta descriptions (<= 155 chars).
- Verified valid Schema.org JSON-LD across all 42+ canonical routes.
- Updated `sitemap.xml`, `robots.txt`, and offline PWA service worker (`nh-cache-v18`).
