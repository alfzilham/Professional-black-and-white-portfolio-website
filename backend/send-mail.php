<?php
// ══════════════════════════════════════════════
//  Portfolio Contact Form — PHP + PHPMailer
//  Requires: composer require phpmailer/phpmailer
// ══════════════════════════════════════════════

declare(strict_types=1);

// ── CORS ─────────────────────────────────────
$allowedOrigin = getenv('ALLOWED_ORIGIN') ?: '*';
header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}


// ── Rate limiting (file-based, lightweight) ──
$rateLimitDir  = sys_get_temp_dir() . '/portfolio_rl';
$clientIp      = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$clientIp      = explode(',', $clientIp)[0];
$rateLimitFile = $rateLimitDir . '/' . md5($clientIp) . '.json';
$windowSec     = 900; // 15 minutes
$maxRequests   = 5;

if (!is_dir($rateLimitDir)) {
    mkdir($rateLimitDir, 0700, true);
}

$rl = file_exists($rateLimitFile)
    ? json_decode(file_get_contents($rateLimitFile), true)
    : ['count' => 0, 'reset' => time() + $windowSec];

if (time() > $rl['reset']) {
    $rl = ['count' => 0, 'reset' => time() + $windowSec];
}

if ($rl['count'] >= $maxRequests) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Terlalu banyak permintaan. Coba lagi dalam 15 menit.']);
    exit;
}

$rl['count']++;
file_put_contents($rateLimitFile, json_encode($rl));


// ── Parse input (JSON or form-data) ──────────
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (str_contains($contentType, 'application/json')) {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
} else {
    $body = $_POST;
}

function getField(array $body, string $key): string {
    return trim((string)($body[$key] ?? ''));
}

$name    = getField($body, 'name');
$email   = getField($body, 'email');
$service = getField($body, 'service')  ?: '—';
$budget  = getField($body, 'budget')   ?: '—';
$subject = getField($body, 'subject');
$message = getField($body, 'message');


// ── Validation ────────────────────────────────
$errors = [];
if (mb_strlen($name)    < 2)                      $errors[] = 'Nama tidak valid.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))   $errors[] = 'Email tidak valid.';
if (mb_strlen($subject) < 3)                      $errors[] = 'Subjek tidak valid.';
if (mb_strlen($message) < 6)                      $errors[] = 'Pesan terlalu pendek.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}


// ── Sanitise ──────────────────────────────────
function sanitize(string $str): string {
    return htmlspecialchars(mb_substr($str, 0, 1000), ENT_QUOTES, 'UTF-8');
}

$safeName    = sanitize($name);
$safeEmail   = sanitize($email);
$safeService = sanitize($service);
$safeBudget  = sanitize($budget);
$safeSubject = sanitize($subject);
$safeMsg     = nl2br(sanitize($message));
$safeDate    = date('d M Y, H:i', time());


// ── Load PHPMailer ────────────────────────────
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;


// ── SMTP config (from .env or define here) ───
$smtpHost   = getenv('SMTP_HOST')   ?: 'smtp.gmail.com';
$smtpPort   = (int)(getenv('SMTP_PORT')  ?: 465);
$smtpSecure = getenv('SMTP_SECURE') === 'false' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
$smtpUser   = getenv('SMTP_USER')   ?: 'your-email@gmail.com';
$smtpPass   = getenv('SMTP_PASS')   ?: 'your-app-password';
$mailFrom   = getenv('MAIL_FROM_ADDR') ?: $smtpUser;
$mailFromN  = getenv('MAIL_FROM_NAME') ?: 'Portfolio Contact Form';
$mailTo     = getenv('MAIL_TO')     ?: $smtpUser;


// ── HTML email template ───────────────────────
$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body        { font-family:'Segoe UI',Arial,sans-serif; background:#f5f5f3; margin:0; padding:0; }
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
    .grid       { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
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
          <div class="value">{$safeName}</div>
        </div>
        <div class="row">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:{$safeEmail}" style="color:#0a0a0a;">{$safeEmail}</a></div>
        </div>
        <div class="row">
          <div class="label">Layanan</div>
          <div class="value">{$safeService}</div>
        </div>
        <div class="row">
          <div class="label">Budget</div>
          <div class="value">{$safeBudget}</div>
        </div>
      </div>
      <div class="row">
        <div class="label">Subjek</div>
        <div class="value">{$safeSubject}</div>
      </div>
      <div class="row">
        <div class="label">Pesan</div>
        <div class="msg-box"><p>{$safeMsg}</p></div>
      </div>
    </div>
    <div class="footer">
      Dikirim dari portfolio · {$safeDate}
      &nbsp;&nbsp;<span class="badge">PHP + PHPMailer</span>
    </div>
  </div>
</body>
</html>
HTML;


// ── Send email ────────────────────────────────
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort;
    $mail->CharSet    = 'UTF-8';

    // From / To
    $mail->setFrom($mailFrom, $mailFromN);
    $mail->addAddress($mailTo);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = '[Portfolio] ' . $subject;
    $mail->Body    = $htmlBody;
    $mail->AltBody = "Dari: {$name} <{$email}>\nLayanan: {$service}\nBudget: {$budget}\nSubjek: {$subject}\n\n{$message}";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Pesan berhasil dikirim!']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal mengirim pesan. Coba lagi nanti.']);
    // Log internally, never expose mailer error to client
    error_log('[Portfolio Mailer] ' . $mail->ErrorInfo);
}
