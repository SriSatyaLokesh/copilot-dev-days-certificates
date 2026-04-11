'use strict';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  showView('loading-view');

  const rawId = getQueryParam('id');
  const id = rawId ? sanitizeId(rawId) : null;

  try {
    if (id) {
      // Certificate branch: load config + attendee data in parallel
      const results = await Promise.all([fetchConfig(), fetchAttendee(id)]);
      const config = results[0];
      const attendee = results[1];
      validateConfig(config);
      validateAttendee(attendee);
      applyConfigVars(config);
      if (config.site_title) {
        document.title = config.site_title;
      }
      renderCertificateView(config, attendee);
      showView('certificate-view');
    } else {
      // No id: show search view
      const config = await fetchConfig();
      validateConfig(config);
      applyConfigVars(config);
      if (config.site_title) {
        document.title = config.site_title;
      }
      showView('search-view');
    }
  } catch (err) {
    console.error('[App] init error:', err);
    showError(id);
  }
}

// === Config Loader ===

async function fetchConfig() {
  const res = await fetch('config/certificate.config.json');
  if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
  return res.json();
}

function validateConfig(config) {
  const required = ['org_name', 'primary_color', 'certificate_title'];
  for (const field of required) {
    if (!config[field]) throw new Error(`Invalid config: missing required field "${field}"`);
  }
}

// === Attendee Loader ===

async function fetchAttendee(id) {
  const response = await fetch('data/' + id + '.json');
  if (!response.ok) {
    throw new Error('Certificate not found for: ' + id);
  }
  return response.json();
}

function validateAttendee(attendee) {
  const required = ['certificate_id', 'name', 'email', 'workshop', 'date', 'date_iso'];
  for (let i = 0; i < required.length; i++) {
    if (!attendee[required[i]]) {
      throw new Error('Attendee data is missing required field: ' + required[i]);
    }
  }
}

// === Certificate Renderer ===

/**
 * Set an image src gracefully — hides the element if src is empty or the image 404s.
 * IMPORTANT: onerror must be assigned before src to catch immediate failures.
 */
function setImageGraceful(id, src) {
  var el = document.getElementById(id);
  if (!el) return;
  if (!src) {
    el.style.display = 'none';
    return;
  }
  el.onerror = function () {
    this.style.display = 'none';
  };
  el.src = src;
}

/**
 * Populate all certificate HTML slots from config and attendee data.
 * Requires all cert-* IDs to exist in index.html (created by plan 02-01).
 */
function renderCertificateView(config, attendee) {
  // Org header
  var orgNameEl = document.getElementById('cert-org-name');
  if (orgNameEl) orgNameEl.textContent = config.org_name || '';

  setImageGraceful('cert-logo', config.logo_url);
  var logoEl = document.getElementById('cert-logo');
  if (logoEl && config.org_name) logoEl.alt = config.org_name;

  // Title block
  var headingEl = document.getElementById('cert-heading-label');
  if (headingEl) headingEl.textContent = config.certificate_title || 'Certificate';

  // Body: text labels
  var preNameEl = document.getElementById('cert-pre-name-text');
  if (preNameEl) preNameEl.textContent = config.pre_name_text || '';

  var nameEl = document.getElementById('cert-name');
  if (nameEl) nameEl.textContent = attendee.name;

  var postNameEl = document.getElementById('cert-post-name-text');
  if (postNameEl) postNameEl.textContent = config.post_name_text || '';

  var workshopEl = document.getElementById('cert-workshop');
  if (workshopEl) workshopEl.textContent = attendee.workshop;

  // Description: show only when config.show_description is truthy AND attendee has description
  var descEl = document.getElementById('cert-description');
  if (descEl) {
    if (config.show_description && attendee.description) {
      descEl.textContent = attendee.description;
      descEl.classList.remove('hidden');
    } else {
      descEl.classList.add('hidden');
    }
  }

  // Footer: date
  var dateEl = document.getElementById('cert-date');
  if (dateEl) {
    dateEl.textContent = attendee.date;
    dateEl.setAttribute('datetime', attendee.date_iso);
  }

  var dateLabelEl = document.getElementById('cert-date-label');
  if (dateLabelEl) dateLabelEl.textContent = config.date_label || '';

  // Footer: seal (hidden if show_seal === false or seal_url missing)
  if (config.show_seal === false) {
    var sealEl = document.getElementById('cert-seal');
    if (sealEl) sealEl.style.display = 'none';
  } else {
    setImageGraceful('cert-seal', config.seal_url);
  }

  // Footer: signature
  setImageGraceful('cert-signature', config.signature_url);

  var authorizedNameEl = document.getElementById('cert-authorized-name');
  if (authorizedNameEl) authorizedNameEl.textContent = config.signature_name || '';

  var sigLabelEl = document.getElementById('cert-sig-label');
  if (sigLabelEl) sigLabelEl.textContent = config.issued_by_label || '';

  var sealLabelEl = document.getElementById('cert-seal-label');
  if (sealLabelEl) sealLabelEl.textContent = config.seal_label || '';

  // QR code: encode full certificate URL for one-tap verification
  if (config.show_qr !== false) {
    generateQR(config);
  } else {
    var qrEl = document.getElementById('cert-qr');
    if (qrEl) qrEl.parentNode.style.display = 'none';
  }
}

