// ════════════════════════════
// BACK TO TOP
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const ftBackTopBtn = document.getElementById('ftBackTop');
  if (!ftBackTopBtn) return;

  ftBackTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
