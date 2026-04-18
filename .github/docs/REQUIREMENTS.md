# Requirements — Workshop Certificate App (Template Edition)

**Version:** 1.0  
**Source:** PRD v2 + TRD v2 (April 11, 2026)  
**Total v1 Requirements:** 42  
**Deferred to v2:** 8  

---

## v1 Requirements

### APP — Core SPA Routing & Views

- [ ] **APP-01**: User visits `/` (no `?id=`) and sees the Search/Landing view
- [ ] **APP-02**: User visits `/?id={id}` and sees the Certificate view for that ID
- [ ] **APP-03**: All views (search, certificate, error, loading) render within the same `index.html` with no page reload
- [ ] **APP-04**: User sees a loading state while data is being fetched
- [ ] **APP-05**: User sees a clear error state with the attempted ID when a certificate cannot be found

### CFG — Config-Driven System

- [ ] **CFG-01**: App fetches `config/certificate.config.json` on every page load before rendering anything
- [ ] **CFG-02**: All visible text (labels, headlines, button text, footer notes) comes from config JSON — nothing hardcoded in HTML
- [ ] **CFG-03**: CSS color variables (`--cert-border`, `--cert-primary`, etc.) are set dynamically from config JSON values via JavaScript
- [ ] **CFG-04**: Config JSON drives: org name, org logo, org tagline, all label text, color palette, signature image, seal image, search page text, PDF settings, SEO settings

### DATA — Attendee Data

- [ ] **DATA-01**: Each attendee has exactly one JSON file at `/data/{id}.json`
- [ ] **DATA-02**: Filename follows the email sanitization convention: `jane.doe@gmail.com` → `jane-doe-at-gmail-com.json`
- [ ] **DATA-03**: Config and attendee JSONs are fetched in parallel via `Promise.all()`
- [ ] **DATA-04**: App validates required fields (`certificate_id`, `name`, `email`, `workshop`, `date`, `date_iso`) and shows error if any are missing

### CERT — Certificate Rendering

- [ ] **CERT-01**: Certificate displays: attendee name, workshop title, date, org name, org logo, description (optional), authorized-by name, signature image, seal image
- [ ] **CERT-02**: All text labels come from config JSON (e.g., "This is to certify that", "Date of Completion", "Authorized By")
- [ ] **CERT-03**: Certificate layout is landscape-oriented (A4 format: 297mm × 210mm)
- [ ] **CERT-04**: Certificate uses `Playfair Display` (headings) and `Lato` (body) from Google Fonts CDN
- [ ] **CERT-05**: Description field is shown/hidden based on `show_description` config flag and whether attendee JSON has a description
- [ ] **CERT-06**: Certificate ID is displayed as small muted text at the bottom
- [ ] **CERT-07**: Org logo, seal, and signature images degrade gracefully if they 404 (hidden, cert still renders)

### QR — QR Code

- [ ] **QR-01**: A QR code is generated dynamically on certificate page load using `qrcode.js` from CDN
- [ ] **QR-02**: QR code encodes the full current page URL (`window.location.href`)
- [ ] **QR-03**: QR code is positioned in the bottom-right corner of the certificate
- [ ] **QR-04**: QR code colors use `primary_color` from config (dark) and white (light)
- [ ] **QR-05**: QR code renders at 80×80px on screen and is shown/hidden via `show_qr` config flag
- [ ] **QR-06**: QR code uses high error correction level (H) so it remains scannable when printed

### PDF — PDF Download

- [ ] **PDF-01**: "Download PDF" button generates a landscape A4 PDF without opening the print dialog
- [ ] **PDF-02**: PDF is generated using `html2pdf.js` loaded from CDN
- [ ] **PDF-03**: PDF filename is `certificate-{certificate_id}.pdf`
- [ ] **PDF-04**: PDF has zero margin (certificate fills full page)
- [ ] **PDF-05**: "Download PDF" and "Print" buttons are excluded from the PDF output
- [ ] **PDF-06**: QR code is included and readable in the downloaded PDF

### SEARCH — Search / Landing Page

- [ ] **SEARCH-01**: Landing page shows org name, org logo, headline, subtext, and footer note — all from config JSON
- [ ] **SEARCH-02**: User can enter their registered email address in the search input
- [ ] **SEARCH-03**: On submit, email is sanitized and converted to a certificate ID, then URL is updated to `?id={id}`
- [ ] **SEARCH-04**: User can also enter a raw certificate ID directly (bypasses email sanitization)
- [ ] **SEARCH-05**: Search submits on button click and on Enter key press

### SEO — Search Engine & Social Optimization

