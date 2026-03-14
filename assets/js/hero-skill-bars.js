// ════════════════════════════
// HERO SKILL BARS
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero-skill-fill').forEach(el => {
      el.style.width = el.dataset.w + '%';
    });
  }, 800);
});
