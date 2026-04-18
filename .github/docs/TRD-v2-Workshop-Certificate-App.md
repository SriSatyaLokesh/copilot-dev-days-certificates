# Technical Requirements Document (TRD)
## Workshop Certificate Web Application — Template Edition
**Version:** 2.0  
**Date:** April 11, 2026  
**Status:** Final Draft — Ready for Development  
**Author:** Satya K  

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository (main)                  │
│                                                             │
│  index.html                  ← Single entry point           │
│  robots.txt                  ← SEO crawler permissions      │
│  CNAME (optional)            ← Custom domain                │
│  config/
│    certificate.config.json   ← Template / org settings      │
│  data/
│    sample.json               ← Contributor template         │
│    jane-doe-at-gmail-com.json
│    john-smith-at-corp-com.json
│    ...
│  assets/
│    css/style.css             ← Screen styles                │
│    css/print.css             ← Print / PDF styles           │
│    js/app.js                 ← All application logic        │
│    img/logo.png
│    img/seal.png
│    img/signature.png
│    img/og-default.png        ← Default Open Graph image     │
│  .github/
│    PULL_REQUEST_TEMPLATE.md
│  README.md
└──────────────┬──────────────────────────────────────────────┘
               │ GitHub Pages serves all files (static)
               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Browser Runtime (Client Only)              │
│                                                             │
│  Page Load                                                  │
│    │                                                        │
│    ├─ Read ?id= param from URL                              │
│    │                                                        │
│    ├─ Fetch config/certificate.config.json                  │
│    │                                                        │
│    ├─ if ?id= present:                                      │
│    │    Fetch data/{id}.json (parallel with config)         │
│    │    → Render Certificate View                           │
│    │    → Inject SEO meta tags dynamically                  │
│    │    → Inject JSON-LD structured data                    │
│    │    → Generate QR code (qrcode.js)                      │
│    │    → Wire Download PDF button (html2pdf.js)            │
│    │                                                        │
│    └─ if no ?id=:                                           │
│         → Render Search View                                │
│         → Inject Organization JSON-LD                       │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version | Source | Rationale |
|---|---|---|---|---|
| Hosting | GitHub Pages | N/A | Free tier | Zero cost, auto-deploys on push |
| Markup | HTML5 | — | — | Semantic, no framework overhead |
| Styling | CSS3 (Vanilla) | — | — | Full print media support, no build step |
| Logic | Vanilla JavaScript | ES6+ | — | No framework, no bundler, no dependencies |
| Data | JSON (static files) | — | Repo `/data/` | Version-controlled, PR-friendly |
| QR Code | qrcode.js | 1.0.0 | cdnjs CDN | Lightweight, no backend needed |
| PDF Generation | html2pdf.js | 0.10.1 | cdnjs CDN | True PDF download, landscape A4 support |
| Fonts | Google Fonts | — | CDN | Playfair Display + Lato — free, fast |
| Structured Data | JSON-LD (schema.org) | — | Injected by JS | AEO / AI answer engine optimization |

### 1.3 CDN Script Tags (exact URLs)

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

<!-- QR Code -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" integrity="sha512-..." crossorigin="anonymous"></script>

<!-- html2pdf -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-..." crossorigin="anonymous"></script>
```

> Note: Add SRI integrity hashes from cdnjs.cloudflare.com for production security.

---

## 2. File Structure

```
{repo-root}/
├── index.html
├── robots.txt
├── CNAME                            ← Optional: custom domain
├── README.md
├── config/
│   └── certificate.config.json
├── data/
│   └── sample.json
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── print.css
│   ├── js/
│   │   └── app.js
│   └── img/
│       ├── logo.png                 ← 200×60px recommended, PNG with transparency
│       ├── seal.png                 ← 100×100px, circular PNG
│       ├── signature.png            ← 160×60px, PNG with transparency
│       └── og-default.png           ← 1200×630px, Open Graph fallback image
└── .github/
    └── PULL_REQUEST_TEMPLATE.md