- [ ] **SEO-01**: `<title>`, `<meta description>`, and `<link rel="canonical">` are set dynamically from config + attendee data
- [ ] **SEO-02**: Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `og:type`) are set dynamically
- [ ] **SEO-03**: Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`) are set dynamically
- [ ] **SEO-04**: `robots.txt` in repo root allows all crawlers

### AEO — Answer Engine Optimization (Structured Data)

- [ ] **AEO-01**: A `<script type="application/ld+json">` block with `EducationalOccupationalCredential` schema is injected into `<head>` by JS after certificate data is loaded
- [ ] **AEO-02**: All JSON-LD fields are populated from config + attendee JSON — nothing hardcoded
- [ ] **AEO-03**: On the search/landing page, an `Organization` JSON-LD schema is injected instead
- [ ] **AEO-04**: Semantic HTML: attendee name in `<h1>`, workshop in `<h2>`, date in `<time datetime="...">`, org name with `itemprop="name"`

### CONTRIB — Contribution & Repo Setup

- [ ] **CONTRIB-01**: `/data/sample.json` exists as a template for contributors
- [ ] **CONTRIB-02**: `.github/PULL_REQUEST_TEMPLATE.md` exists with submission checklist and filename generation instructions
- [ ] **CONTRIB-03**: `README.md` with full step-by-step PR submission instructions for non-technical attendees

---

## v2 Requirements (Deferred)

| ID | Feature | Why Deferred |
|---|---|---|
| V2-01 | GitHub Actions JSON validator for PRs | Adds CI complexity; organizer review is sufficient for v1 |
| V2-02 | Certificate index / gallery page | Requires build step or GitHub Actions to enumerate all `/data/` files |
| V2-03 | Multiple workshops per person | Requires schema extension and UI changes |
| V2-04 | Opaque ID mode (non-email IDs) | Nice-to-have privacy option; email IDs are fine for initial orgs |
| V2-05 | Per-workshop design via multiple config files | Config keyed by workshop ID; overkill for v1 |
| V2-06 | Expiry / validity period field | `valid_until` in attendee JSON |
| V2-07 | `sitemap.xml` generation | URLs are parameterized, not path-based; low priority for v1 |
| V2-08 | Analytics integration (Plausible/Fathom) | Privacy-first, but deferred until orgs ask for it |

---

## Out of Scope (Explicit)

| Item | Reason |
|---|---|
| Clean URL paths (`/john-doe`) | GitHub Pages 404 redirect trick breaks OG scraper for social sharing previews — critical requirement conflicts |
| User authentication / login | Certificates are public and verifiable by URL; no auth needed |
| Admin dashboard | Organizer workflow is GitHub PRs; no separate UI needed |
| Email delivery of certificates | Out of stated goals; attendees get their own URL |
| Real-time issuance | PR-merge workflow is intentional; no automation needed |
| Database or CMS | Static JSON files are the database |
| Payment or access control | All certificates are free and public |


---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| APP-01 | Phase 04: Search & SPA Routing | Pending |
| APP-02 | Phase 02: Certificate Rendering | Pending |
| APP-03 | Phase 01: Scaffold & Config System | Pending |
| APP-04 | Phase 01: Scaffold & Config System | Pending |
| APP-05 | Phase 02: Certificate Rendering | Pending |
| CFG-01 | Phase 01: Scaffold & Config System | Pending |
| CFG-02 | Phase 01: Scaffold & Config System | Pending |
| CFG-03 | Phase 01: Scaffold & Config System | Pending |
| CFG-04 | Phase 01: Scaffold & Config System | Pending |
| DATA-01 | Phase 01: Scaffold & Config System | Pending |
| DATA-02 | Phase 01: Scaffold & Config System | Pending |
| DATA-03 | Phase 02: Certificate Rendering | Pending |
| DATA-04 | Phase 02: Certificate Rendering | Pending |
| CERT-01 | Phase 02: Certificate Rendering | Pending |
| CERT-02 | Phase 02: Certificate Rendering | Pending |
| CERT-03 | Phase 02: Certificate Rendering | Pending |
| CERT-04 | Phase 02: Certificate Rendering | Pending |
| CERT-05 | Phase 02: Certificate Rendering | Pending |
| CERT-06 | Phase 02: Certificate Rendering | Pending |
| CERT-07 | Phase 02: Certificate Rendering | Pending |
| QR-01 | Phase 03: Interactive Features | Pending |
| QR-02 | Phase 03: Interactive Features | Pending |
| QR-03 | Phase 03: Interactive Features | Pending |
| QR-04 | Phase 03: Interactive Features | Pending |
| QR-05 | Phase 03: Interactive Features | Pending |
| QR-06 | Phase 03: Interactive Features | Pending |
| PDF-01 | Phase 03: Interactive Features | Pending |
| PDF-02 | Phase 03: Interactive Features | Pending |
| PDF-03 | Phase 03: Interactive Features | Pending |
| PDF-04 | Phase 03: Interactive Features | Pending |
| PDF-05 | Phase 03: Interactive Features | Pending |
| PDF-06 | Phase 03: Interactive Features | Pending |
| SEARCH-01 | Phase 04: Search & SPA Routing | Pending |
| SEARCH-02 | Phase 04: Search & SPA Routing | Pending |
| SEARCH-03 | Phase 04: Search & SPA Routing | Pending |
| SEARCH-04 | Phase 04: Search & SPA Routing | Pending |
| SEARCH-05 | Phase 04: Search & SPA Routing | Pending |
| SEO-01 | Phase 05: SEO & Structured Data | Pending |
| SEO-02 | Phase 05: SEO & Structured Data | Pending |
| SEO-03 | Phase 05: SEO & Structured Data | Pending |
| SEO-04 | Phase 05: SEO & Structured Data | Pending |
| AEO-01 | Phase 05: SEO & Structured Data | Pending |
| AEO-02 | Phase 05: SEO & Structured Data | Pending |
| AEO-03 | Phase 05: SEO & Structured Data | Pending |
| AEO-04 | Phase 05: SEO & Structured Data | Pending |
| CONTRIB-01 | Phase 01: Scaffold & Config System | Pending |
| CONTRIB-02 | Phase 06: Contribution & Polish | Pending |
| CONTRIB-03 | Phase 06: Contribution & Polish | Pending |
