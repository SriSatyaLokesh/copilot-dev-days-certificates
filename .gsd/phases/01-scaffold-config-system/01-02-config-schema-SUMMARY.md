---
phase: "01"
plan: "01-02"
subsystem: config
tags: [config, schema, json, fetch]
dependency_graph:
  requires: [01-01]
  provides: [config/certificate.config.json, fetchConfig, validateConfig]
  affects: [01-03, 01-04, 01-05, 02-01, 02-02, 02-03, 02-04]
tech_stack:
  added: []
  patterns: [flat-config-schema, relative-fetch, fail-fast-validation]
key_files:
  created:
    - config/certificate.config.json
  modified:
    - assets/app.js
decisions:
  - "Config schema is flat (all fields at root level) — no nested objects"
  - "border_width stored as string with unit (7px) for direct CSS variable injection"
  - "pdf_margin stored as number (0) for direct use by html2pdf.js"
  - "Feature flags (show_qr, show_description, show_seal) are JSON booleans"
  - "Image paths are relative (no leading slash) for GitHub Pages compatibility"
  - "fetchConfig uses relative path — no leading slash to avoid GitHub Pages subpath breakage"
metrics:
  duration: "~5 minutes"
  completed_date: "2026-04-11"
  tasks_completed: 2
  files_changed: 2
---

# Phase 01 Plan 02: Config Schema Summary

## One-liner
Flat 35-field JSON config schema with fetchConfig/validateConfig wired into app.js.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create config/certificate.config.json | 1166c22 | config/certificate.config.json |
| 2 | Add fetchConfig() and validateConfig() to app.js | 59a1862 | assets/app.js |

## What Was Built

**config/certificate.config.json** — Complete flat schema with 35 fields covering:
- Branding: `org_name`, `org_tagline`, `org_website`, `logo_url`
- Colors: `primary_color`, `secondary_color`, `background_color`, `text_color`, `muted_color`, `border_color`, `border_width`
- Assets: `seal_url`, `signature_url`
- Typography: `font_heading`, `font_body`
- Certificate copy: `certificate_title`, `pre_name_text`, `post_name_text`, `issued_by_label`, `date_label`, `id_label`, `signature_name`, `signature_title`
- Feature flags: `show_qr`, `show_description`, `show_seal`
- Search UI: `search_headline`, `search_subtext`, `search_placeholder`, `search_button`, `search_footer_note`
- PDF: `pdf_filename_prefix`, `pdf_format`, `pdf_orientation`, `pdf_margin`
- SEO/Meta: `site_title`, `og_image_url`, `twitter_handle`, `template_version`

**assets/app.js** — Two config functions appended after the `init()` stub:
- `fetchConfig()` — async, fetches relative path, throws on non-ok HTTP status
- `validateConfig(config)` — throws descriptive Error if `org_name`, `primary_color`, or `certificate_title` is falsy

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `config/certificate.config.json` exists and contains all 35 fields
- [x] `border_width` is string `"7px"`, `pdf_margin` is number `0`, feature flags are booleans
- [x] `assets/app.js` contains `fetchConfig()` and `validateConfig()` as top-level function declarations
- [x] `fetchConfig` uses relative path `config/certificate.config.json` (no leading slash)
- [x] Task 1 commit: `1166c22`
- [x] Task 2 commit: `59a1862`

## Self-Check: PASSED
