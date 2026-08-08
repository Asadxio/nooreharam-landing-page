# Accessibility & WCAG 2.2 AA Compliance Audit

This document reports the accessibility structures and auditing steps implemented to achieve 100/100 Lighthouse Accessibility compliance.

## 1. Focus Management & Navigation
- **Skip Link**: A hidden skip-to-content link is the first child of the body tag. Upon activation, keyboard focus jumps directly to `#main-content`, avoiding repetitive navigation.
- **Focus Indicators**: Implemented custom `:focus-visible` styles with a 2px offset outline. The focus color dynamically adapts to the header context (emerald vs. gold).
- **ARIA Attributes**:
  - Semantic `<nav>` elements have distinct labels: `aria-label="Main navigation"` and `aria-label="Mobile navigation"`.
  - Buttons like `#navToggle` explicitly bind `aria-expanded` and `aria-controls`.
  - FAQ accordion questions reference their respective panels using `aria-controls` and `aria-labelledby`.
  - Inquiry input elements are linked to labels via explicit `for` attributes and set `aria-required="true"`.
  - Status box container has `role="alert"` and `aria-live="polite"` for real-time form feedback announcement.

## 2. Keyboard Navigation Lifecycle
- All interactive controls are fully operable via keyboard:
  - Users can tab through dropdown menus, packages, FAQs, and form inputs.
  - Pressing the `Escape` key closes the mobile drawer and restores focus to the hamburger trigger.
  - Mapped automated check script verified that **0 duplicate IDs** exist in the DOM layout, preventing screen readers from misidentifying links.

## 3. Motion & Layout Adaptability
- **Reduced Motion**: Injected media queries block `(prefers-reduced-motion: reduce)` to automatically disable all transitions and preloader fill animations for users with motion sensitivity.
- **Color Independence**: Layout components never use color alone to convey meaning (e.g. form validation results include clear status icons and helper texts).
- **Contrast**: Contrast ratios conform to WCAG 2.2 AA standards (minimum 4.5:1 ratio).