```

---

## 3. `index.html` — Complete Specification

### 3.1 Full Document Structure

```html
<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/WebPage">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- === SEO: Base tags (overwritten by JS in certificate mode) === -->
  <title>Workshop Certificates</title>
  <meta name="description" content="View and download your workshop completion certificate." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="" id="canonical-tag" />

  <!-- === SEO: Open Graph === -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="" id="og-title" />
  <meta property="og:description" content="" id="og-description" />
  <meta property="og:url" content="" id="og-url" />
  <meta property="og:image" content="" id="og-image" />
  <meta property="og:site_name" content="" id="og-site-name" />

  <!-- === SEO: Twitter Card === -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="" id="tw-title" />
  <meta name="twitter:description" content="" id="tw-description" />
  <meta name="twitter:image" content="" id="tw-image" />
  <meta name="twitter:site" content="" id="tw-site" />

  <!-- === AEO: JSON-LD placeholder (populated by JS) === -->
  <script type="application/ld+json" id="json-ld-block">{}</script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

  <!-- Styles -->
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="stylesheet" href="assets/css/print.css" media="print" />
</head>

<body>

  <!-- ===================== SEARCH VIEW ===================== -->
  <div id="search-view" class="view hidden">
    <div class="search-container">
      <img id="search-logo" src="" alt="" class="search-logo" />
      <h1 id="search-headline" class="search-headline"></h1>
      <p id="search-subtext" class="search-subtext"></p>
      <div class="search-form">
        <input
          type="text"
          id="lookup-input"
          class="search-input"
          placeholder=""
          autocomplete="email"
          inputmode="email"
        />
        <button id="lookup-btn" class="search-btn" type="button"></button>
      </div>
      <p id="search-footer-note" class="search-footer-note"></p>
    </div>
  </div>

  <!-- ===================== CERTIFICATE VIEW ===================== -->
  <div id="certificate-view" class="view hidden">

    <!-- Action Bar (screen only, hidden in PDF/print) -->
    <div class="action-bar no-print" id="action-bar">
      <button id="download-btn" class="btn btn-primary no-print">
        ⬇ Download PDF
      </button>
      <button id="print-btn" class="btn btn-secondary no-print" onclick="window.print()">
        🖨 Print
      </button>
    </div>

    <!-- Certificate Card -->
    <div class="certificate-wrapper">
      <div class="certificate" id="certificate"
           itemscope itemtype="https://schema.org/EducationalOccupationalCredential">

        <!-- Top: Org Header -->
        <div class="cert-header">
          <img id="cert-logo" src="" alt="" class="cert-logo" />
          <p class="cert-org-name" id="cert-org-name"
             itemprop="recognizedBy" itemscope itemtype="https://schema.org/Organization">
            <span itemprop="name"></span>
          </p>
        </div>

        <!-- Decorative Heading -->
        <div class="cert-title-block">
          <div class="cert-ornament-line"></div>
          <p class="cert-heading-label" id="cert-heading-label"></p>
          <div class="cert-ornament-line"></div>
        </div>

        <!-- Body -->
        <div class="cert-body">
          <p class="cert-pre-name-text" id="cert-pre-name-text"></p>

          <h1 class="cert-name" id="cert-name" itemprop="about"
              itemscope itemtype="https://schema.org/Person">
            <span itemprop="name"></span>
          </h1>

          <p class="cert-post-name-text" id="cert-post-name-text"></p>

          <h2 class="cert-workshop" id="cert-workshop" itemprop="name"></h2>

          <p class="cert-description" id="cert-description" itemprop="description"></p>
        </div>

        <!-- Footer: Date | Seal | Signature -->
        <div class="cert-footer">
          <div class="cert-footer-left">
            <time class="cert-date" id="cert-date" itemprop="dateCreated" datetime=""></time>
            <span class="cert-footer-label" id="cert-date-label"></span>
          </div>

          <div class="cert-footer-center">
            <img id="cert-seal" src="" alt="Official Seal" class="cert-seal" />
          </div>

          <div class="cert-footer-right">
            <img id="cert-signature" src="" alt="Authorized Signature" class="cert-signature" />
            <p class="cert-authorized-by" id="cert-authorized-by"></p>
            <span class="cert-footer-label" id="cert-sig-label"></span>
          </div>
        </div>

        <!-- QR Code + Certificate ID -->
        <div class="cert-bottom-row">
          <p class="cert-id-label" id="cert-id-label"></p>
          <div id="cert-qr" class="cert-qr"></div>
        </div>

      </div>
    </div>
  </div>

  <!-- ===================== ERROR VIEW ===================== -->
  <div id="error-view" class="view hidden">
    <div class="error-container">
      <h2>Certificate Not Found</h2>
      <p>We couldn't find a certificate for: <strong id="error-id-display"></strong></p>
      <p><a href="index.html">← Search again</a></p>
    </div>
  </div>

  <!-- ===================== LOADING STATE ===================== -->
  <div id="loading-view" class="view">
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  </div>

  <!-- CDN Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

  <!-- App -->
  <script src="assets/js/app.js"></script>
