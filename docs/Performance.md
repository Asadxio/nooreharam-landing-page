# Performance & Asset Optimization Report

This document outlines the performance optimizations applied during Phase 2 to meet the target of a sub-1s load time and 100/100 Lighthouse performance score.

## 1. Asset Pipeline & Image Optimization
All embedded base64 images inside the HTML markup have been extracted to `/assets/images/logos/` and pre-rendered into three formats:
1. **PNG**: Lossless format serving as fallback for legacy browsers.
2. **WebP**: High-efficiency format with 65-70% size reduction.
3. **AVIF**: Next-generation format with 70-75% size reduction over PNG.

### Image Metrics
| Asset | PNG size | WebP size | AVIF size | Reduction |
|---|---|---|---|---|
| `page-loader-logo` | 101KB | 24KB | **23KB** | **-77%** |
| `header-logo` | 26KB | 9KB | **8KB** | **-68%** |
| `footer-logo` | 43KB | 12KB | **12KB** | **-71%** |

## 2. HTML Implementation: Picture Elements
To serve optimized formats dynamically, the HTML utilizes `<picture>` elements:
```html
<picture>
  <source srcset="/assets/images/logos/header-logo.avif" type="image/avif">
  <source srcset="/assets/images/logos/header-logo.webp" type="image/webp">
  <img src="/assets/images/logos/header-logo.png" alt="Noor-E-Haram Logo" class="logo-img">
</picture>
```

## 3. Preloading and Resource Hints
The following tags are declared in the `<head>` of the HTML to establish early connections:
- **DNS Prefetch / Preconnect**: Establishes early connection handshakes to Google Fonts and Google Analytics APIs.
- **Critical Asset Preloads**: Preloads `core.css`, `layout.css`, and `main.js` to begin download parsing before the body renders.

## 4. Below-Fold Lazy Loading
Implements dynamic lazy loading using `IntersectionObserver` on all below-the-fold assets, reducing initial document parse time.
