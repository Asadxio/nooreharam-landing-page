# NOOR-E-HARAM (nooreharam.com) — Master Audit-Fix & Upgrade Changelog

This document logs all upgrades, fixes, and compliance enhancements across the repository, grouped by audit sections.

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
