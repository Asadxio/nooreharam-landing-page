# NOOR-E-HARAM — OPEN ITEMS & PLACEHOLDERS FOR OWNER

This document tracks all items where official data or scholar confirmation is required from the business owner. Per Golden Rule 1 ("No fabrication"), the code strictly uses clean fallbacks or placeholders for these fields rather than inventing unverified legal or business details.

---

## 1. Legal Entity & Compliance Credentials (Section 0)

| Field | Current Placeholder | Description / What Owner Must Provide |
| :--- | :--- | :--- |
| `LEGAL_ENTITY_NAME` | `[[LEGAL_ENTITY_NAME]]` | Exact registered legal business name (e.g., *Noor-E-Haram Travels Pvt Ltd* or sole proprietorship name). |
| `CIN_OR_UDYAM` | `[[CIN_OR_UDYAM]]` | Corporate Identification Number (CIN) or MSME Udyam Registration Number. |
| `GSTIN` | `[[GSTIN]]` | 15-digit Goods and Services Tax Identification Number for Karnataka / India. |
| `PAN_COMPANY` | `[[PAN_COMPANY]]` | Company / Business PAN (optional for public display, used for invoicing). |
| `HAJ_UMRAH_REG_NO` | `[[HAJ_UMRAH_REG_NO]]` | Ministry of Minority Affairs / Haj Committee of India PTO (Private Tour Operator) registration number & category. |
| `NUSUK_OR_SAUDI_LICENCE` | `[[NUSUK_OR_SAUDI_LICENCE]]` | Saudi Ministry of Hajj & Umrah / Nusuk portal license number (if directly licensed). |
| `IATA_TAAI_OTHER` | `[[IATA_TAAI_OTHER]]` | IATA / TAAI / TAFI / AIHUT partner accreditation number(s). |
| `OFFICIAL_EMAIL` | `info@nooreharam.com` | **CRITICAL PRE-DEPLOY NOTE:** The mailbox `info@nooreharam.com` must exist and be active on your domain email host before going live. A client-side fallback flag `window.NH_USE_FALLBACK_MAILBOX = true;` is configured in `assets/js/services/forms.js` to route inquiries to `nooreharamindia@gmail.com` if domain email setup is pending. |
| `GRIEVANCE_OFFICER` | `[[GRIEVANCE_OFFICER]]` | Name, official phone, and email of Grievance Officer designated under Digital Personal Data Protection Act, 2023 and Consumer Protection E-Commerce Rules. |

---

## 2. Operations, Social Proof & Branch Data (Section 0 & 1)

| Field | Current Status / Placeholder | Required Input from Owner |
| :--- | :--- | :--- |
| `BRANCH_LIST` | Hubli Head Office verified. Regional branches pending. | Full street address, landline/mobile, Google Maps CID/link, operating hours for each real branch office. |
| `OFFICE_HOURS` | `[[OFFICE_HOURS]]` | Official working days and operating hours for Hubli Head Office. |
| `FOUNDER_NAME` | `[[FOUNDER_NAME]]` | Founding leadership / proprietor name for About page. |
| `GOOGLE_RATING` | Rating & review count link to live Google Business listing (`cid=9110780512781257798`). Fake aggregateRating removed from schema. | Exact manual snapshot of Google Maps rating and review count from Google Business Profile. Rating widget displays only verified link until filled. |
| `PILGRIMS_SERVED` | General truthful wording applied. | Verified audit count of pilgrims served (e.g., "Over 5,000+ pilgrims served"). |
| `PAYMENT_DETAILS` | Bank transfer policy set to "Pay only to company account". | Official Beneficiary Account Name, Bank Name, Account Number, IFSC, and official Company UPI VPA for fraud prevention block. |
| `CANCELLATION_SLAB` | Slabs in `/refund-and-cancellation-policy/` displayed with visible "To be confirmed by management" notice and `[[PLACEHOLDER]]` values. | Owner confirmation of exact percentage deduction slabs based on days before departure. |
| `REFUND_PROCESSING_DAYS` | `[[REFUND_PROCESSING_DAYS]]` | Operational business days required to process bank refunds. |

---

## 3. Operational & Route Verifications (`[[VERIFY]]`)

| Item | Context | Status / Action |
| :--- | :--- | :--- |
| **Bangalore Direct Flight** | Direct Bangalore to Jeddah flight on Saudia / IndiGo | Confirmed in schedule. Owner to verify if flight is non-stop direct or 1-stop via Mumbai/Delhi. |
| **Hubli / Goa Escorted Route** | Travel routing for North Karnataka pilgrims | Confirm ground transfer route (Hubli to Goa Airport vs Hubli to Mumbai/Bangalore). |
| **Hajj 2027 Route** | Hajj booking mechanism | Confirm whether NOOR-E-HARAM operates private quota seats directly or assists pilgrims via Haj Committee of India / Nusuk Hajj platform. |
| **Fixed Price Guarantee** | Pricing statement | Confirmed: "Starting prices based on quad sharing. Your final quote is fixed in writing at booking confirmation and will not change after payment." |
| **Women Travel / Mahram Rules** | Women Umrah group travel guidance | Rule stated per Saudi Ministry regulations with prominent caveat: *"Rules change: confirm with our team / official Nusuk source before booking"* and link to `https://www.nusuk.sa`. Removed unverified date stamp. |

---

## 4. Religious & Islamic Accuracy (`[[SCHOLAR_REVIEW]]`)

| Topic / Site | Issue Identified | Action Taken in Code |
| :--- | :--- | :--- |
| **Hazrat Fatima Binte Hussain (RA) Ka Ghar** | Previously described as "granddaughter of Imam al-Husayn". She is the **DAUGHTER of Imam al-Husayn (RA)** (and revered scholar of the Tabi'een). | Corrected description everywhere in code to: *"Residence of the noble daughter of Imam al-Husayn (RA) and esteemed scholar of the Tabi'een"*. Flagged for final scholar authentication. |
| **Unverified / Doubtful Ziyarat Sites** | 1. Khaake Shifa Ki Jagah<br>2. Qadame Rasool Ki Nishani<br>3. Wo Jagah Jaha Laati Roshan Hua<br>4. Ghaar Ka Wo Hissa Jo Nabi ﷺ Ke Liye Khul Gaya Tha<br>5. Imam Masjide Jum'ah Ka Ghar<br>6. Beere Raees | Gated with `<!-- [SCHOLAR_REVIEW] -->`. Hidden from public view until authenticated by a certified Islamic scholar. |
| **Ziyarat Adab Note** | Spiritual guidance for visiting sacred landmarks | Standard Sunnah adab added: Ziyarat is for remembering Islamic history, reflecting on the Prophet's ﷺ life, and sending Salawat; seeking fulfillment of needs or du'a from graves is strictly avoided. |
| **Ramadan Umrah Hadith** | Hadith wording | Accurately cited from Sahih al-Bukhari & Sahih Muslim: *"Umrah in Ramadan is equal to Hajj with me in reward, but does not replace the fardh obligation of Hajj."* |

---

## 5. Media & Assets Needed (`[[IMAGE_NEEDED]]`)

| Asset Description | Target Location | Recommended Specification |
| :--- | :--- | :--- |
| **Hubli Head Office Exterior / Reception** | `/about/`, `/branches/`, `/contact/` | High-res 1200x800 WebP photo of actual office with Noor-E-Haram signage. |
| **Director / Scholars Team Photos** | `/about/`, `/trust/` | Professional headshots of verified leadership and scholar guides. |
| **Official Registration / Certificate Scans** | `/trust/` | Redacted scan of GST, Udyam, or Haj Committee registration certificate. |
