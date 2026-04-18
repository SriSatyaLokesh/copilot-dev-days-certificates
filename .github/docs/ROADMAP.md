# Roadmap — Workshop Certificate App

## Milestone 1.0 — Template MVP

### Phases

- [x] **Phase 01: Scaffold & Config System** — Repo structure, config loader, dynamic CSS variables, SPA shell, sample data
- [x] **Phase 02: Certificate Rendering** — Full certificate view with all fields, A4 layout, fonts, data fetching, validation
- [x] **Phase 03: Interactive Features** — QR code generation, PDF download, action bar, print exclusions
- [x] **Phase 04: Search & SPA Routing** — Landing page, email sanitization, URL routing, back-button support
- [x] **Phase 05: SEO & Structured Data** — Meta tags, Open Graph, Twitter Card, JSON-LD, robots.txt, semantic HTML
- [x] **Phase 06: Contribution & Polish** — README, PR template, end-to-end integration verification

---

## Phase Details

### Phase 01: Scaffold & Config System
**Goal:** The project skeleton exists, the app loads configuration from JSON on every visit, and all visible text and colors render dynamically — nothing hardcoded in HTML.
**Depends on:** Nothing
**Requirements:** APP-03, APP-04, CFG-01, CFG-02, CFG-03, CFG-04, DATA-01, DATA-02, CONTRIB-01

**Plans:** 5 plans

Plans:
- [ ] 01-01-repo-scaffold-PLAN.md — `index.html` shell, CDN script tags, directory skeleton, CSS reset, JS stub
- [ ] 01-02-config-schema-PLAN.md — `config/certificate.config.json` full flat schema; `fetchConfig()` and `validateConfig()` in app.js
- [ ] 01-03-css-variables-PLAN.md — `applyConfigVars()` in app.js; `:root` CSS variables, spinner, and error styles in styles.css
- [ ] 01-04-spa-shell-PLAN.md — `init()`, `showView()`, `getQueryParam()`, `sanitizeId()` completing the SPA bootstrap
- [ ] 01-05-data-convention-PLAN.md — `data/sample.json` with all attendee fields following email-sanitized ID convention

**Success Criteria:**
1. Opening `index.html` shows a loading indicator while config fetches, then transitions to the correct view — no blank screen or JS errors in console
2. Changing `primary_color` in `config.json` and refreshing updates the certificate border/accent color immediately without editing HTML
3. Changing `org_name` in `config.json` is reflected in the rendered UI on reload — no hardcoded strings visible in `index.html`
4. `/data/sample.json` exists, is valid JSON, and its filename follows the email-sanitized convention
5. The app renders a meaningful error state (not a thrown JS exception) when `config.json` is unreachable or fails to parse

**UI hint**: yes

---

### Phase 02: Certificate Rendering
**Goal:** A valid certificate ID in the URL renders a complete, visually correct landscape A4 certificate with all attendee and org fields from config + JSON data.
**Depends on:** Phase 01
**Requirements:** APP-02, APP-05, DATA-03, DATA-04, CERT-01, CERT-02, CERT-03, CERT-04, CERT-05, CERT-06, CERT-07

**Plans:**
1. certificate-structure: Semantic HTML layout for the certificate view — all content containers, heading hierarchy, field slots
2. certificate-layout: CSS — landscape A4 dimensions (297mm × 210mm), Playfair Display + Lato from Google Fonts CDN, visual hierarchy, border, spacing
3. certificate-data: Parallel fetch via `Promise.all()`, required field validation (certificate_id, name, email, workshop, date, date_iso), error state on invalid/missing ID
4. certificate-render: Populate all fields from config + attendee data; show/hide description via `show_description` flag; graceful 404 image handling (hidden, not broken icon); certificate ID muted text at bottom

**Success Criteria:**
1. Visiting `/?id=jane-doe-at-gmail-com` renders a certificate showing name, workshop, date, org logo, all config labels, signature, seal, and the certificate ID in muted text
2. Certificate layout is landscape-oriented and visually matches A4 proportions — confirmed in browser dev tools ruler
3. Visiting `/?id=nonexistent-id` shows a clear error message that quotes the attempted ID — no blank page, no unhandled JS exception
4. Removing the seal image URL from config still renders a complete certificate — no broken image icon appears
5. Setting `show_description: false` in config hides the description field on the certificate even when the attendee JSON includes a description value

**UI hint**: yes

---

### Phase 03: Interactive Features
**Goal:** User can download a print-quality landscape PDF of their certificate and scan a QR code on the certificate that links back to the live page.
**Depends on:** Phase 02
**Requirements:** QR-01, QR-02, QR-03, QR-04, QR-05, QR-06, PDF-01, PDF-02, PDF-03, PDF-04, PDF-05, PDF-06

**Plans:**
1. qr-integration: `qrcode.js` CDN integration; QR generation encoding `window.location.href`; bottom-right positioning; `primary_color` from config; 80×80px; `show_qr` config toggle; level-H error correction
2. pdf-integration: `html2pdf.js` CDN integration; "Download PDF" button handler; landscape A4, zero margin, filename `certificate-{id}.pdf`; programmatic trigger (no print dialog)
3. pdf-exclusions: `.no-pdf` CSS class on action bar buttons; html2pdf `ignoreElements` config to exclude button bar from PDF output

