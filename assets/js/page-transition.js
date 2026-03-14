// ════════════════════════════
// PAGE TRANSITION — DIAGONAL
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const ptOverlay  = document.getElementById('ptOverlay');
  const ptLogoWrap = document.getElementById('ptLogoWrap');

  function ptEnter(cb) {
    ptOverlay.classList.remove('pt-exit');
    void ptOverlay.offsetWidth;
    ptOverlay.classList.add('pt-enter');
    ptLogoWrap.classList.add('pt-logo-visible');
    setTimeout(() => { if (cb) cb(); }, 800);
  }

  function ptExit(cb) {
    ptLogoWrap.classList.remove('pt-logo-visible');
    ptOverlay.classList.remove('pt-enter');
    void ptOverlay.offsetWidth;
    ptOverlay.classList.add('pt-exit');
    setTimeout(() => {
      ptOverlay.classList.remove('pt-exit');
      if (cb) cb();
    }, 800);
  }

  // Initial page-load reveal
  ptOverlay.querySelectorAll('.pt-panel').forEach(p => {
    p.style.transform = 'translateX(0%) skewX(-8deg)';
    p.style.animation = 'none';
  });
  window.addEventListener('load', () => {
    setTimeout(() => {
      ptOverlay.querySelectorAll('.pt-panel').forEach(p => {
        p.style.transform = '';
        p.style.animation = '';
      });
      ptExit();
    }, 200);
  });

  // Intercept internal page links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || link.hasAttribute('download')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      ptEnter(() => { window.location.href = href; });
    });
  });
});
