# Workshop Certificate App — Template Edition

## What This Is

A reusable, zero-backend GitHub Pages template for generating personalized workshop completion certificates. Fork it, edit one JSON config file, drop attendee data files, and you have a fully functional certificate system — no server, no database, no build step.

## Core Value

Any attendee visits their unique URL, sees their personalized certificate, and downloads it as a PDF. The URL is permanent, shareable, and scannable via QR code. The entire system runs from a single `index.html` in a GitHub repo.

## Who It's For

- **Template builder (this repo):** Build a clean, reusable certificate template that any org can fork
- **Workshop Organizer:** Forks the repo, edits config JSON, reviews attendee PRs — never touches HTML
- **Attendee/Participant:** Submits a PR with their JSON file, gets a permanent certificate URL
- **Certificate Viewer:** Anyone with the URL — browser only, no login

## What We're Building

A fully static single-page application that:

1. Reads a `config/certificate.config.json` for all branding, labels, and colors
2. Reads per-attendee JSON files from `/data/{id}.json`
3. Renders a professional landscape A4 certificate with org logo, name, workshop, date, description, QR code
4. Enables one-click PDF download (html2pdf.js) and print
5. Shows a search/landing page when no `?id=` param is present
6. Injects SEO meta tags, Open Graph tags, and JSON-LD structured data dynamically
7. Generates a QR code (qrcode.js) that links back to the certificate URL

**Stack:** Pure HTML5 + CSS3 + Vanilla JS (ES6+). Three CDN libs: qrcode.js, html2pdf.js, Google Fonts. Zero build pipeline.

## Constraints

- Must run entirely on GitHub Pages (no server, no Actions required for core functionality)
- Zero cost ($0/month forever)
- No framework, no bundler, no npm — fork and it just works
- All visible text must come from config JSON — zero HTML edits to rebrand
- Single `index.html` handles all views (search, certificate, error, loading)

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Single `index.html` with search view + certificate view + error view + loading state
- [ ] Config-driven: all text, colors, images from `config/certificate.config.json`
- [ ] Per-attendee data from `/data/{id}.json` — filename matches email-sanitized ID
- [ ] Certificate view: name, workshop, date, org, description, logo, seal, signature
- [ ] QR code generated dynamically (qrcode.js) linking to current page URL
- [ ] PDF download button (html2pdf.js) — landscape A4, zero margin, no dialog
- [ ] Print support via `@media print` CSS
- [ ] Search/landing page with email input → sanitizes to ID → redirects to `?id=`
- [ ] Email-to-ID sanitization: `jane.doe@gmail.com` → `jane-doe-at-gmail-com`
- [ ] SEO: dynamic `<title>`, `<meta description>`, canonical, robots
- [ ] Open Graph tags for social sharing previews
- [ ] Twitter Card meta tags
- [ ] JSON-LD `EducationalOccupationalCredential` schema injected by JS
- [ ] Error state for missing/invalid certificate IDs
- [ ] Path traversal defense: `sanitizeId()` strips all non-`[a-z0-9-]` chars
- [ ] XSS defense: all JSON values inserted via `.textContent`, never `.innerHTML`
- [ ] `robots.txt` allowing all crawlers
- [ ] `/data/sample.json` as contributor template
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` with submission checklist
- [ ] `README.md` with full PR submission instructions

### Out of Scope (v1)

- Clean URL paths (`/john-doe`) — GitHub Pages 404 redirect trick breaks OG scraper social previews; `?id=` is the right trade-off
- User authentication or login
- Admin dashboard
- Email delivery of certificates
- Real-time certificate issuance
- Database or CMS
- GitHub Actions CI validation of PRs
- Multiple workshops per person
- Certificate index/gallery page

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| `?id=` query params over clean paths | GitHub Pages doesn't support server-side routing. 404 redirect trick breaks OG scraper social previews, which is critical for LinkedIn/WhatsApp sharing. `?id=` works correctly with all crawlers and scrapers. | Decided |
| Vanilla JS only (no framework) | No build step, instant fork-and-deploy, no `npm install` needed. CDN-only dependencies. | Decided |
| Template-first build | Build a clean reusable template repo; clone for specific events after. Asset placeholders until real branding is ready. | Decided |
| Placeholder assets for v1 | Real `logo.png`, `seal.png`, `signature.png` will be dropped into `assets/img/` later. Build and test with placeholders. | Decided |
| All text from config JSON | Zero HTML edits to rebrand — organizers only edit JSON. Enables true fork-and-go reuse. | Decided |

---

_Last updated: April 11, 2026 after initialization_