**Success Criteria:**
1. Clicking "Download PDF" saves a file named `certificate-{id}.pdf` in landscape A4 format — the system print dialog never opens
2. The downloaded PDF contains the QR code in the bottom-right, and scanning it with a phone opens the correct certificate URL
3. "Download PDF" and "Print" buttons are absent from the saved PDF output
4. Setting `show_qr: false` in config removes the QR code from both the screen view and the downloaded PDF
5. QR code dark color matches `primary_color` from config on both screen and in the PDF

**UI hint**: yes

---

### Phase 04: Search & SPA Routing
**Goal:** Anyone can find their certificate by entering their registered email on the landing page, and the whole experience is a single-page app with no full-page reloads.
**Depends on:** Phase 01
**Requirements:** APP-01, SEARCH-01, SEARCH-02, SEARCH-03, SEARCH-04, SEARCH-05

**Plans:**
1. search-ui: Landing page HTML and CSS — branded layout with org logo, headline, subtext, email input field, submit button, footer note; all content from config
2. search-logic: Email sanitization function (produces ID from email input), raw-ID passthrough detection, URL update via `history.pushState` (no reload), Enter key handler
3. url-routing: `popstate` listener for back-button support, app router re-evaluating state on URL change, integration with Phase 01 view switcher

**Success Criteria:**
1. Visiting `/` (or `index.html` with no `?id=`) shows a branded landing page with org logo, headline, subtext, and footer note — all sourced from `config.json`
2. Entering `jane.doe@gmail.com` and clicking submit navigates to `/?id=jane-doe-at-gmail-com` without a full page reload
3. Entering the raw ID `jane-doe-at-gmail-com` directly in the input field navigates to the same certificate URL
4. Pressing Enter in the email/ID input field submits the search — identical behavior to clicking the submit button
5. All landing page copy (headline, subtext, input placeholder, button label, footer note) is controlled exclusively by `config.json`

**UI hint**: yes

---

### Phase 05: SEO & Structured Data
**Goal:** Certificate pages are discoverable by search engines, generate correct social preview cards, and expose machine-readable structured data for AI answer engines.
**Depends on:** Phase 02, Phase 04
**Requirements:** SEO-01, SEO-02, SEO-03, SEO-04, AEO-01, AEO-02, AEO-03, AEO-04

**Plans:**
1. meta-tags: Dynamic `<title>`, `<meta name="description">`, and `<link rel="canonical">` injection per view via JS; both certificate and landing page variants
2. social-meta: Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `og:type`) + Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`) injected dynamically via JS
3. structured-data: `EducationalOccupationalCredential` JSON-LD block injected into `<head>` on certificate page load; `Organization` JSON-LD injected on landing page; all field values from config + attendee data
4. semantic-html-and-robots: `<h1>` for attendee name, `<h2>` for workshop title, `<time datetime="...">` for date, `itemprop="name"` for org; `robots.txt` at repo root permitting all crawlers

**Success Criteria:**
1. Viewing page source of a rendered certificate shows a populated `<title>`, `<meta name="description">`, and `<link rel="canonical">` with attendee-specific values
2. Pasting a certificate URL into a social link preview tool shows the correct OG title, description, and image — not the default blank/fallback
3. Running Google Rich Results Test on a certificate URL detects a valid `EducationalOccupationalCredential` entity with no critical errors
4. `robots.txt` is accessible at `{repo-root}/robots.txt` and contains `User-agent: *` / `Allow: /`
5. Certificate page HTML uses `<h1>` for attendee name, `<h2>` for workshop title, and `<time>` with an ISO `datetime` attribute for the date

---

### Phase 06: Contribution & Polish
**Goal:** A non-technical attendee can read the README, create their data file, and open a valid PR — without needing developer help.
**Depends on:** Phase 01, Phase 02, Phase 04
**Requirements:** CONTRIB-02, CONTRIB-03

**Plans:**
1. readme: `README.md` with step-by-step PR submission guide — email-to-ID conversion example, file naming rules, JSON field reference table, fork + PR walkthrough with screenshots
2. pr-template: `.github/PULL_REQUEST_TEMPLATE.md` with pre-filled submission checklist (JSON filename format verified, all required fields present, no leftover sample data)
3. integration-polish: End-to-end walkthrough using `sample.json` as test data; verify all 6 phases work together; surface and fix any integration edge cases found

**Success Criteria:**
1. Following the README instructions from start to finish produces a correctly-named JSON file and a valid open PR — without needing developer guidance
2. Opening a new PR on the repository auto-fills the PR description with a checklist covering filename format, required JSON fields, and data accuracy
3. Copying `/data/sample.json`, renaming it per the convention, and editing the values renders a complete certificate when the ID is used in the URL

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 01. Scaffold & Config System | 5/5 | ✓ Complete | 2026-04-11 |
| 02. Certificate Rendering | 4/4 | ✓ Complete | 2026-04-11 |
| 03. Interactive Features | 3/3 | ✓ Complete | 2026-04-11 |
| 04. Search & SPA Routing | 3/3 | ✓ Complete | 2026-04-11 |
| 05. SEO & Structured Data | 4/4 | ✓ Complete | 2026-04-11 |
| 06. Contribution & Polish | 3/3 | ✓ Complete | 2026-04-11 |
