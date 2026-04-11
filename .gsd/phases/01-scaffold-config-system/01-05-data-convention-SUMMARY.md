---
phase: "01"
plan: "05"
subsystem: data
tags: [data, convention, sample, fixture]
dependency_graph:
  requires: [01-01-repo-scaffold]
  provides: [data/sample.json]
  affects: [Phase 02 certificate rendering]
tech_stack:
  added: []
  patterns: [email-sanitization-naming-convention]
key_files:
  created: [data/sample.json]
  modified: []
decisions:
  - "sample.json is a convention exception filename — real attendee files use {certificate_id}.json"
  - "certificate_id derived by sanitizeId(email): lowercase, replace @ with -at-, replace . with -, strip non-alphanumeric"
metrics:
  duration: "2 minutes"
  completed: "2026-04-11"
---

# Phase 01 Plan 05: Data Convention Summary

**One-liner:** First attendee data fixture (`data/sample.json`) demonstrating email-sanitization naming convention with all 7 required fields.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create data/sample.json with all required attendee fields | 705af01 | data/sample.json |

## What Was Built

Created `data/sample.json` — the canonical sample attendee data file. Demonstrates the email-sanitization convention that all real attendee data files must follow:

- **email:** `jane.doe@example.com`
- **certificate_id:** `jane-doe-at-example-com` (sanitized via `sanitizeId()`)

### Sanitization trace

```
jane.doe@example.com
  → toLowerCase().trim()       → jane.doe@example.com
  → replace(/\+/g, '-plus-')   → jane.doe@example.com
  → replace(/@/g, '-at-')      → jane.doe-at-example.com
  → replace(/\./g, '-')        → jane-doe-at-example-com
  → replace(/[^a-z0-9\-]/g,'') → jane-doe-at-example-com ✓
```

### Fields

| Field | Value |
|-------|-------|
| certificate_id | jane-doe-at-example-com |
| name | Jane Doe |
| email | jane.doe@example.com |
| workshop | Introduction to Machine Learning |
| date | April 5, 2026 |
| date_iso | 2026-04-05 |
| description | Completed 16 hours of hands-on training... |

## Success Criteria Verification

- [x] `data/sample.json` exists at workspace root (not inside assets/)
- [x] Valid JSON with all 7 fields: certificate_id, name, email, workshop, date, date_iso, description
- [x] certificate_id is "jane-doe-at-example-com" — correct sanitized form of "jane.doe@example.com"
- [x] date_iso is "2026-04-05" (ISO 8601 format)
- [x] Phase 01 success criteria #4 satisfied: valid JSON, filename follows email-sanitized convention

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `data/sample.json` exists: FOUND
- Commit 705af01 exists: FOUND
