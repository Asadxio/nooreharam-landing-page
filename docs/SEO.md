# SEO & Schema Metadata Specification

This document details the expanded Search Engine Optimization (SEO) architecture implemented in Phase 2.

## 1. Multi-Schema JSON-LD Structure
The structured metadata is embedded as a single JSON-LD array containing three schemas:
1. **`TravelAgency`**:
   - Matches address, phone, price range, and social profiles.
   - Contains **GeoCoordinates** (Latitude: 15.3524, Longitude: 75.1479) for Hubli, Karnataka.
   - Declares **AggregateRating** based on testimonials (4.9/5 stars out of 128 reviews).
   - Maps opening hours (`openingHoursSpecification`) and service areas (`areaServed`: Karnataka, Kerala, India).
2. **`BreadcrumbList`**:
   - Maps internal linking structure: Home (`/`), Packages (`/#packages`), and Branches (`/#branches`).
   - Improves search engine crawlability and enables rich snippets in SERP results.
3. **`FAQPage`**:
   - Fully maps the 8 frequently asked questions from the accordion widget.
   - Directly indexes the question and acceptedAnswer strings, allowing Google to display rich accordion snippets in search results.

## 2. SEO Best Practices
- **Logical Headings**: Clean heading structure beginning with a single `<h1>` (`NOOR-E-HARAM`).
- **Canonical URLs**: Canonical link tags point to the primary domain `https://www.nooreharam.com/`.
- **Descriptive Titles & Meta**: Mapped within recommended length thresholds (Title <60 chars, Meta Description <160 chars).
