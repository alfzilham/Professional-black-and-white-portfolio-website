// ════════════════════════════
// LIGHTBOX
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const lbBackdrop  = document.getElementById('lbBackdrop');
  const lbClose     = document.getElementById('lbClose');
  const lbCloseBtn2 = document.getElementById('lbCloseBtn2');
  const lbPrevImg   = document.getElementById('lbPrevImg');
  const lbNextImg   = document.getElementById('lbNextImg');
  const lbPrevTop   = document.getElementById('lbPrevTop');
  const lbNextTop   = document.getElementById('lbNextTop');

  const LB_EXTRA = [
    { client: 'Personal Project' },
    { client: 'Verdura Studio' },
    { client: 'Aether Co.' },
    { client: 'Taskly Inc.' },
    { client: 'Kopihaus Café' },
    { client: 'Nomad Travel' },
    { client: 'Pulse Analytics' },
    { client: 'Freelance' },
    { client: 'Soleil Brand' },
  ];

  let lbCurrentIdx   = 0;
  let lbFilteredList = [];

  function lbOpen(idx, filteredList) {
    lbFilteredList = filteredList;
    lbCurrentIdx   = idx;
    lbRender();
    lbBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function lbCloseModal() {
    lbBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbRender() {
    const p   = lbFilteredList[lbCurrentIdx];
    const ext = LB_EXTRA[p.id - 1] || { client: '—' };

    document.getElementById('lbCounter').textContent =
      String(lbCurrentIdx + 1).padStart(2,'0') + ' / ' + String(lbFilteredList.length).padStart(2,'0');
    document.getElementById('lbTopTitle').textContent = p.title;

    document.getElementById('lbImgBg').style.background = p.thumb;
    document.getElementById('lbImgNum').textContent = String(p.id).padStart(2,'0');

    document.getElementById('lbCat').textContent   = p.cat.replace('-','/').toUpperCase();
    document.getElementById('lbYear').textContent  = p.year;
    document.getElementById('lbTitle').textContent = p.title;
    document.getElementById('lbDesc').textContent  = p.desc;

    const tagsEl = document.getElementById('lbTags');
    tagsEl.innerHTML = p.tags.map(t => `<span class="lb-tag">${t}</span>`).join('');

    document.getElementById('lbMetaCat').textContent    = p.cat.replace('-',' / ');
    document.getElementById('lbMetaYear').textContent   = p.year;
    document.getElementById('lbMetaClient').textContent = ext.client;

    lbPrevImg.disabled = lbCurrentIdx === 0;
    lbNextImg.disabled = lbCurrentIdx === lbFilteredList.length - 1;
    lbPrevTop.disabled = lbCurrentIdx === 0;
    lbNextTop.disabled = lbCurrentIdx === lbFilteredList.length - 1;
  }

  function lbGo(dir) {
    const next = lbCurrentIdx + dir;
    if (next < 0 || next >= lbFilteredList.length) return;
    lbCurrentIdx = next;
    lbRender();
  }

  lbPrevImg.addEventListener('click', () => lbGo(-1));
  lbNextImg.addEventListener('click', () => lbGo(1));
  lbPrevTop.addEventListener('click', () => lbGo(-1));
  lbNextTop.addEventListener('click', () => lbGo(1));

  lbClose.addEventListener('click', lbCloseModal);
  lbCloseBtn2.addEventListener('click', lbCloseModal);
  lbBackdrop.addEventListener('click', e => { if (e.target === lbBackdrop) lbCloseModal(); });

  document.addEventListener('keydown', e => {
    if (!lbBackdrop.classList.contains('open')) return;
    if (e.key === 'Escape')     lbCloseModal();
    if (e.key === 'ArrowLeft')  lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });

  // Hook project card clicks — uses window.PROJECTS exposed by projects.js
  document.addEventListener('click', e => {
    const card = e.target.closest('.prj-card');
    if (!card) return;
    const PROJECTS = window.PROJECTS || [];
    const visibleCards = Array.from(document.querySelectorAll('#prjGrid .prj-card'));
    const visibleIds   = visibleCards.map(c => parseInt(c.dataset.id));
    const filteredList = PROJECTS.filter(p => visibleIds.includes(p.id));
    const clickedId    = parseInt(card.dataset.id);
    const idx          = filteredList.findIndex(p => p.id === clickedId);
    if (idx !== -1) lbOpen(idx, filteredList);
  });
});