</body>
</html>
```

---

## 4. `assets/js/app.js` — Complete Specification

### 4.1 Module Structure

```
app.js
  ├── init()                        ← Entry point on DOMContentLoaded
  ├── getQueryParam(key)            ← Reads ?id= from URL
  ├── sanitizeId(raw)               ← Strips unsafe characters
  ├── sanitizeEmail(email)          ← Converts email to certificate ID
  ├── fetchConfig()                 ← Fetches config/certificate.config.json
  ├── fetchAttendee(id)             ← Fetches data/{id}.json
  ├── showView(viewId)              ← Shows one view, hides all others
  ├── renderSearchView(config)      ← Populates search page from config
  ├── renderCertificateView(config, attendee) ← Populates certificate
  ├── applyConfigColors(config)     ← Sets CSS variables from config JSON
  ├── generateQRCode(url, config)   ← Renders QR code via qrcode.js
  ├── wirePDFButton(config, id)     ← Wires html2pdf.js to download button
  ├── injectSEOTags(config, attendee)  ← Sets all meta tags dynamically
  ├── injectJSONLD(config, attendee)   ← Injects schema.org JSON-LD
  ├── injectOrgJSONLD(config)          ← Injects Organization schema for search view
  └── showError(id)                    ← Renders error view
```

### 4.2 Complete `app.js`

```javascript
'use strict';

// ─── Constants ───────────────────────────────────────────────
const CONFIG_PATH = 'config/certificate.config.json';
const DATA_PATH   = 'data/';

// ─── Entry Point ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

async function init() {
  showView('loading-view');

  const rawId = getQueryParam('id');
  const id    = rawId ? sanitizeId(rawId) : null;

  try {
    if (id) {
      // Certificate mode: fetch both in parallel
      const [config, attendee] = await Promise.all([
        fetchConfig(),
        fetchAttendee(id)
      ]);
      applyConfigColors(config);
      renderCertificateView(config, attendee);
      injectSEOTags(config, attendee);
      injectJSONLD(config, attendee);
      generateQRCode(window.location.href, config);
      wirePDFButton(config, attendee.certificate_id);
      showView('certificate-view');
    } else {
      // Search mode: fetch config only
      const config = await fetchConfig();
      applyConfigColors(config);
      renderSearchView(config);
      injectOrgJSONLD(config);
      showView('search-view');
    }
  } catch (err) {
    console.error('App error:', err);
    showError(id || '(unknown)');
  }
}

// ─── URL Utilities ────────────────────────────────────────────
function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function sanitizeId(raw) {
  // Allow only lowercase alphanumeric and hyphens — strip everything else
  return raw.toLowerCase().replace(/[^a-z0-9\-]/g, '');
}

function sanitizeEmail(email) {
  return email
    .toLowerCase()
    .trim()
    .replace(/\+/g, '-plus-')
    .replace(/@/g, '-at-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

// ─── Data Fetching ────────────────────────────────────────────
async function fetchConfig() {
  const res = await fetch(CONFIG_PATH);
  if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
  return res.json();
}

async function fetchAttendee(id) {
  const res = await fetch(`${DATA_PATH}${id}.json`);
  if (!res.ok) throw new Error(`Attendee fetch failed: ${res.status} for id: ${id}`);
  const data = await res.json();
  validateAttendee(data);
  return data;
}

function validateAttendee(data) {
  const required = ['certificate_id', 'name', 'email', 'workshop', 'date', 'date_iso'];
  for (const field of required) {
    if (!data[field]) throw new Error(`Missing required field in attendee JSON: "${field}"`);
  }
}

// ─── View Management ─────────────────────────────────────────
function showView(activeId) {
  ['loading-view', 'search-view', 'certificate-view', 'error-view'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== activeId);
  });
}

// ─── Config-Driven CSS Variables ─────────────────────────────
function applyConfigColors(config) {
  const c = config.certificate;
  const root = document.documentElement.style;
  root.setProperty('--cert-border',     c.border_color);
  root.setProperty('--cert-primary',    c.primary_color);
  root.setProperty('--cert-accent',     c.accent_color);
  root.setProperty('--cert-bg',         c.background_color);
  root.setProperty('--cert-text',       c.text_color);
  root.setProperty('--cert-muted',      c.muted_color);
}

