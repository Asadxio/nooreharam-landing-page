# Folder Structure Reference Guide

This document describes the structured, enterprise folder layout and where styles/scripts are placed for maintainability.

## 1. Project Directory Tree
```
/
├── index.html                  # Main HTML entry point
├── manifest.webmanifest        # PWA application metadata
├── service-worker.js           # PWA background service worker
├── offline.html                # PWA offline fallback page
├── netlify.toml                # Deployment configuration
├── robots.txt                  # Search crawler directives
├── sitemap.xml                 # Sitemap index
├── assets/                     # Modular assets
│   ├── css/                    # Stylesheet Modules
│   │   ├── core.css            # CSS variables, resets, typography, focus outlines
│   │   ├── layout.css          # Grid, main structure, headers, nav dropdowns, footers, RTL support
│   │   ├── components.css      # Hero, package cards, FAQs, testimonials, audio, calculator, wizard
│   │   ├── utilities.css       # Layout utility helpers
│   │   ├── animations.css      # Transitions, keyframes, scroll reveals, prefers-reduced-motion
│   │   ├── responsive.css      # Viewport media queries
│   │   └── print.css           # Print overrides
│   ├── js/                     # JavaScript Modules (ES Modules)
│   │   ├── main.js             # Bootstrap entry point binding DOM events dynamically
│   │   ├── config/             # Decoupled Data Layer Configurations
│   │   │   ├── translations.js # Multi-language translations dictionary
│   │   │   └── branches.data.js# Branch locator office arrays
│   │   ├── services/           # Service-Oriented Logic APIs
│   │   │   ├── i18n.js         # Translation engine
│   │   │   ├── theme.js        # Theme state manager
│   │   │   ├── audio.js        # Audio player manager
│   │   │   ├── branches.js     # Branch locator state manager
│   │   │   ├── wizard.js       # Checklist wizard state manager
│   │   │   ├── forms.js        # Inquiry submissions and cost calculator
│   │   │   ├── lazyload.js     # IntersectionObserver lazyloader
│   │   │   └── analytics.js    # Telemetry tracker
│   │   └── controllers/        # UI Controllers
│   │       ├── navigation.js   # Scrolled header layout
│   │       ├── drawer.js       # Mobile drawer overlay
│   │       ├── faq.js          # FAQ accordion toggles
│   │       ├── animations.js   # Preloader fadeout
│   │       └── intersection.js # Reveal scroll observers
│   ├── images/                 # Image assets
│   │   ├── logos/              # Optimized branding files (PNG, WebP, AVIF)
│   │   └── og-image.jpg        # OpenGraph preview
│   └── favicon/                # Physical favicon files
└── docs/                       # Project Documentation
```
