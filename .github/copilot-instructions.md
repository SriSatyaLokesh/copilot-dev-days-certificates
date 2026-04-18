# Copilot Instructions for This Repository

This repository hosts static workshop certificates for GitHub Copilot Dev Days 2026 (Hyderabad).

## Project Scope

- Stack is static only: HTML, CSS, and vanilla JavaScript.
- No framework, bundler, or new runtime dependency should be introduced.
- Keep changes minimal and focused on the user request.

## Core Paths

- UI and logic: `index.html`, `assets/styles.css`, `assets/app.js`
- Branding and template config: `config/certificate.config.json`
- Attendee certificate records: `data/*.json`

## Certificate Data Rules

When creating or editing files in `data/`:

- Follow `.github/instructions/certificate-data.instructions.md`.
- Schema must include:
  - `certificate_id`
  - `name`
  - `email`
  - `workshop`
  - `date`
  - `date_iso`
  - `description`
- `certificate_id` must match the filename without `.json`.
- Use 2-space indentation and valid JSON only.
- Do not silently overwrite an existing attendee file.

## Email to certificate_id Conversion

Use this exact order:

1. lowercase
2. replace `+` with `-plus-`
3. replace `@` with `-at-`
4. replace `.` with `-`
5. remove remaining non `[a-z0-9-]`

## Frontend Change Guardrails

- Preserve current certificate rendering flow in `assets/app.js`.
- Keep existing query parameter behavior: `?id=<certificate_id>`.
- Maintain graceful fallback behavior for missing images and missing certificate records.
- Prioritize accessibility and responsiveness for UI updates.

## Content and Consistency

- Workshop metadata should remain consistent with `README.md` and `CONTRIBUTING.md` unless explicitly asked to change it.
- If a user requests a new attendee file but omits required fields, ask for missing values first.

## Validation Checklist

Before finishing work, verify:

- JSON syntax is valid for changed `data/*.json` files.
- `certificate_id`, filename, and URL id agree.
- No unrelated files were modified.
- Instructions and examples remain ASCII unless user-provided content requires Unicode.