---
description: 'Create one new attendee certificate JSON file in data/ using only user name and email input; derive certificate_id from email and use README-standard fixed values for workshop/date/description.'
---

Add a new attendee certificate JSON file in `data/` using this workflow.

## Your goals

1. Ask the user only for required attendee inputs.
2. Derive a valid `certificate_id` from email.
3. Create exactly one new file in `data/`.
4. Ensure JSON format and naming are valid.

## Ask these questions first (if missing)

- Full name
- Registered email

Do not ask users to provide workshop/date/description. These are fixed and must be copied from `README.md`.

## Fixed values (copy exactly)

- `workshop`: `Github Copilot Dev Days 2026 - Microsoft, Hyderabad`
- `date`: `April 18, 2026`
- `date_iso`: `2026-04-18`
- `description`: `Completed an intensive program on learning Github Copilot, customizing Copilot agents, covering Copilot CLI, VS Code, Agentic workflows, and building production-grade application development with Copilot.`

## Derive `certificate_id`

Transform email in this exact order:

1. lowercase
2. `+` -> `-plus-`
3. `@` -> `-at-`
4. `.` -> `-`
5. remove remaining non `[a-z0-9-]`

Use that exact value for:
- JSON `certificate_id`
- filename: `data/{certificate_id}.json`

## Validate before writing

- `certificate_id` matches filename (without `.json`)
- JSON has valid syntax
- File does not already exist (if it exists, ask user whether to overwrite)

## File template

```json
{
  "certificate_id": "<derived-id>",
  "name": "<full-name>",
  "email": "<email>",
  "workshop": "Github Copilot Dev Days 2026 - Microsoft, Hyderabad",
  "date": "April 18, 2026",
  "date_iso": "2026-04-18",
  "description": "Completed an intensive program on learning Github Copilot, customizing Copilot agents, covering Copilot CLI, VS Code, Agentic workflows, and building production-grade application development with Copilot."
}
```

## Behavior requirements

- Keep 2-space indentation.
- Keep ASCII unless user input contains unicode.
- Do not change other files unless user asks.
- After creating the file, report:
  - filename
  - certificate URL format: `/?id=<certificate_id>`

## Context references

- `README.md`
- `data/jane-doe-at-example-com.json`
