# NOOR-E-HARAM (nooreharam.com) — QA & Verification Report

**Date of Execution:** 24 November 2026  
**Auditor / Test Suite:** Automated Regression, SEO & Schema Validation Suite (`node tests/validate_all.js`)  
**Active Working Branch:** `upgrade/master-audit-fix`  
**Test Environment:** Node.js v26.13.1 / Windows Local HTTP Mock Server  
**Total Canonical Routes:** 45 indexable routes + 404.html + offline.html (47 total routes)  

---

## 1. Acceptance Checklist (Section 10 Verification)

| # | Item | Status | Verification Detail |
|---|------|--------|---------------------|
| 1 | **Zero placeholders leaked in public HTML** | ✅ PASSED | All owner placeholders are isolated to `OPEN_ITEMS.md`. No raw template tags leaked. |
| 2 | **Zero superlative claims ("World No.1", "Best", etc.)** | ✅ PASSED | Cleaned across all headers, titles, and body copy in compliance with ASCI and Consumer Protection Act guidelines. |
| 3 | **Zero competitor disparagement** | ✅ PASSED | Removed "Cheap Shuttle Bus Hotels (Others)" column; replaced with "Our Verified Walking Distances". |
| 4 | **Departures dynamic filtering (`startDate >= today`)** | ✅ PASSED | Past batches auto-hidden; departed batches marked correctly; "Few seats left" shown only if remaining <= 10; standardized to Saudia. |
| 5 | **SAR Ticker stuck text eliminated** | ✅ PASSED | Rendered fallback `1 SAR ≈ ₹22.85 (Forex Benchmark)`; 6h localStorage caching with 3s network timeout; zero stuck loading text. |
| 6 | **Official Email standardisation** | ✅ PASSED | `info@nooreharam.com` active across 29 public HTML, JSON-LD schemas, and forms; personal Gmail removed. |
| 7 | **4 Dedicated Legal Pages live & indexable** | ✅ PASSED | `/privacy-policy/`, `/terms-and-conditions/`, `/refund-and-cancellation-policy/`, `/payment-policy/` created and linked from footer. |
| 8 | **4 Dedicated Content Pages live & indexable** | ✅ PASSED | `/about/`, `/branches/`, `/contact/`, `/faq/` created with dedicated Schema and navigation links. |
| 9 | **Hazrat Fatima Binte Hussain historical accuracy** | ✅ PASSED | Corrected to "virtuous granddaughter of Imam al-Husayn (RA) and esteemed scholar of the Tabi'een". |
| 10 | **Doubtful Ziyarat sites gated** | ✅ PASSED | 5 doubtful sites commented/gated with `[SCHOLAR_REVIEW]` and Sunnah Adab banner displayed. |
| 11 | **Pricing transparency & Inclusions/Exclusions** | ✅ PASSED | Conflicting pricing phrasing resolved; explicit Inclusions & Exclusions table rendered. |
| 12 | **Mobile bottom bar overlap resolved** | ✅ PASSED | Floating review badge positioned above mobile navigation (`bottom: 74px !important; font-size: 0.76rem`). |
| 13 | **Design tokens unified** | ✅ PASSED | Created `/assets/css/design-tokens.css` with 44px touch targets, color palette, typography scale, and responsive layout variables. |
| 14 | **Sitemap & Robots.txt synchronized** | ✅ PASSED | `sitemap.xml` updated to 45 canonical URLs; `robots.txt` verified. |
| 15 | **Schema.org JSON-LD validity** | ✅ PASSED | Validated TravelAgency, Product, FAQPage, BreadcrumbList, WebPage across all pages with 0 syntax errors. |
| 16 | **Automated Test Suite execution** | ✅ PASSED | `node tests/validate_all.js` completed with exit code 0; 0 broken links; 0 orphan pages. |
| 17 | **Documentation & Git status** | ✅ PASSED | `OPEN_ITEMS.md`, `CHANGELOG.md`, and `QA_REPORT.md` finalized. |

---

## 2. Test Suite Execution Output Summary

```text
=== STARTING AUTOMATED QA, REGRESSION & SEO VALIDATION (PHASE 4) ===

Found 46 HTML content files to inspect.
Known canonical routes (47):
  • /offline.html
  • /404.html
  • /about/
  • /branches/
  • /cities/north-karnataka/
  • /contact/
  • /departures/
  • /faq/
  • /guides/
  • /guides/nusuk-rawdah-guide/
  • /guides/umrah-cost-india/
  • /guides/umrah-for-elderly/
  • /guides/umrah-for-women-rules/
  • /guides/umrah-guide/
  • /guides/umrah-masail-faq/
  • /guides/umrah-packing-list/
  • /hajj/hajj-2027/
  • /hajj/
  • /hajj/nusuk-hajj-guide/
  • /
  • /nri-umrah-for-parents/
  • /packages/
  • /packages/ramadan-umrah/
  • /payment-policy/
  • /privacy-policy/
  • /refund-and-cancellation-policy/
  • /terms-and-conditions/
  • /tools/card-maker/
  • /tools/certificate-generator/
  • /tools/currency-budget-planner/
  • /tools/dua-list-maker/
  • /tools/
  • /tools/packing-checklist/
  • /tools/tawaf-counter/
  • /trust/
  • /umrah/
  • /umrah/umrah-packages-bangalore/
  • /umrah/umrah-packages-hubli/
  • /umrah/umrah-packages-india/
  • /umrah/umrah-packages-mumbai/
  • /visa/
  • /visa/umrah-visa-cost/
  • /visa/umrah-visa-india/
  • /ziyarat/41-ziyarat-places/
  • /ziyarat/
  • /ziyarat/madinah-ziyarat/
  • /ziyarat/makkah-ziyarat/

Checking 46 files...
  ✓ Title tags: All 46 pages have unique, concise titles
  ✓ Meta descriptions: All 46 pages have descriptive meta summaries
  ✓ Headings: All 46 pages possess exactly one <h1> tag
  ✓ Images: All <img> tags possess descriptive alt attributes
  ✓ JSON-LD: All Schema graphs and blocks parse cleanly without errors
  ✓ Zero placeholders detected in user-facing markup
  ✓ Google Analytics 4 (G-4SZRN40VQ2) present on all routes

Checking sitemap.xml...
  ✓ Found 45 valid canonical URLs in sitemap.xml

Checking seo/seo-map.json...
  ✓ seo/seo-map.json contains 45 validated routes

Checking robots.txt...
  ✓ robots.txt contains valid Sitemap reference

Validating internal links & checking for orphan pages...
  ✓ All 1,297 internal links resolved successfully!
  ✓ Zero orphan pages detected across 45 canonical routes!

Launching local HTTP server to verify live HTTP 200 response codes...
  ✓ All 46 routes returned HTTP 200 OK!

=== QA SUMMARY ===
🎉 ALL AUDITS, ZERO ORPHANS, ZERO DUPLICATES & HTTP INTEGRATION TESTS PASSED WITH 0 ERRORS!
```

---

## 3. Residual Items for Site Owner (`OPEN_ITEMS.md`)
The following legitimate business inputs must be provided by the owner before final production filing:
- Legal entity name (Pvt Ltd / Proprietorship / LLP).
- GSTIN and State of registration.
- Ministry of Minority Affairs / Haj Committee registration category & number.
- Verified company bank account details (Bank Name, Account Number, IFSC) for the fraud-prevention payment block.
- Confirmed list of physical office branches (addresses, phone numbers, Google Maps links).
- Formal grievance officer appointment (Name, Phone, Direct Email).
