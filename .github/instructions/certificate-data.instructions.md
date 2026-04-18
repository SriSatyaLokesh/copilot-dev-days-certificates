---
applyTo: "data/**/*.json"
description: "Use when creating or editing attendee certificate JSON files in data/: enforce required schema, filename/id matching, and email-to-certificate_id conversion rules."
---

# Certificate Data JSON Rules

These rules apply to all certificate files in `data/`.

## Required schema

Every file must be valid JSON with this shape:

```json
{
  "certificate_id": "jane-doe-at-example-com",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "workshop": "Your Workshop Name Here",
  "date": "April 5, 2026",
  "date_iso": "2026-04-05",
  "description": "One sentence describing what you learned or completed."
}
```

## Field rules

- `certificate_id` is required and must match the filename without `.json`.
- `name` is required and should be the attendee's full name.
- `email` is required and should be the registered attendee email.
- `workshop` is required and should match the workshop title used by organizers.
- `date` is required and must be human-readable (example: `April 5, 2026`).
- `date_iso` is required and must be ISO format `YYYY-MM-DD`.
- `description` is optional in generic template mode but recommended.

## Filename convention

Filename must be `data/{certificate_id}.json` where `certificate_id` is derived from email:

1. lowercase
2. replace `+` with `-plus-`
3. replace `@` with `-at-`
4. replace `.` with `-`
5. remove remaining non `[a-z0-9-]`

Example:

- `Jane.Doe+vip@Example.com`
- `jane-doe-plus-vip-at-example-com`
- filename: `data/jane-doe-plus-vip-at-example-com.json`

## Quality checks

- Use 2-space indentation.
- Do not include comments in JSON.
- Do not leave placeholder values if the user provided real values.
- If the target file already exists, do not overwrite silently; ask before updating.
- Keep output ASCII unless user explicitly includes unicode.

## Source of truth

- `README.md` attendee rules
- `data/jane-doe-at-example-com.json` template example