/**
 * Generate a QR code inside #cert-qr that encodes the certificate URL.
 * Uses qrcode.js (window.QRCode) loaded from CDN.
 * Encoded URL = config.org_website if set, otherwise falls back to window.location.href.
 */
function generateQR(config) {
  var container = document.getElementById('cert-qr');
  if (!container || typeof QRCode === 'undefined') return;
  container.innerHTML = '';
  var qrUrl = (config.org_website && config.org_website.trim()) ? config.org_website.trim() : window.location.href;
  new QRCode(container, {
    text: qrUrl,
    width: 68,
    height: 68,
    colorDark: config.primary_color || '#1a2e4a',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });
}

/**
 * Show the error view with an optional certificate-ID-specific message.
 * When id is falsy (config load failed), the hardcoded HTML message is preserved.
 * When id is truthy (certificate not found), updates #error-message and populates #error-detail.
 */
function showError(id) {
  var msgEl = document.getElementById('error-message');
  var detailEl = document.getElementById('error-detail');
  if (id && msgEl) {
    msgEl.textContent = 'Certificate not found.';
    if (detailEl) {
      detailEl.textContent = 'We could not find a certificate for: ' + id;
      detailEl.classList.remove('hidden');
    }
  }
  showView('error-view');
}

// === CSS Variable Injection ===

function applyConfigVars(config) {
  const r = document.documentElement.style;

  // Colors
  r.setProperty('--primary-color',    config.primary_color    || '#1a2e4a');
  r.setProperty('--secondary-color',  config.secondary_color  || '#c8a951');
  r.setProperty('--background-color', config.background_color || '#ffffff');
  r.setProperty('--text-color',       config.text_color       || '#333333');
  r.setProperty('--muted-color',      config.muted_color      || '#777777');

  // Border
  r.setProperty('--border-color', config.border_color || '#c8a951');
  r.setProperty('--border-width', config.border_width || '7px');

  // Fonts
  r.setProperty('--font-heading', config.font_heading || "'Playfair Display', Georgia, serif");
  r.setProperty('--font-body',    config.font_body    || "'Lato', 'Helvetica Neue', sans-serif");

  // Image URLs — only set when the config field is non-empty
  if (config.logo_url)      r.setProperty('--logo-url',      `url(${config.logo_url})`);
  if (config.seal_url)      r.setProperty('--seal-url',      `url(${config.seal_url})`);
  if (config.signature_url) r.setProperty('--signature-url', `url(${config.signature_url})`);
}

// === SPA View System ===

function showView(activeId) {
  const viewIds = ['loading-view', 'search-view', 'certificate-view', 'error-view'];
  viewIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== activeId);
  });
}

// === URL Utilities ===

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function sanitizeId(email) {
  return email
    .toLowerCase()
    .trim()
    .replace(/\+/g, '-plus-')
    .replace(/@/g, '-at-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}
