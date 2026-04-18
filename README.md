<div align="center">

# GitHub Copilot Dev Days 2026 Hyderabad - Certificates

**Participation certificates for GitHub Copilot Dev Days 2026 – Microsoft, Hyderabad**

[![GitHub Stars](https://img.shields.io/github/stars/SriSatyaLokesh/copilot-dev-days-certificates?style=flat-square&logo=github&label=Stars)](https://github.com/SriSatyaLokesh/copilot-dev-days-certificates/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/SriSatyaLokesh/copilot-dev-days-certificates?style=flat-square&logo=github&label=Forks)](https://github.com/SriSatyaLokesh/copilot-dev-days-certificates/network/members)
[![GitHub PRs](https://img.shields.io/github/issues-pr/SriSatyaLokesh/copilot-dev-days-certificates?style=flat-square&label=PRs)](https://github.com/SriSatyaLokesh/copilot-dev-days-certificates/pulls)
[![Hosted on GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?style=flat-square&logo=github)](https://srisatyalokesh.github.io/copilot-dev-days-certificates/)

[**🎓 View Certificates →**](https://srisatyalokesh.github.io/copilot-dev-days-certificates/)

</div>

---

## About the Event

**GitHub Copilot Dev Days** is a full-day hands-on event organised by [Satya K](https://srisatyalokesh.is-a.dev) and hosted at **Microsoft, Hyderabad** - bringing together students, developers, and tech professionals to explore AI-assisted software development with GitHub Copilot.

Hosted by **Sri Satya Lokesh K.**, the day featured keynotes from industry practitioners, deep-dive sessions on Copilot in the CLI and VS Code, Agentic Workflows and a live hands-on workshop where attendees integrated AI into their real workflows.

**Missed the event?** No worries — all the workshops are available online. Work through them in order to get the full experience, exactly as it happened on the day:

> 🌐 **[copilot-dev-days.github.io →](https://copilot-dev-days.github.io/)**
>
> Start from **Get Started with GitHub Copilot** workshop and go through each one sequentially — by the end you'll have covered everything taught at the event, from Copilot basics to agentic workflows and production-grade AI development.

Every attendee gets a unique URL with a QR code. Scanning it opens their certificate instantly - no login, no app required.

---

## Claim Your Certificate

> **Quick start:** Fork → open Copilot and run `/add-certificate "your full name"` → open a PR → get your certificate URL once merged.

### Step 1 - Fork this repository

Click **Fork** (top-right of this page) to create a copy under your GitHub account.

### Step 2 - Create your data file

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

**Email -> filename conversion:**

| Rule | Example |
|------|---------|
| Lowercase everything | `Jane.Doe@Example.com` -> `jane.doe@example.com` |
| Replace `@` with `-at-` | `jane.doe@example.com` -> `jane.doe-at-example.com` |
| Replace every `.` with `-` | `jane.doe-at-example.com` -> `jane-doe-at-example-com` |
| Replace `+` with `-plus-` | `jane+tag@...` -> `jane-plus-tag-at-...` |

**File:** `data/jane-doe-at-example-com.json`

Then add this content:

```json
{
  "certificate_id": "jane-doe-at-example-com",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "workshop": "Github Copilot Dev Days 2026 - Microsoft, Hyderabad (Learn AI)",
  "date": "April 18, 2026",
  "date_iso": "2026-04-18",
  "description": "Completed an intensive program on learning Github Copilot, customizing Copilot agents, covering Copilot CLI, VS Code, Agentic workflows, and building production-grade application development with Copilot."
}
```

**Field reference:**

| Field | Required | Description |
|-------|----------|-------------|
| `certificate_id` | ✅ | Must exactly match your filename without `.json` |
| `name` | ✅ | Your full name as it should appear on the certificate |
| `email` | ✅ | The email address you registered with |
| `workshop` | ✅ | Keep as-is: `Github Copilot Dev Days 2026 - Microsoft, Hyderabad (Learn AI)` |
| `date` | ✅ | Keep as-is: `April 18, 2026` |
| `date_iso` | ✅ | Keep as-is: `2026-04-18` |
| `description` | ✅ | Keep as-is: `Completed an intensive program on learning Github Copilot, customizing Copilot agents, covering Copilot CLI, VS Code, Agentic workflows, and building production-grade application development with Copilot.` |

> **Note:** Do not copy sample data as-is. Update `certificate_id`, `name`, and `email`, with your own details.

</details>

### Step 3 - Open a Pull Request

Go back to the **original** repository (not your fork) and open a Pull Request from your fork's `main` branch.

The PR description will auto-fill with a checklist - complete every item and submit. The organizer will review and merge within a few days.

### Step 4 - Get your certificate

After your PR is merged, your certificate is live at:

```
https://srisatyalokesh.github.io/copilot-dev-days-certificates/?id=jane-doe-at-example-com
```

You can also visit the homepage and search by your registered email address.

---

## Run Locally

No build step required. Just serve the folder:

```bash
# Using Node.js
npx serve .

# Using Python
python -m http.server 8080
```

Open `http://localhost:8080/?id=jane-doe-at-example-com` to preview the sample certificate.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on claiming your certificate or improving the app.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5 · CSS3 · Vanilla JS (ES6+) |
| Certificate PDF | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| QR Code | [qrcode.js](https://github.com/davidshimjs/qrcodejs) |
| Fonts | Google Fonts (Playfair Display · Lato) |
| Hosting | GitHub Pages - $0/month |

---

<div align="center">

Made with ❤️ by [SriSatyaLokesh](https://srisatyalokesh.is-a.dev) for the GitHub Copilot Dev Days 2026 - Hyderabad

</div>

