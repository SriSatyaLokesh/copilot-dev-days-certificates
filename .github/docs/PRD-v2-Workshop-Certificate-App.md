# Product Requirements Document (PRD)
## Workshop Certificate Web Application — Template Edition
**Version:** 2.0  
**Date:** April 11, 2026  
**Status:** Final Draft — Ready for Development  
**Author:** Satya K  

---

## 1. Executive Summary

A fully static, zero-backend, GitHub Pages-hosted web application that generates personalized, printable, and downloadable workshop completion certificates. The system is architected as a **reusable template** — all content, labels, colors, and branding are driven by JSON config files, making it deployable for any organization or workshop with zero HTML changes.

Attendees submit their data via GitHub Pull Requests. The application reads a config JSON (org/template settings) and an attendee JSON (personal data), renders a professional certificate, generates a dynamic QR code, and allows one-click PDF download — all from a single `index.html` with no server, no database, and no build step.

---

## 2. Problem Statement

Workshop organizers need a scalable, zero-cost way to issue verifiable, shareable, and printable completion certificates. Current approaches — Canva, Word, manual email — do not scale, create distribution bottlenecks, and produce certificates that cannot be verified or dynamically shared. This system solves that by making every certificate a live, scannable, permanent URL.

---

## 3. Goals

| Goal | Description |
|---|---|
| **Zero Cost** | Hosted entirely on GitHub Pages — $0/month forever |
| **Zero Backend** | No server, no database, no API, no build pipeline |
| **Reusable Template** | One repo can be forked for any org or workshop by editing only JSON files |
| **Self-Service** | Attendees submit their own data via GitHub PR |
| **Verifiable** | Every certificate has a permanent URL and a QR code linking back to it |
| **Downloadable** | One-click landscape PDF download — no print dialog required |
| **Discoverable** | Optimized for search engines (SEO) and AI answer engines (AEO) |

## 4. Non-Goals (v1)

- No user authentication or login
- No admin dashboard
- No email delivery of certificates
- No real-time certificate issuance
- No database or CMS
- No payment or access control

---

## 5. Users & Stakeholders

| Role | Description | Technical Level |
|---|---|---|
| **Workshop Organizer** | Sets up repo, edits config JSON, reviews and merges attendee PRs | Medium — comfortable with GitHub |
| **Attendee / Participant** | Forks repo, adds their JSON file, opens a PR | Low — basic GitHub literacy |
| **PR Reviewer** | Optional team member who validates JSON files before merge | Medium |
| **Certificate Viewer** | Anyone with the URL who wants to view or verify a certificate | None — browser only |
| **Future Org (Template Reuser)** | Forks this repo for a different workshop/org — edits only JSON config | Low |

---

## 6. User Stories

### 6.1 Attendee
- As an attendee, I want to submit my information via a GitHub PR so my certificate is generated automatically after merge.
- As an attendee, I want a unique URL I can share on LinkedIn or email to prove I completed the workshop.
- As an attendee, I want to download my certificate as a landscape PDF with one click.
- As an attendee, I want a QR code on my certificate so anyone can scan and verify it is real.
- As an attendee, I want the certificate to display my name, workshop title, date, organization, and a description of what I completed.

### 6.2 Organizer
- As an organizer, I want all certificate content — labels, colors, org name, logo — to be configurable from a single JSON file so I never touch HTML.
- As an organizer, I want attendees to submit PRs with a structured JSON file so I can review and approve them easily.
- As an organizer, I want the certificate page to be SEO-optimized so that googling an attendee's name and the workshop name surfaces their certificate.
- As an organizer, I want to fork this repo for future workshops and only edit the config JSON.
- As an organizer, I want a clear README that explains the entire contribution process to non-technical attendees.

### 6.3 Certificate Viewer / Verifier
- As a viewer, I want to scan the QR code on a printed certificate and be taken to the live certificate page to verify it.
- As a viewer, I want the certificate page to have proper meta tags so it previews correctly when shared on LinkedIn, Twitter, or WhatsApp.

---

## 7. Functional Requirements

### 7.1 Single-Page Application (`index.html`)

The entire application lives in one HTML file. It operates in two modes based on the URL:

| URL | Mode | Behavior |
|---|---|---|
| `yoursite.github.io/` | **Search Mode** | Shows landing page with search input |
| `yoursite.github.io/?id=jane-doe-at-gmail-com` | **Certificate Mode** | Renders the certificate for that ID |

| ID | Requirement |
|---|---|
| FR-01 | On page load, JS reads the `?id=` query parameter |
| FR-02 | If `?id=` is absent → render Search View |
| FR-03 | If `?id=` is present → render Certificate View |
| FR-04 | Both views are rendered within the same `index.html` with no page reload |

### 7.2 Config JSON (`/config/certificate.config.json`)

