# Production Deployment & Security Guide

This document details the configuration for deploying the NOOR-E-HARAM website to production servers (e.g. Netlify) and its enterprise security configurations.

## 1. Production Deployment on Netlify
The project is fully pre-configured for automated Git-triggered deployments on Netlify.
- **Publish Directory**: `.` (Root directory)
- **Production Build Command**: None required (Static deployment)
- **Deployment Config File**: [netlify.toml](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/netlify.toml)

## 2. Security Headers (HTTP Headers)
The following headers are served on every request, protecting the website from common browser exploits:
- **`Content-Security-Policy`**: Enforces strict content loading rules (CSP). Limits scripts, styles, frames, and connect boundaries to trusted domains (`self`, Google Fonts, Google Analytics, Web3Forms API).
- **`X-Frame-Options: SAMEORIGIN`**: Protects against clickjacking attacks.
- **`X-Content-Type-Options: nosniff`**: Forces strict MIME type checking, preventing MIME sniffing exploits.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Limits referrer path exposure to external sites.
- **`Strict-Transport-Security`**: Enforces SSL (HTTPS) for 1 year (`max-age=31536000`).

## 3. Caching & Edge Optimization
We use progressive caching values:
- **HTML files**: `public, max-age=3600, must-revalidate` (validates updates on the CDN edge every hour).
- **CSS / JS modules**: `public, max-age=31536000, immutable` (highly cacheable on client browser since paths are versioned).
- **Images / Icons**: `public, max-age=31536000, immutable` (permanently cached on browser edge).