// ─── Search View ─────────────────────────────────────────────
function renderSearchView(config) {
  const sp = config.search_page;

  setAttr('search-logo', 'src', config.org_logo);
  setAttr('search-logo', 'alt', config.org_name);
  setText('search-headline',    sp.headline);
  setText('search-subtext',     sp.subtext);
  setText('search-footer-note', sp.footer_note);
  setAttr('lookup-input', 'placeholder', sp.input_placeholder);
  setText('lookup-btn', sp.button_text);

  document.title = config.site_title;

  document.getElementById('lookup-btn').addEventListener('click', handleSearch);
  document.getElementById('lookup-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
}

function handleSearch() {
  const input = document.getElementById('lookup-input').value.trim();
  if (!input) return;

  const id = input.includes('@')
    ? sanitizeEmail(input)
    : sanitizeId(input);

  window.location.href = `?id=${encodeURIComponent(id)}`;
}

// ─── Certificate View ─────────────────────────────────────────
function renderCertificateView(config, attendee) {
  const c  = config.certificate;
  const sp = config.search_page;

  // Page title
  document.title = `${attendee.name} — ${attendee.workshop} Certificate | ${config.org_name}`;

  // Org header
  setAttr('cert-logo', 'src', config.org_logo);
  setAttr('cert-logo', 'alt', config.org_name);
  setText('cert-org-name', config.org_name);

  // Labels from config
  setText('cert-heading-label',  c.heading_label);
  setText('cert-pre-name-text',  c.pre_name_text);
  setText('cert-post-name-text', c.post_name_text);
  setText('cert-date-label',     c.footer_left_label);
  setText('cert-sig-label',      c.footer_right_label);
  setText('cert-authorized-by',  c.authorized_by);

  // Attendee data
  // Name — also set itemprop span inside h1
  const nameEl = document.getElementById('cert-name');
  if (nameEl) nameEl.querySelector('[itemprop="name"]').textContent = attendee.name;

  setText('cert-workshop', attendee.workshop);

  const dateEl = document.getElementById('cert-date');
  if (dateEl) {
    dateEl.textContent   = attendee.date;
    dateEl.setAttribute('datetime', attendee.date_iso);
  }

  // Description (optional)
  const descEl = document.getElementById('cert-description');
  if (descEl) {
    if (attendee.description && c.show_description) {
      descEl.textContent = attendee.description;
      descEl.style.display = 'block';
    } else {
      descEl.style.display = 'none';
    }
  }

  // Certificate ID
  setText('cert-id-label', `Certificate ID: ${attendee.certificate_id}`);

  // Images
  setAttr('cert-seal',      'src', c.seal_image      || '');
  setAttr('cert-signature', 'src', c.signature_image || '');

  // Graceful image error handling
  ['cert-logo', 'cert-seal', 'cert-signature'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onerror = () => { el.style.display = 'none'; };
  });

  // Org name itemprop
  const orgNameSpan = document.querySelector('#cert-org-name [itemprop="name"]');
  if (orgNameSpan) orgNameSpan.textContent = config.org_name;
}

// ─── QR Code ─────────────────────────────────────────────────
function generateQRCode(url, config) {
  if (!config.certificate.show_qr) return;

  const container = document.getElementById('cert-qr');
  if (!container || typeof QRCode === 'undefined') return;

  container.innerHTML = ''; // clear any previous
  new QRCode(container, {
    text:        url,
    width:       80,
    height:      80,
    colorDark:   config.certificate.primary_color || '#000000',
    colorLight:  '#ffffff',
    correctLevel: QRCode.CorrectLevel.H  // High error correction — survives printing
  });
}

// ─── PDF Download ─────────────────────────────────────────────
function wirePDFButton(config, certId) {
  const btn = document.getElementById('download-btn');
  if (!btn || typeof html2pdf === 'undefined') return;

  const pdfConfig = config.pdf || {};

  btn.addEventListener('click', () => {
    // Temporarily hide no-print elements during capture
    const noPrint = document.querySelectorAll('.no-print');
    noPrint.forEach(el => el.style.visibility = 'hidden');

    const element = document.getElementById('certificate');
    const opt = {
      margin:      pdfConfig.margin ?? 0,
      filename:    `${pdfConfig.filename_prefix || 'certificate'}-${certId}.pdf`,
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF:       {
        unit:        'mm',
        format:      pdfConfig.format || 'a4',
        orientation: pdfConfig.orientation || 'landscape'
      }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      noPrint.forEach(el => el.style.visibility = 'visible');
    });
  });
}

