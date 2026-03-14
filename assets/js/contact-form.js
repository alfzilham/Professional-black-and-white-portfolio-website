// ════════════════════════════
// CONTACT FORM
// ════════════════════════════

// ── Set ONE of these to match your setup ──────
//  PHP  → point to send-mail.php
//  Node → point to Node.js server /send endpoint
// const FORM_ENDPOINT = 'backend/send-mail.php';
const FORM_ENDPOINT = 'http://localhost:3000/send';

window.addEventListener('DOMContentLoaded', () => {
  const ctForm      = document.getElementById('ctForm');
  const ctSuccess   = document.getElementById('ctSuccess');
  const ctSubmitBtn = document.getElementById('ctSubmitBtn');

  if (!ctForm) return;

  // ── Client-side validation ──────────────────
  function ctValidate() {
    let valid = true;
    const fields = [
      { id:'fieldName',    input:'ctName',    check: v => v.trim().length > 1 },
      { id:'fieldEmail',   input:'ctEmail',   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id:'fieldSubject', input:'ctSubject', check: v => v.trim().length > 2 },
      { id:'fieldMsg',     input:'ctMsg',     check: v => v.trim().length > 5 },
    ];
    fields.forEach(f => {
      const field = document.getElementById(f.id);
      const val   = document.getElementById(f.input).value;
      if (!f.check(val)) { field.classList.add('error'); valid = false; }
      else               { field.classList.remove('error'); }
    });
    return valid;
  }

  // Live error clear on input
  ['ctName','ctEmail','ctSubject','ctMsg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      const field = el.closest('.ct-field');
      if (field) field.classList.remove('error');
    });
  });

  // ── Show error banner inside form ───────────
  function showFormError(msg) {
    let banner = document.getElementById('ctErrorBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'ctErrorBanner';
      banner.style.cssText = [
        'padding:0.75rem 1rem',
        'background:rgba(248,113,113,0.08)',
        'border:1px solid rgba(248,113,113,0.3)',
        'color:rgba(248,113,113,0.9)',
        'font-size:0.75rem',
        'letter-spacing:0.03em',
        'margin-bottom:1rem',
      ].join(';');
      ctForm.prepend(banner);
    }
    banner.textContent = msg;
    banner.style.display = 'block';
  }

  function hideFormError() {
    const banner = document.getElementById('ctErrorBanner');
    if (banner) banner.style.display = 'none';
  }

  // ── Submit ───────────────────────────────────
  ctForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormError();

    if (!ctValidate()) return;

    // Set sending state
    ctSubmitBtn.classList.add('sending');
    ctSubmitBtn.disabled = true;

    // Collect form data
    const payload = {
      name   : document.getElementById('ctName').value.trim(),
      email  : document.getElementById('ctEmail').value.trim(),
      service: document.getElementById('ctService')?.value || '',
      budget : document.getElementById('ctBudget')?.value  || '',
      subject: document.getElementById('ctSubject').value.trim(),
      message: document.getElementById('ctMsg').value.trim(),
    };

    try {
      const res  = await fetch(FORM_ENDPOINT, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // ── Success ──
        ctForm.style.display = 'none';
        ctSuccess.classList.add('show');
      } else {
        // ── Server-side error ──
        showFormError(data.message || 'Terjadi kesalahan. Coba lagi nanti.');
        ctSubmitBtn.classList.remove('sending');
        ctSubmitBtn.disabled = false;
      }

    } catch (err) {
      // ── Network error ──
      showFormError('Gagal terhubung ke server. Periksa koneksi internet kamu.');
      ctSubmitBtn.classList.remove('sending');
      ctSubmitBtn.disabled = false;
      console.error('[Contact Form]', err);
    }
  });
});
