// ══════════════════════════════════════════════
//  Portfolio Contact Form — Node.js + Nodemailer
//  Usage: node server.js  |  npm run dev
// ══════════════════════════════════════════════

require('dotenv').config();

const express     = require('express');
const nodemailer  = require('nodemailer');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow only your portfolio origin
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['POST'],
}));

// Rate limit: max 5 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 5,
  message  : { success: false, message: 'Terlalu banyak permintaan. Coba lagi dalam 15 menit.' },
});
app.use('/send', limiter);


// ── Nodemailer transporter ──────────────────
const transporter = nodemailer.createTransport({
  host   : process.env.SMTP_HOST   || 'smtp.gmail.com',
  port   : parseInt(process.env.SMTP_PORT) || 465,
  secure : process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((err) => {
  if (err) {
    console.error('❌  SMTP connection error:', err.message);
  } else {
    console.log('✅  SMTP connection ready');
  }
});


// ── Input sanitiser ────────────────────────
function sanitize(str = '') {
  return String(str)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
    .slice(0, 1000);
}


// ── POST /send ──────────────────────────────
app.post('/send', async (req, res) => {
  const { name, email, service, budget, subject, message } = req.body;

  // ── Server-side validation ──
  const errors = [];
  if (!name    || name.trim().length < 2)                           errors.push('Nama tidak valid.');
  if (!email   || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Email tidak valid.');
  if (!subject || subject.trim().length < 3)                        errors.push('Subjek tidak valid.');
  if (!message || message.trim().length < 6)                        errors.push('Pesan terlalu pendek.');

  if (errors.length) {
    return res.status(422).json({ success: false, message: errors.join(' ') });
  }

  // ── Sanitise ──
  const safeName    = sanitize(name);
  const safeEmail   = sanitize(email);
  const safeService = sanitize(service  || '—');
  const safeBudget  = sanitize(budget   || '—');
  const safeSubject = sanitize(subject);
  const safeMsg     = sanitize(message);

  // ── Build email ──
  const htmlBody = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body        { font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f3; margin:0; padding:0; }
    .wrap       { max-width:600px; margin:32px auto; background:#fff; border:1px solid #e0e0e0; }
    .header     { background:#0a0a0a; padding:28px 32px; }
    .header h1  { color:#fff; margin:0; font-size:18px; font-weight:700; letter-spacing:-0.02em; }
    .header p   { color:rgba(240,240,240,0.45); margin:4px 0 0; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; }
    .body       { padding:28px 32px; }
    .row        { margin-bottom:20px; }
    .label      { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#999; margin-bottom:4px; }
    .value      { font-size:14px; color:#0a0a0a; font-weight:500; }
    .msg-box    { background:#f5f5f3; border-left:3px solid #0a0a0a; padding:16px 20px; margin-top:8px; }
    .msg-box p  { margin:0; font-size:14px; color:#333; line-height:1.7; }
    .grid       { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .footer     { border-top:1px solid #e8e8e8; padding:16px 32px; font-size:11px; color:#aaa; }
    .badge      { display:inline-block; padding:3px 10px; background:#0a0a0a; color:#fff; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Pesan Baru — Portfolio</h1>
      <p>Abdal Rabbani · UI/UX &amp; Frontend</p>
    </div>
    <div class="body">
      <div class="grid">
        <div class="row">
          <div class="label">Nama</div>
          <div class="value">${safeName}</div>
        </div>
        <div class="row">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:${safeEmail}" style="color:#0a0a0a;">${safeEmail}</a></div>
        </div>
        <div class="row">
          <div class="label">Layanan</div>
          <div class="value">${safeService}</div>
        </div>
        <div class="row">
          <div class="label">Budget</div>
          <div class="value">${safeBudget}</div>
        </div>
      </div>
      <div class="row">
        <div class="label">Subjek</div>
        <div class="value">${safeSubject}</div>
      </div>
      <div class="row">
        <div class="label">Pesan</div>
        <div class="msg-box"><p>${safeMsg.replace(/\n/g, '<br>')}</p></div>
      </div>
    </div>
    <div class="footer">
      Dikirim dari portfolio · ${new Date().toLocaleString('id-ID')}
      &nbsp;&nbsp;<span class="badge">Node.js</span>
    </div>
  </div>
</body>
</html>`;

  const mailOptions = {
    from    : `"${process.env.MAIL_FROM_NAME || 'Portfolio'}" <${process.env.MAIL_FROM_ADDR}>`,
    to      : process.env.MAIL_TO,
    replyTo : safeEmail,
    subject : `[Portfolio] ${safeSubject}`,
    html    : htmlBody,
    text    : `Dari: ${safeName} <${safeEmail}>\nLayanan: ${safeService}\nBudget: ${safeBudget}\nSubjek: ${safeSubject}\n\n${safeMsg}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩  Email sent from ${safeEmail} — "${safeSubject}"`);
    return res.json({ success: true, message: 'Pesan berhasil dikirim!' });
  } catch (err) {
    console.error('❌  Send error:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengirim pesan. Coba lagi nanti.' });
  }
});


// ── Health check ────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));


// ── 404 ─────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));


// ── Start ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}`);
});
