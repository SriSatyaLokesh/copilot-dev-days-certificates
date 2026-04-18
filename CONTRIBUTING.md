# Contributing to GitHub Copilot Dev Days 2026 – Hyderabad Certificates

Thank you for attending! There are two ways to contribute — [claiming your certificate](#claiming-your-certificate) (most attendees) or [improving the app itself](#improving-the-app) (developers).

---

## Claiming Your Certificate

> This is the most common contribution. Follow these steps to get your certificate published.

### 1. Fork the repository

Click **Fork** at the top-right of this page. Work from your fork — do not push directly to `main`.

### 2. Create your data file

You have two options:

#### Option A (recommended) - Use GitHub Copilot prompt (instant)

1. Open this repo in VS Code (your fork).
2. Open Copilot Chat.
3. Run this command:

```text
/add-certificate "your full name"
```

4. Provide your registered email when asked.
5. Copilot will generate exactly one file in `data/` with the correct `certificate_id` and required fixed fields.

<details>
<summary><strong>Option B - Manual JSON creation (click to expand)</strong></summary>

In your fork, create a new file in `data/` named after your registered email address.

**Email → filename conversion:**

| Rule | Example |
|------|---------|
| Lowercase everything | `Jane.Doe@Example.com` → `jane.doe@example.com` |
| Replace `@` with `-at-` | `jane.doe@example.com` → `jane.doe-at-example.com` |
| Replace every `.` with `-` | `jane.doe-at-example.com` → `jane-doe-at-example-com` |
| Replace `+` with `-plus-` | `jane+tag@...` → `jane-plus-tag-at-...` |

**File:** `data/jane-doe-at-example-com.json`

```json
{
  "certificate_id": "jane-doe-at-example-com",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "workshop": "Github Copilot Dev Days 2026 - Microsoft, Hyderabad",
  "date": "April 18, 2026",
  "date_iso": "2026-04-18",
  "description": "Completed an intensive program on GitHub Copilot, covering Copilot CLI, VS Code, agentic workflows, and building production-grade applications with AI assistance."
}
```

**Rules:**
- `certificate_id` must exactly match the filename without `.json`
- `name`, and `email`,must be your own — do not copy from `sample.json`
- `workshop`, `date`, `date_iso`  and `description`  must be copied exactly as shown above

</details>

### 3. Open a Pull Request

Open a PR from your fork's `main` branch to this repository's `main` branch.

- The PR description auto-fills with a checklist — complete every item before submitting
- One data file per PR
- PRs with sample/placeholder data will be closed without merging

### 4. Wait for review

The organizer will review and merge within a few days. Once merged, your certificate is live at:

```
https://srisatyalokesh.github.io/copilot-dev-days-certificates/?id=jane-doe-at-example-com
```

---

## Improving the App

For bug fixes, accessibility improvements, or other enhancements to the app itself.

### Prerequisites

No build toolchain required — the project is plain HTML/CSS/JS.

```bash
# Serve locally via Node.js
npx serve .

# Or Python
python -m http.server 8080
```

Open `http://localhost:8080/?id=jane-doe-at-example-com` to test with the sample certificate.

### Workflow

1. Fork the repository and create a branch:
   ```bash
   git checkout -b fix/your-branch-name
   ```
2. Make your changes
3. Test locally in at least one browser
4. Open a PR against `main` with a clear description of the problem and solution

### What we welcome

- Bug fixes with a clear reproduction case
- Accessibility improvements (`aria`, keyboard nav, contrast)
- Browser compatibility fixes

### What we won't merge

- New dependencies or build pipelines
- Changes to `config/certificate.config.json` branding values
- Modifications to existing attendee data files in `data/`
- Features not related to this specific event

---

## Code Style

- Vanilla JS only — no frameworks, no bundlers
- `'use strict'` in all JS files
- 2-space indentation
- Prefer `const`/`let` over `var`

---

## Questions

Open an issue or contact the organizer at **srisatyalokesh2.12@gmail.com**.
