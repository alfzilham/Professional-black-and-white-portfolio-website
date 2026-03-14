// ════════════════════════════
// ABOUT SKILL BARS
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const aboutFills = aboutSection.querySelectorAll('.about-skill-fill');
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutFills.forEach(el => { el.style.width = el.dataset.w + '%'; });
        aboutObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  aboutObserver.observe(aboutSection);
});
