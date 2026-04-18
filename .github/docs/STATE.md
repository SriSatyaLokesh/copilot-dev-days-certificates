# Project State

**Project:** Workshop Certificate App — Template Edition
**Milestone:** 1.0 — Template MVP
**Status:** ✓ All phases complete

## Current Phase
Milestone 1.0 complete

## Last Completed Phase
Phase 06: Contribution & Polish — Complete (2026-04-11)

## Phase Status

| # | Phase | Status | Plans |
|---|-------|--------|-------|
| 01 | Scaffold & Config System | ✓ Complete | 5/5 |
| 02 | Certificate Rendering | ✓ Complete | 4/4 |
| 03 | Interactive Features | ✓ Complete | 3/3 |
| 04 | Search & SPA Routing | ✓ Complete | 3/3 |
| 05 | SEO & Structured Data | ✓ Complete | 4/4 |
| 06 | Contribution & Polish | ✓ Complete | 3/3 |

## Completed Phases
- Phase 01: Scaffold & Config System (2026-04-11)
- Phase 02: Certificate Rendering (2026-04-11)
- Phase 03: Interactive Features (2026-04-11)
- Phase 04: Search & SPA Routing (2026-04-11)
- Phase 05: SEO & Structured Data (2026-04-11)
- Phase 06: Contribution & Polish (2026-04-11)

## Accumulated Context

### Decisions
- Stack: Single `index.html`, pure HTML/CSS/Vanilla JS (ES6+), no build pipeline
- CDN libs: qrcode.js v1.0.0, html2pdf.js v0.10.1, Google Fonts (Playfair Display + Lato)
- Hosting: GitHub Pages (static, zero backend)
- Certificate ID convention: email sanitization — `jane.doe@gmail.com` → `jane-doe-at-gmail-com`
- Clean URL paths (e.g. `/john-doe`) explicitly out of scope — conflicts with OG scraper requirement
- v2 deferral: CI validator, certificate gallery, multiple workshops per person, opaque IDs, sitemap

- SRI hashes fetched live from cdnjs API at execution time (qrcode.min.js, html2pdf.bundle.min.js)
- loading-view has no hidden class — visible by default for app init
- Error message hardcoded in HTML — branding config fetch may itself have failed

### Todos
(none yet)

### Blockers
(none)

## Last Updated
April 11, 2026 — Phase 01 complete (5/5 plans executed, verification passed)