| ID | Requirement |
|---|---|
| FR-05 | App fetches config JSON on every page load before rendering anything |
| FR-06 | Config JSON drives: org name, org logo, org tagline, all label text, color palette, signature image, seal image, search page text |
| FR-07 | No visible text in `index.html` is hardcoded — all comes from config JSON |
| FR-08 | CSS color variables (`--cert-border`, `--cert-primary`, etc.) are set dynamically from config JSON values via JavaScript |

### 7.3 Attendee JSON (`/data/{id}.json`)

| ID | Requirement |
|---|---|
| FR-09 | Each attendee has exactly one JSON file in `/data/` |
| FR-10 | Filename follows the email sanitization convention (see Section 10) |
| FR-11 | App fetches attendee JSON only when `?id=` is present |
| FR-12 | Config and attendee JSONs are fetched in parallel via `Promise.all()` |

### 7.4 Certificate View

| ID | Requirement |
|---|---|
| FR-13 | Certificate displays: attendee name, workshop name, date, org name, org logo, description, authorized-by name, signature image, seal image |
| FR-14 | All text labels (e.g., "This is to certify that", "Date of Completion") come from config JSON |
| FR-15 | Certificate layout is landscape-oriented (A4 format) |
| FR-16 | Certificate includes a dynamically generated QR code (see FR-22 to FR-25) |
| FR-17 | Certificate includes a "Download PDF" button (not a print button) |
| FR-18 | Certificate includes a "Print" button as a secondary option |
| FR-19 | Page `<title>` is set dynamically to: `{attendee name} — {workshop name} Certificate` |
| FR-20 | All Open Graph and Twitter Card meta tags are set dynamically from config + attendee data (see Section 9) |
| FR-21 | If JSON fetch fails or required fields are missing, a clear error state is shown |

### 7.5 QR Code

| ID | Requirement |
|---|---|
| FR-22 | A QR code is generated dynamically on every certificate page load |
| FR-23 | QR code text = the full current page URL (`window.location.href`) |
| FR-24 | QR code is rendered using the `qrcode.js` library loaded from CDN |
| FR-25 | QR code is positioned in the bottom-right area of the certificate |
| FR-26 | QR code colors match the certificate color scheme (dark color from config, light = white) |
| FR-27 | QR code size: 80×80px on screen, scales correctly in PDF output |

### 7.6 PDF Download

| ID | Requirement |
|---|---|
| FR-28 | A "Download PDF" button generates a true PDF file without opening the print dialog |
| FR-29 | PDF is generated using `html2pdf.js` loaded from CDN |
| FR-30 | PDF format: A4, landscape orientation |
| FR-31 | PDF filename: `certificate-{certificate_id}.pdf` |
| FR-32 | PDF margins: 0 (certificate fills the full page) |
| FR-33 | The "Download PDF" and "Print" buttons are excluded from the PDF output |
| FR-34 | QR code is included and readable in the downloaded PDF |

### 7.7 Search View (Landing Page)

| ID | Requirement |
|---|---|
| FR-35 | Landing page shows org name, tagline, and a search input from config JSON |
| FR-36 | User can enter their registered email address |
| FR-37 | On submit, email is sanitized and converted to an ID, then URL is updated to `?id={sanitized-id}` |
| FR-38 | User can also enter a raw certificate ID directly |
| FR-39 | Search page content (headline, subtext, placeholder, button label) all come from config JSON |

### 7.8 Contribution Flow

| ID | Requirement |
|---|---|
| FR-40 | Repo includes `README.md` with full step-by-step PR submission instructions |
| FR-41 | Repo includes `/data/sample.json` as a template for contributors |
| FR-42 | Repo includes `.github/PULL_REQUEST_TEMPLATE.md` with a checklist |

---

## 8. SEO Requirements

The certificate page must be discoverable when someone googles the attendee's name + workshop name. The search view must be discoverable by the organizer's target audience.

### 8.1 Technical SEO (`index.html` `<head>`)