// ─── SEO Meta Tag Injection ───────────────────────────────────
function injectSEOTags(config, attendee) {
  const pageUrl     = window.location.href;
  const title       = `${attendee.name} — ${attendee.workshop} Certificate | ${config.org_name}`;
  const description = `${attendee.name} successfully completed "${attendee.workshop}" on ${attendee.date}. Issued by ${config.org_name}.`;
  const image       = config.seo?.default_og_image
    ? new URL(config.seo.default_og_image, window.location.origin).href
    : '';

  // Canonical
  setMetaAttr('canonical-tag', 'href', pageUrl);

  // Standard
  document.title = title;
  setMetaContent('description', description);

  // Open Graph
  setTagContent('og-title',       title);
  setTagContent('og-description', description);
  setTagContent('og-url',         pageUrl);
  setTagContent('og-image',       image);
  setTagContent('og-site-name',   config.org_name);

  // Twitter Card
  setTagContent('tw-title',       title);
  setTagContent('tw-description', description);
  setTagContent('tw-image',       image);
  setTagContent('tw-site',        config.seo?.twitter_handle || '');
}

// ─── JSON-LD: Certificate (AEO) ───────────────────────────────
function injectJSONLD(config, attendee) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "name": `${attendee.workshop} — Certificate of Completion`,
    "description": attendee.description || `${attendee.name} completed ${attendee.workshop}.`,
    "credentialCategory": "Certificate of Completion",
    "dateCreated": attendee.date_iso,
    "url": window.location.href,
    "identifier": attendee.certificate_id,
    "recognizedBy": {
      "@type": "Organization",
      "name": config.org_name,
      "url":  config.org_website || '',
      "logo": new URL(config.org_logo, window.location.origin).href
    },
    "about": {
      "@type": "Person",
      "name":  attendee.name,
      "email": attendee.email
    }
  };

  const el = document.getElementById('json-ld-block');
  if (el) el.textContent = JSON.stringify(schema, null, 2);
}

// ─── JSON-LD: Organization (Search View / AEO) ────────────────
function injectOrgJSONLD(config) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config.org_name,
    "url":  config.org_website || window.location.origin,
    "logo": new URL(config.org_logo, window.location.origin).href,
    "description": config.org_tagline || ''
  };

  const el = document.getElementById('json-ld-block');
  if (el) el.textContent = JSON.stringify(schema, null, 2);
}

// ─── Error View ───────────────────────────────────────────────
function showError(id) {
  setText('error-id-display', id);
  showView('error-view');
}

// ─── DOM Helpers ──────────────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '';
}

function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute(attr, value);
}

function setMetaAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

function setTagContent(id, value) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('content', value);
}

function setMetaContent(name, value) {
  const el = document.querySelector(`meta[name="${name}"]`);
  if (el) el.setAttribute('content', value);
}
```

---

## 5. `assets/css/style.css` — Complete Specification

```css
/* ─── CSS Variables (defaults — overridden by JS from config) ─ */
:root {
  --cert-bg:       #ffffff;
  --cert-border:   #c8a951;
  --cert-primary:  #1a2e4a;
  --cert-accent:   #c8a951;
  --cert-text:     #333333;
  --cert-muted:    #777777;
  --font-heading:  'Playfair Display', Georgia, serif;
  --font-body:     'Lato', 'Helvetica Neue', sans-serif;
}

/* ─── Reset & Base ─────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body);
  background: #e5e5e5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view { width: 100%; }
.hidden { display: none !important; }

/* ─── Loading ──────────────────────────────────────────────── */
#loading-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  color: var(--cert-muted);
}

