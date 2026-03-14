// ════════════════════════════
// CTA — Lihat CV button
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const ctaOpenCvBtn = document.getElementById('ctaOpenCv');
  if (!ctaOpenCvBtn) return;

  ctaOpenCvBtn.addEventListener('click', () => {
    // Uses openCvModal exposed globally by cv-modal.js
    if (typeof window.openCvModal === 'function') {
      window.openCvModal();
    }
  });
});
