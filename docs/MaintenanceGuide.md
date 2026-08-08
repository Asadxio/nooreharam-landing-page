# Maintenance & Future Roadmap Guide

This guide provides guidelines for maintaining the project, updating content, and migrating to modern JS frameworks or integrating backend databases.

## 1. Updating Content
Because the codebase is configuration-driven, content changes do not require refactoring HTML templates:
- **Translating Text / Adding Languages**: Open `/assets/js/config/translations.js`. Add or modify the keys under each language object (e.g. `en`, `ur`, `ar`, `kn`). If you add a new language (e.g. `hi`), define its keys, add it to `labels` in `i18n.js`, and add it to the language dropdown selector in the HTML.
- **Updating Branch Offices**: Open `/assets/js/config/branches.data.js`. Modify or append branch objects to the `branchesData` array. The locator widget will dynamically refresh the dropdowns and search filters.
- **Updating Package Prices**: Prices are declared in the HTML package cards and the JSON-LD schema makesOffer. Update both locations to keep data in sync.

## 2. Framework Migration Roadmap
Because the code is split into pure ES Module services and templates, migrating to modern frameworks is highly streamlined:
- **Next.js / Astro**: 
  - Place `/assets/css/` into the global styles or CSS modules folder.
  - The static data in `/assets/js/config/` can be read directly by static props or server-side fetch calls.
  - The logic inside `/assets/js/services/` (e.g., calculations, wizard logic) can be imported directly into React components or custom hooks (e.g., `useWizard`, `useTheme`).
- **Astro Componentization**: Move each section (Hero, Packages, Branches) to its own `.astro` component. Import stylesheets using standard Astro layout configurations.

## 3. Backend Integration (CMS / Booking / CRM)
- **Headless CMS (Strapi, Contentful)**: Replace the local file import in `main.js`:
  `import { branchesData } from './config/branches.data.js';`
  with an async fetch call to your CMS endpoint:
  `const branchesData = await fetch('https://your-cms.api/branches').then(r => r.json());`
- **CRM Integration**: The `analytics.js` service is prepared to log telemetry. Swap the tracking logic inside `trackEvent` to post events directly to your CRM/DB.