| ID | Requirement |
|---|---|
| SEO-01 | `<title>` tag is set dynamically: `{Name} — {Workshop} Certificate \| {Org Name}` |
| SEO-02 | `<meta name="description">` is set dynamically: `{Name} successfully completed {Workshop} on {Date}. Issued by {Org Name}.` |
| SEO-03 | `<link rel="canonical">` points to the current full URL with `?id=` param |
| SEO-04 | `<html lang="en">` is set |
| SEO-05 | Page has a single `<h1>` (the attendee's name on certificate, or the headline on search page) |
| SEO-06 | All images have descriptive `alt` attributes set from JSON values |
| SEO-07 | Page loads in under 2 seconds (lightweight HTML + CSS + 3 CDN scripts) |
| SEO-08 | `robots.txt` file in repo root allows all crawlers |
| SEO-09 | `sitemap.xml` is not required in v1 (URLs are parameterized, not path-based) |

### 8.2 Open Graph (Social Sharing)

When a certificate URL is shared on LinkedIn, WhatsApp, or Twitter, it must render a rich preview card.

| ID | Requirement |
|---|---|
| SEO-10 | `<meta property="og:title">` → `{Name}'s Certificate — {Workshop}` |
| SEO-11 | `<meta property="og:description">` → `Issued by {Org Name} on {Date}. Click to view and verify.` |
| SEO-12 | `<meta property="og:url">` → full certificate URL |
| SEO-13 | `<meta property="og:type">` → `website` |
| SEO-14 | `<meta property="og:image">` → org logo URL (or a default certificate preview image) |
| SEO-15 | `<meta property="og:site_name">` → org name from config |

### 8.3 Twitter Card

| ID | Requirement |
|---|---|
| SEO-16 | `<meta name="twitter:card">` → `summary_large_image` |
| SEO-17 | `<meta name="twitter:title">` → same as OG title |
| SEO-18 | `<meta name="twitter:description">` → same as OG description |
| SEO-19 | `<meta name="twitter:image">` → same as OG image |

---

## 9. AEO Requirements (Answer Engine Optimization)

AEO ensures AI tools — ChatGPT, Gemini, Perplexity, Claude — can correctly answer questions like *"Did Jane Doe complete the ML workshop by AI Community India?"* by reading this page.

### 9.1 Structured Data (JSON-LD)

A `<script type="application/ld+json">` block is injected dynamically by JavaScript after the certificate renders.

**Schema type: `EducationalOccupationalCredential`**

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  "name": "{Workshop Name} — Certificate of Completion",
  "description": "{Description from attendee JSON}",
  "credentialCategory": "Certificate of Completion",
  "dateCreated": "{Date from attendee JSON}",
  "url": "{Full certificate URL}",
  "recognizedBy": {
    "@type": "Organization",
    "name": "{Org Name from config}",
    "logo": "{Logo URL from config}"
  },
  "about": {
    "@type": "Person",
    "name": "{Attendee Name}",
    "email": "{Attendee Email}"
  }
}
```

| ID | Requirement |
|---|---|
| AEO-01 | JSON-LD block is injected into `<head>` dynamically after both JSONs are fetched |
| AEO-02 | Schema type is `EducationalOccupationalCredential` |
| AEO-03 | All schema fields are populated from config + attendee JSON — nothing hardcoded |
| AEO-04 | JSON-LD is valid per schema.org specification |
| AEO-05 | On the search/landing page (no `?id=`), inject an `Organization` schema for the org |
| AEO-06 | `<meta name="robots" content="index, follow">` is present |

### 9.2 Semantic HTML for AEO

| ID | Requirement |
|---|---|
| AEO-07 | Attendee name is wrapped in `<h1>` |
| AEO-08 | Workshop name is wrapped in `<h2>` |
| AEO-09 | Date is wrapped in `<time datetime="{ISO date}">` |
| AEO-10 | Org name is wrapped in a `<p>` with `itemprop="name"` inside an element with `itemscope itemtype="https://schema.org/Organization"` |
| AEO-11 | Certificate description is in a `<p>` with clear readable text |

---

## 10. Email-to-ID Convention

| Step | Input | Output |
|---|---|---|
| 1. Lowercase | `Jane.Doe@Gmail.COM` | `jane.doe@gmail.com` |
| 2. Replace `@` | `jane.doe@gmail.com` | `jane.doe-at-gmail.com` |
| 3. Replace `.` | `jane.doe-at-gmail.com` | `jane-doe-at-gmail-com` |
| 4. Replace `+` | `jane+work-at-...` | `jane-plus-work-at-...` |
| 5. Strip remaining specials | anything else | removed |

**Result:** `jane.doe@gmail.com` → `jane-doe-at-gmail-com`  
**File:** `/data/jane-doe-at-gmail-com.json`  
**URL:** `index.html?id=jane-doe-at-gmail-com`

---

## 11. Data Schemas

### 11.1 `/config/certificate.config.json`

```json
{
  "site_title": "Workshop Certificates — AI Community India",
  "org_name": "AI Community India",
  "org_logo": "assets/img/logo.png",
  "org_tagline": "Empowering the next generation of AI practitioners",
  "org_website": "https://aicommunity.in",

  "certificate": {
    "heading_label": "Certificate of Completion",
    "pre_name_text": "This is to certify that",
    "post_name_text": "has successfully completed the workshop",
    "footer_left_label": "Date of Completion",
    "footer_right_label": "Authorized By",
    "authorized_by": "Dr. Satya K, Lead Organizer",
    "signature_image": "assets/img/signature.png",
    "seal_image": "assets/img/seal.png",
    "show_qr": true,
    "show_description": true,
    "border_color": "#c8a951",
    "primary_color": "#1a2e4a",
    "accent_color": "#c8a951",
    "background_color": "#ffffff",
    "text_color": "#333333",
    "muted_color": "#777777"
  },

  "search_page": {
    "headline": "Find Your Certificate",
    "subtext": "Enter the email address you registered with to view and download your certificate of completion.",
    "input_placeholder": "your@email.com",
    "button_text": "Find My Certificate",
    "footer_note": "Having trouble? Contact us at hello@aicommunity.in"
  },

  "pdf": {
    "filename_prefix": "certificate",
    "format": "a4",
    "orientation": "landscape",
    "margin": 0
  },

  "seo": {
    "default_og_image": "assets/img/og-default.png",
    "twitter_handle": "@aicommunityIN"
  },

  "meta": {
    "template_version": "2.0",
    "last_updated": "April 2026"
  }
}
```

### 11.2 `/data/{id}.json`

```json
{
  "certificate_id": "jane-doe-at-gmail-com",
  "name": "Jane Doe",
  "email": "jane.doe@gmail.com",
  "workshop": "Introduction to Machine Learning",
  "date": "April 5, 2026",
  "date_iso": "2026-04-05",
  "description": "Completed 16 hours of hands-on training covering supervised learning, neural network fundamentals, and model evaluation techniques."
}
```

**Field Definitions:**

| Field | Type | Required | Description |
|---|---|---|---|
| `certificate_id` | string | ✅ | Must exactly match the filename (without `.json`) |
| `name` | string | ✅ | Full name as it appears on certificate |
| `email` | string | ✅ | Registered email (for reference/verification) |
| `workshop` | string | ✅ | Exact workshop title |
| `date` | string | ✅ | Human-readable date: `April 5, 2026` |
| `date_iso` | string | ✅ | ISO 8601 date for schema.org `<time>` tag: `2026-04-05` |
| `description` | string | ❌ | One to two sentences of what was completed |

---

## 12. Design Requirements

### 12.1 Certificate Layout (Landscape A4)
- Orientation: Landscape (297mm × 210mm)
- Style: Professional, elegant, minimal — deep navy + gold default palette
- Structure (top to bottom, center-aligned):
  - Org logo + org name
  - Decorative divider line
  - "This is to certify that" label (from config)
  - Attendee name (largest text on page)
  - "has successfully completed" label (from config)
  - Workshop name (italic, accent color)
  - Description paragraph (optional)
  - Three-column footer: [Date block] [Seal/Logo] [Signature block]
  - QR code: bottom-right corner
  - Certificate ID: bottom-center, small muted text
- Fonts: `Playfair Display` (headings), `Lato` (body) — Google Fonts CDN

### 12.2 Screen View
- Certificate centered on a neutral gray background
- Floating action bar above certificate: "Download PDF" (primary) + "Print" (secondary)
- Both buttons hidden in PDF/print output

### 12.3 Print / PDF Output
- `@page { size: A4 landscape; margin: 0; }`
- Certificate fills 100% of page — no white margin gaps
- All buttons and browser UI hidden via `@media print`
- QR code must be crisp and scannable in print output

### 12.4 Search / Landing Page
- Clean, centered card layout
- Org logo + headline + subtext from config
- Email input + submit button
- Footer note from config
- No certificate-specific styling

---

## 13. Repo as Reusable Template

To reuse this repo for a different organization or workshop:

1. Fork the repository
2. Edit `/config/certificate.config.json` — change org name, colors, labels, logo paths, SEO handles
3. Replace `/assets/img/logo.png`, `signature.png`, `seal.png` with your org's assets
4. Drop attendee JSON files in `/data/`
5. Enable GitHub Pages on the fork
6. Done — zero HTML edits required

---

## 14. Success Metrics

| Metric | Target |
|---|---|
| Certificate page load time | < 2 seconds |
| PDF download works in Chrome, Firefox, Safari, Edge | 100% |
| QR code scans correctly on printed output | 100% |
| Google indexes certificate pages within 7 days | Verified via Search Console |
| Zero infrastructure cost | $0/month |
| Repo can be reused for a new org with only JSON edits | Verified by a second org |

---

## 15. Milestones

| # | Deliverable | Owner | Target |
|---|---|---|---|
| M1 | `index.html` skeleton + both JSON schemas finalized | Dev | Day 1 |
| M2 | Certificate render logic + config-driven CSS variables | Dev | Day 2 |
| M3 | QR code + PDF download wired up | Dev | Day 3 |
| M4 | SEO meta tags + JSON-LD structured data | Dev | Day 3 |
| M5 | Search view + email sanitization | Dev | Day 4 |
| M6 | GitHub Pages live + README + PR template | Dev | Day 5 |
| M7 | First real attendee PR merged and tested | Organizer | Week 2 |

---

*Document Owner: Satya K, Lead Engineer*  
*Status: Approved for development*
