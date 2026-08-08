# Enterprise Frontend Architecture Guide

This project is designed as a long-term enterprise foundation, not merely as a modular static website. Every architectural decision is structured to minimize migration effort to modern JS frameworks (React, Next.js, Astro, Vue, Nuxt) and backend API integrations (CMS, booking engine, CRM, payment gateway).

## 1. Service-Oriented Javascript Architecture
All logic is split into standalone **Services** under `/assets/js/services/`. These services are written using standard ES Modules and operate as independent, reusable APIs:
- **`i18n.js` (Localization Service)**: Operates independently of the DOM. Translates strings dynamically using `applyAllTranslations(translations[currentLang])`. Can be easily migrated to react-i18next or next-i18n.
- **`theme.js` (Theme State Service)**: Abstracted interface managing theme classes (`light` vs. `dark`) and persisting selections in `localStorage`.
- **`audio.js` (Media Service)**: Handles audio playback lifecycle, making it trivial to swap HTML5 Audio with advanced custom player components.
- **`analytics.js` (Telemetry Service)**: Fully configuration-driven. Provides a generic `trackEvent` interface. Swapping from Google Analytics to Segment, Mixpanel, or custom HTTP loggers is a single line change in this file.

## 2. Configuration-Driven Components
To support future CMS (Content Management System) integration, data layers are decoupled from templates:
- **`translations.js`**: Key-value JSON localization dictionary. Can be uploaded directly to headless CMS translation managers.
- **`branches.data.js`**: Structured array representing branch offices. If a booking backend or admin dashboard is added, this file can be fetched dynamically from an API endpoint (`fetch('/api/branches')`) rather than hardcoding.

## 3. UI Controller Bindings
All click, input, and scroll event listeners are bound dynamically in `main.js` using `addEventListener`, completely eliminating inline `onclick` attributes in HTML markup.
- This clean separation ensures that the HTML template remains purely declarative, matching the component structure of React, Astro, or Vue.