.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid #ddd;
  border-top-color: var(--cert-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Search View ──────────────────────────────────────────── */
#search-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.search-container {
  background: white;
  border-radius: 12px;
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.search-logo     { max-height: 60px; max-width: 200px; margin-bottom: 1.5rem; }
.search-headline { font-family: var(--font-heading); font-size: 1.8rem; color: var(--cert-primary); margin-bottom: 0.75rem; }
.search-subtext  { color: var(--cert-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6; }

.search-form     { display: flex; flex-direction: column; gap: 0.75rem; }
.search-input    { padding: 0.75rem 1rem; border: 1.5px solid #ddd; border-radius: 6px; font-size: 1rem; font-family: var(--font-body); width: 100%; }
.search-input:focus { outline: none; border-color: var(--cert-primary); }

.search-btn {
  padding: 0.75rem 1.5rem;
  background: var(--cert-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: opacity 0.2s;
}
.search-btn:hover { opacity: 0.88; }
.search-footer-note { margin-top: 1.25rem; font-size: 0.8rem; color: var(--cert-muted); }

/* ─── Action Bar ───────────────────────────────────────────── */
.action-bar {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  padding: 1.25rem;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #e5e5e5;
}

.btn { padding: 0.65rem 1.5rem; border: none; border-radius: 6px; font-size: 0.95rem; font-family: var(--font-body); cursor: pointer; transition: opacity 0.2s; }
.btn:hover { opacity: 0.85; }
.btn-primary   { background: var(--cert-primary); color: white; }
.btn-secondary { background: white; color: var(--cert-primary); border: 1.5px solid var(--cert-primary); }

/* ─── Certificate Wrapper ──────────────────────────────────── */
.certificate-wrapper {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
}

/* ─── Certificate Card ─────────────────────────────────────── */
.certificate {
  background: var(--cert-bg);
  border: 7px double var(--cert-border);
  padding: 48px 64px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: center;
  position: relative;
  min-height: 560px;
}

/* ─── Cert Header ──────────────────────────────────────────── */
.cert-header     { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.cert-logo       { max-height: 64px; max-width: 220px; }
.cert-org-name   { font-family: var(--font-body); font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cert-muted); }

/* ─── Ornament / Divider ───────────────────────────────────── */
.cert-title-block     { display: flex; align-items: center; gap: 1rem; margin: 0.75rem 0; }
.cert-ornament-line   { flex: 1; height: 1px; background: var(--cert-border); }
.cert-heading-label   { font-family: var(--font-heading); font-size: 1.1rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--cert-primary); white-space: nowrap; }

/* ─── Cert Body ────────────────────────────────────────────── */
.cert-body           { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; flex: 1; justify-content: center; padding: 0.5rem 0; }
.cert-pre-name-text  { font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cert-muted); }
.cert-name           { font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3.2rem); color: var(--cert-primary); font-weight: 700; line-height: 1.2; }
.cert-post-name-text { font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cert-muted); margin-top: 0.25rem; }
.cert-workshop       { font-family: var(--font-heading); font-size: clamp(1.2rem, 2.5vw, 1.7rem); color: var(--cert-accent); font-style: italic; font-weight: 400; }
.cert-description    { font-size: 0.85rem; color: var(--cert-muted); max-width: 620px; line-height: 1.6; margin-top: 0.5rem; }

/* ─── Cert Footer ──────────────────────────────────────────── */
.cert-footer       { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee; }
.cert-footer-left  { text-align: left; }
.cert-footer-center{ text-align: center; }
.cert-footer-right { text-align: right; }

.cert-date         { display: block; font-family: var(--font-heading); font-size: 1rem; color: var(--cert-text); }
.cert-footer-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cert-muted); }
.cert-seal         { max-height: 72px; max-width: 72px; }
.cert-signature    { max-height: 52px; max-width: 160px; display: block; margin-left: auto; }
.cert-authorized-by{ font-size: 0.8rem; color: var(--cert-text); margin-top: 0.25rem; }

/* ─── Bottom Row: QR + ID ──────────────────────────────────── */
.cert-bottom-row   { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 1rem; }
.cert-id-label     { font-size: 0.6rem; color: #ccc; letter-spacing: 0.08em; }
.cert-qr           { width: 80px; height: 80px; }
.cert-qr img       { width: 80px !important; height: 80px !important; }

/* ─── Error View ───────────────────────────────────────────── */
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--cert-text);
}
.error-container h2 { color: var(--cert-primary); margin-bottom: 1rem; }
.error-container a  { color: var(--cert-primary); }
```

---

## 6. `assets/css/print.css` — Complete Specification

```css
@page {
  size: A4 landscape;
  margin: 0;
}

