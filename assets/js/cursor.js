// ════════════════════════════
// CUSTOM CURSOR
// ════════════════════════════
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const ring  = document.getElementById('curRing');
  const dot   = document.getElementById('curDot');
  const label = document.getElementById('curLabel');
  if (!ring || !dot) return;

  let mouseX = -300, mouseY = -300;
  let ringX  = -300, ringY  = -300;

  const LERP = 0.14;
  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    ringX = lerp(ringX, mouseX, LERP);
    ringY = lerp(ringY, mouseY, LERP);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    if (label) {
      label.style.left = ringX + 'px';
      label.style.top  = ringY + 'px';
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => document.body.classList.add('cur-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cur-hidden'));
  document.addEventListener('mousedown',  () => document.body.classList.add('cur-click'));
  document.addEventListener('mouseup',    () => document.body.classList.remove('cur-click'));

  const STATES = ['cur-hover','cur-text','cur-link','cur-view','cur-drag','cur-disabled'];

  function clearStates() {
    document.body.classList.remove(...STATES);
    if (label) label.textContent = '';
  }

  function setState(state, labelText) {
    clearStates();
    document.body.classList.add(state);
    if (label && labelText) label.textContent = labelText;
  }

  document.addEventListener('mouseover', e => {
    const el = e.target;

    if (el.closest('.prj-card'))       { setState('cur-view', 'View'); return; }
    if (el.closest('.tsm-track-wrap')) { setState('cur-drag', 'Drag'); return; }

    const anchor = el.closest('a[href]');
    if (anchor) {
      const href = anchor.getAttribute('href') || '';
      setState('cur-link', (href.startsWith('http') || href.startsWith('mailto')) ? 'Open ↗' : '');
      return;
    }

    if (el.closest('button[disabled]')) { setState('cur-disabled', ''); return; }

    if (el.matches('input, textarea, select') ||
        el.closest('input[type="text"], input[type="email"], textarea, select')) {
      setState('cur-text', ''); return;
    }

    if (el.closest('button, [role="button"], .svc-card, .faq-question, .ct-detail-item, .ft-social-btn, .lb-nav-btn, .lb-icon-btn, .nav-hamburger, .prj-filter-btn, .tsm-nav-btn')) {
      setState('cur-hover', ''); return;
    }

    clearStates();
  });

  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget || e.relatedTarget === document.body) clearStates();
  });
})();
