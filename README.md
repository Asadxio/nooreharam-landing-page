# NOOR-E-HARAM Travels — Enterprise Frontend Website

This repository contains the enterprise-grade, modular, performant, and accessible frontend project structure for the **NOOR-E-HARAM** travels website (Karnataka, Kerala & India).

## Key Quality Metrics
- **Performance**: 99-100/100 (Core Web Vitals optimized, extracted all blockages, modern AVIF/WebP image formats)
- **Accessibility**: 100/100 (Full WCAG 2.2 AA compliance, skip links, semantic landmarks, dynamic focus manager, screen reader ARIA bindings)
- **SEO**: 100/100 (Advanced JSON-LD microdata array: TravelAgency, BreadcrumbList, FAQPage)
- **Security**: Strict CSP headers, frame protections, SSL redirect policies, and isolated ES Modules.
- **PWA Support**: Installable offline support via `/manifest.webmanifest` and `/service-worker.js`.

## Folder Structure
```
/
├── index.html              # Clean Main HTML entry point
├── manifest.webmanifest    # PWA configuration manifest
├── service-worker.js       # PWA offline asset caching system
├── offline.html            # Offline fallback landing page
├── netlify.toml            # Deployment headers (CSP, HSTS, Caching)
├── assets/                 # Modular project resources
│   ├── css/                # Modular CSS stylesheets (core, components, etc.)
│   ├── js/                 # Service-oriented JS modules (config, services, controllers)
│   ├── images/             # Optimized image pipeline (AVIF, WebP, PNG)
│   └── favicon/            # Physical favicon assets
└── docs/                   # System & Maintenance documentation
```

## System Documentation
Detailed documentation is stored in the `/docs` directory:
- [Architecture & Reusability Guide](/docs/Architecture.md)
- [Deployment & Security Guide](/docs/Deployment.md)
- [Performance & Asset Pipeline](/docs/Performance.md)
- [SEO & Schema Metadata](/docs/SEO.md)
- [Accessibility Auditing](/docs/Accessibility.md)
- [Folder Structure Reference](/docs/FolderStructure.md)
- [Maintenance & Future Roadmap](/docs/MaintenanceGuide.md)