@media print {
  /* Hide all non-certificate elements */
  body {
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .no-print,
  .action-bar,
  #search-view,
  #error-view,
  #loading-view {
    display: none !important;
  }

  /* Certificate fills full page */
  #certificate-view {
    display: block !important;
  }

  .certificate-wrapper {
    max-width: 100%;
    padding: 0;
    margin: 0;
  }

  .certificate {
    box-shadow: none !important;
    border: 7px double var(--cert-border) !important;
    width: 297mm;
    height: 210mm;
    padding: 14mm 20mm;
    page-break-inside: avoid;
    overflow: hidden;
  }

  /* Ensure QR code prints cleanly */
  .cert-qr,
  .cert-qr img {
    width: 72px !important;
    height: 72px !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Preserve border color in print */
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

---

## 7. Data File Specifications

### 7.1 `/config/certificate.config.json` (Full Schema)

All fields and their types, with descriptions:

```json
{
  "site_title":   "string — browser tab title for search/landing page",
  "org_name":     "string — organization name shown on certificate and meta tags",
  "org_logo":     "string — relative path or URL to org logo (PNG, transparent bg)",
  "org_tagline":  "string — short tagline for search page and JSON-LD",
  "org_website":  "string — org website URL for JSON-LD schema",

  "certificate": {
    "heading_label":      "string — e.g. 'Certificate of Completion'",
    "pre_name_text":      "string — e.g. 'This is to certify that'",
    "post_name_text":     "string — e.g. 'has successfully completed the workshop'",
    "footer_left_label":  "string — e.g. 'Date of Completion'",
    "footer_right_label": "string — e.g. 'Authorized By'",
    "authorized_by":      "string — name and title of signatory",
    "signature_image":    "string — relative path to signature PNG",
    "seal_image":         "string — relative path to seal PNG",
    "show_qr":            "boolean — show/hide QR code",
    "show_description":   "boolean — show/hide attendee description field",
    "border_color":       "string — hex color e.g. '#c8a951'",
    "primary_color":      "string — hex color",
    "accent_color":       "string — hex color",
    "background_color":   "string — hex color",
    "text_color":         "string — hex color",
    "muted_color":        "string — hex color"
  },

  "search_page": {
    "headline":          "string",
    "subtext":           "string",
    "input_placeholder": "string",
    "button_text":       "string",
    "footer_note":       "string"
  },

  "pdf": {
    "filename_prefix": "string — prefix for downloaded PDF filename",
    "format":          "string — 'a4' | 'letter'",
    "orientation":     "string — 'landscape' | 'portrait'",
    "margin":          "number — 0 for full bleed"
  },

  "seo": {
    "default_og_image":  "string — path to 1200×630px OG image",
    "twitter_handle":    "string — e.g. '@yourhandle'"
  },

  "meta": {
    "template_version": "string",
    "last_updated":     "string"
  }
}
```

### 7.2 `/data/sample.json` (Full Schema)

```json
{
  "certificate_id": "jane-doe-at-example-com",
  "name":           "Jane Doe",
  "email":          "jane.doe@example.com",
  "workshop":       "Introduction to Machine Learning",
  "date":           "April 5, 2026",
  "date_iso":       "2026-04-05",
  "description":    "Completed 16 hours of hands-on training covering supervised learning, neural network fundamentals, and model evaluation."
}
```

---

## 8. `robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://{username}.github.io/{repo}/sitemap.xml
```

---

## 9. `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Certificate Request

**Your Full Name:**
**Email Used to Register:**
**Workshop Name:**
**Date Attended:**

---

### Submission Checklist

- [ ] I copied `data/sample.json` to `data/{my-id}.json` (e.g., `jane-doe-at-gmail-com.json`)
- [ ] The `certificate_id` field exactly matches my filename (without `.json`)
- [ ] `date_iso` is in YYYY-MM-DD format (e.g., `2026-04-05`)
- [ ] My JSON is valid — tested at https://jsonlint.com
- [ ] I only modified my own file in `/data/` — no other files changed
- [ ] My PR title is: `Certificate Request: [Your Name]`

---

### How to generate your file name

Take your email → lowercase → replace `@` with `-at-` → replace `.` with `-`

Example: `jane.doe@gmail.com` → `jane-doe-at-gmail-com.json`
```

---

## 10. Email Sanitization Algorithm

```javascript
function sanitizeEmail(email) {
  return email
    .toLowerCase()           // Step 1: lowercase
    .trim()                  // Step 2: strip whitespace
    .replace(/\+/g, '-plus-') // Step 3: handle + aliases
    .replace(/@/g, '-at-')   // Step 4: replace @
    .replace(/\./g, '-')     // Step 5: replace dots
    .replace(/[^a-z0-9\-]/g, ''); // Step 6: strip all remaining specials
}

// Examples:
// jane.doe@gmail.com         → jane-doe-at-gmail-com
// john+work@corp.io          → john-plus-work-at-corp-io
// ALICE@University.edu       → alice-at-university-edu
```

---

## 11. Security Model

| Threat | Mitigation |
|---|---|
| Path traversal via `?id=` | `sanitizeId()` strips everything except `[a-z0-9\-]` |
| XSS via JSON values | All values inserted via `.textContent`, never `.innerHTML` |
| External image injection | `img onerror` hides broken images gracefully; no eval of JSON values |
| Malicious JSON PRs | Organizer reviews all PRs before merge; no auto-merge |
| Public email exposure | Documented tradeoff; org can use opaque IDs instead of emails |

---

## 12. GitHub Pages Deployment

### 12.1 Enabling (One-Time Setup)
1. Push all files to `main` branch
2. Go to **Settings → Pages → Source: Deploy from branch → Branch: main → / (root)**
3. Save — site live at `https://{username}.github.io/{repo}/`

### 12.2 Custom Domain (Optional)
1. Add `CNAME` file to repo root containing: `certificates.yourorg.com`
2. In DNS, add: `CNAME certificates.yourorg.com → {username}.github.io`
3. In Pages settings, enable "Enforce HTTPS"

### 12.3 No Build Pipeline Required
All files are served as-is. No `npm install`, no Jekyll, no GitHub Actions needed for base functionality.

---

## 13. Local Development

```bash
# Python 3 (recommended — handles CORS for fetch())
python -m http.server 8000

# Node.js alternative
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Test URLs:
```
http://localhost:8000/              ← Search view
http://localhost:8000/?id=sample    ← Certificate view (uses data/sample.json)
http://localhost:8000/?id=invalid   ← Error view
```

---

## 14. Test Matrix

| ID | Scenario | Expected |
|---|---|---|
| T-01 | Visit `/` — no `?id=` | Search view renders; config text populated from JSON |
| T-02 | Visit `/?id=sample` | Certificate renders with all sample.json fields |
| T-03 | Visit `/?id=invalid` | Error view shown with ID displayed |
| T-04 | No `?id=`, click search with valid email | Redirects to `/?id={sanitized-email}` |
| T-05 | Certificate: click Download PDF | Landscape A4 PDF downloads, filename = `certificate-{id}.pdf` |
| T-06 | Certificate: click Print | Print dialog opens, certificate fills page, no buttons |
| T-07 | QR code scanned on screen | Opens correct certificate URL |
| T-08 | QR code in downloaded PDF scanned | Opens correct certificate URL |
| T-09 | Missing required field in JSON | Error view shown with field name |
| T-10 | `?id=../../etc/passwd` (path traversal) | Sanitized to empty, error view shown |
| T-11 | Org logo 404s | Logo hidden gracefully, cert still renders |
| T-12 | `show_qr: false` in config | QR code absent from certificate |
| T-13 | `show_description: false` in config | Description field hidden |
| T-14 | View page source → JSON-LD block | Contains valid `EducationalOccupationalCredential` schema |
| T-15 | Share URL on LinkedIn/WhatsApp | OG preview card shows title, description, image |
| T-16 | Fork repo, edit config JSON only | Entire certificate re-brands with zero HTML edits |

---

## 15. Future Enhancements (Out of Scope for v1)

| Feature | Notes |
|---|---|
| GitHub Actions JSON Validator | Auto-validate PR submissions with a CI check |
| Multiple workshops per person | Extend attendee JSON to array of workshops |
| Index / gallery page | Lists all certificates — requires GitHub Actions to build |
| Custom per-workshop design | Multiple config files, keyed by workshop ID |
| Opaque ID mode | Non-email IDs to protect attendee privacy |
| Expiry / validity period | Add `valid_until` field to attendee JSON |
| Certificate verification API | GitHub raw URL serves as a verifiable data endpoint |
| Analytics | Plausible or Fathom (privacy-first, no cookies) |

---

*Document Owner: Satya K, Lead Engineer*  
*Ready for: AI agent implementation or human developer handoff*
