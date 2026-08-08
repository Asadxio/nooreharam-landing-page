# Packages & Pricing Configuration Guide

This guide explains how to manage, edit, add, and remove packages and prices on the Noor-E-Haram enterprise website.

---

## 1. Directory Structure

The system uses a configuration-driven architecture located in:
* Configuration File: [`/assets/js/config/packages.config.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/config/packages.config.js)
* Rendering Service: [`/assets/js/services/i18n.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/services/i18n.js)
* Calculation Service: [`/assets/js/services/forms.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/services/forms.js)

---

## 2. Packages Schema Structure

The configuration exports `PACKAGE_CONFIG`, structured as follows:

```javascript
export const PACKAGE_CONFIG = {
  version: "2.1.0",
  lastUpdated: "2026-07-27",
  currency: "INR",
  packages: [
    {
      id: "hajj-2027",                // Unique ID (required)
      nameKey: "pkg.hajj.name",       // i18n Translation key for package name
      typeKey: "pkg.hajj.type",       // i18n Translation key for package category type
      status: "active",               // Status: 'active', 'upcoming', 'sold_out', 'hidden'
      bookingOpen: "2026-06-01",      // Date window open
      bookingClose: "2027-04-30",     // Date window close
      travelStart: "2027-05-15",
      travelEnd: "2027-06-15",
      badge: "2027",                  // Optional badge text (e.g. 'Featured', '2027')
      featuresKey: "pkg.hajj.features",
      variants: [                     // Array of pricing categories
        { id: "std", name: "Standard", price: 699786, isStarting: true }
      ],
      waQuery: "Hajj 2027 Package"    // Text appended to WhatsApp inquiries
    }
  ]
};
```

### Departures Mapping (For Group Umrah)
If a package has multiple departure cities with separate dates and prices, use the `departures` property instead of `variants`:

```javascript
      departures: [
        {
          city: "Mumbai",
          departureDate: "2026-12-01",
          returnDate: "2026-12-06",
          variants: [
            { id: "std", name: "Standard", price: 68786, isStarting: true }
          ]
        }
      ]
```

---

## 3. How to Update Prices or Dates

To update any package price or schedule date:
1. Open [`packages.config.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/config/packages.config.js).
2. Locate the package object using its `id`.
3. Update the `price` number inside the `variants` array or the departure travel dates.
4. Save the file. The UI cards, pricing tables, calculator, schema.org JSON-LD microdata, and WhatsApp inquiry links will update automatically.

---

## 4. How to Temporarily Hide a Package

To remove a package card from the UI without deleting its code:
1. Open [`packages.config.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/config/packages.config.js).
2. Find the package ID.
3. Change its `status` property to `"hidden"`:
   ```javascript
   status: "hidden"
   ```
4. Save the file. The card will disappear from the packages section.

---

## 5. Adding a New Package

1. Create translation keys inside [`/assets/js/config/translations.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/config/translations.js) for all supported languages.
2. Open [`packages.config.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/config/packages.config.js) and append the new package structure to the `packages` list.
3. Update the dynamic rendering mapping inside [`/assets/js/services/i18n.js`](file:///c:/Users/xioas/OneDrive/Desktop/LANDING%20PAGE%20NOOEHARAM/assets/js/services/i18n.js) `renderPackageCards` function if custom badges or styles are needed.
