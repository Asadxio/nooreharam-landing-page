# Changelog

All notable changes to the Noor-E-Haram enterprise website codebase will be documented in this file.

## [2.1.0] - 2026-07-27

### Added
- Centralized packages configuration file (`/assets/js/config/packages.config.js`) supporting complete decoupling of package metadata, dates, cities, and pricing variants from presentation markup and logic.
- Dynamic package card builder and injector inside the packages grid container.
- High-fidelity pricing table tabs (Mumbai vs. Hubli) inside the Group Umrah package card.
- Validation layer in `forms.js` that checks for duplicate package/departure/variant IDs, negative prices, and missing translation keys on configuration database load.
- Dynamic schema.org JSON-LD generation engine in `i18n.js` that compiles TravelAgency, BreadcrumbList, and FAQPage schemas based on the active config and language dictionary.
- Interactive calculator selectors for Departure City and Category/Variant, recalculating costs based on the config parameters.
- Hidden metadata input fields (`packageId`, `departureId`, `variantId`, `calculatedPrice`) inside the inquiry form.
- Custom event tracking triggers for booking select actions, calculator modifications, and WhatsApp inquiry clicks.
- Packages documentation guide `/docs/Packages.md`.

### Changed
- Replaced the Individual/Solo Umrah package completely with the new Group Umrah (Hubli Departure) package.
- Updated pricing for Hajj (now Hajj 2027 starting at ₹6,99,786), Couple Umrah (₹1,85,786), Family Umrah (₹3,25,786), and Group Umrah packages (Mumbai starting at ₹68,786, Hubli starting at ₹81,786).
- Replaced static packages navigation links in header, mobile drawer, and footer.

### Fixed
- Fixed double assignment syntax error at line 1 of `/assets/js/config/translations.js`.
- Cleaned up duplicate/unused HTML file `index (1).html`.
