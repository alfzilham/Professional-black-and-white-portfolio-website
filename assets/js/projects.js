// ════════════════════════════
// PROJECT SECTION
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const PROJECTS = [
    { id:1, title:'Fintrack Dashboard',   cat:'ui-ux',    year:'2024', desc:'Dashboard keuangan personal dengan visualisasi data real-time dan UX yang bersih.', tags:['Figma','Dashboard','Finance'], thumb:'#1a1a1a' },
    { id:2, title:'Verdura Landing Page', cat:'frontend',  year:'2024', desc:'Landing page untuk brand makanan organik dengan animasi scroll yang smooth.', tags:['HTML','CSS','JS'], thumb:'#141a14' },
    { id:3, title:'Aether Brand Identity',cat:'branding',  year:'2023', desc:'Identitas visual lengkap untuk startup SaaS — logo, palette, tipografi, mockup.', tags:['Illustrator','Branding'], thumb:'#1a1419' },
    { id:4, title:'Taskly Mobile App',    cat:'ui-ux',    year:'2023', desc:'Aplikasi manajemen tugas untuk iOS & Android dengan sistem drag-and-drop.', tags:['Figma','Mobile','UX'], thumb:'#14181a' },
    { id:5, title:'Kopihaus Website',     cat:'frontend',  year:'2023', desc:'Website kafe lokal dengan sistem reservasi online dan menu interaktif.', tags:['React','Tailwind'], thumb:'#1a1614' },
    { id:6, title:'Nomad Branding',       cat:'branding',  year:'2022', desc:'Rebranding agensi travel — logo baru, color system, dan brand guidelines 40 halaman.', tags:['Branding','Logo','Guide'], thumb:'#161a14' },
    { id:7, title:'Pulse Analytics UI',   cat:'ui-ux',    year:'2022', desc:'Interface analytics SaaS dengan dark mode dan komponen yang mudah dikustomisasi.', tags:['Figma','SaaS','Dark UI'], thumb:'#1a1a1a' },
    { id:8, title:'Breeze Portfolio',     cat:'frontend',  year:'2022', desc:'Template portofolio untuk fotografer dengan galeri full-screen dan lazy loading.', tags:['HTML','CSS','GSAP'], thumb:'#141a18' },
    { id:9, title:'Soleil Visual Brand',  cat:'branding',  year:'2022', desc:'Identitas visual untuk brand fashion lokal — elegant, minimal, dan timeless.', tags:['Branding','Fashion','XD'], thumb:'#1a1518' },
  ];

  // Expose globally so lightbox.js can access it
  window.PROJECTS = PROJECTS;

  const PRJ_BATCH = 6;
  let prjShown = 0;
  let prjActiveFilter = 'all';

  const prjGrid     = document.getElementById('prjGrid');
  const prjLoadBtn  = document.getElementById('prjLoadBtn');
  const prjCountEl  = document.getElementById('prjCount');
  const prjProgress = document.getElementById('prjProgressFill');

  function prjFiltered() {
    return prjActiveFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === prjActiveFilter);
  }

  function prjMakeCard(p, delay) {
    return `<div class="prj-card" data-cat="${p.cat}" data-id="${p.id}" style="animation-delay:${delay}s;cursor:pointer;">
      <div class="prj-thumb" style="background:${p.thumb}">
        <div class="prj-thumb-num">${String(p.id).padStart(2,'0')}</div>
        <div class="prj-thumb-overlay"><button class="prj-view-btn">View Project &#8599;</button></div>
      </div>
      <div class="prj-card-body">
        <div class="prj-card-meta">
          <span class="prj-card-cat">${p.cat.replace('-','/')}</span>
          <span class="prj-card-year">${p.year}</span>
        </div>
        <div class="prj-card-title">${p.title}</div>
        <p class="prj-card-desc">${p.desc}</p>
      </div>
      <div class="prj-card-footer">
        <div class="prj-card-tags">${p.tags.map(t=>`<span class="prj-card-tag">${t}</span>`).join('')}</div>
        <span class="prj-card-arrow">&#8599;</span>
      </div>
    </div>`;
  }

  function prjUpdateUI() {
    const total = prjFiltered().length;
    const shown = Math.min(prjShown, total);
    prjCountEl.textContent = `Showing ${shown} of ${total} projects`;
    prjProgress.style.width = ((shown / total) * 100) + '%';
    if (prjShown >= total) {
      prjLoadBtn.disabled = true;
      prjLoadBtn.querySelector('.btn-txt').textContent = 'All projects loaded';
    } else {
      prjLoadBtn.disabled = false;
      prjLoadBtn.querySelector('.btn-txt').textContent = 'Load more projects';
    }
  }

  function prjRenderBatch() {
    const list = prjFiltered();
    const next = list.slice(prjShown, prjShown + PRJ_BATCH);
    next.forEach((p, i) => {
      prjGrid.insertAdjacentHTML('beforeend', prjMakeCard(p, i * 0.07));
    });
    prjShown += next.length;
    prjUpdateUI();
  }

  function prjReset() {
    prjGrid.innerHTML = '';
    prjShown = 0;
    prjLoadBtn.disabled = false;
    prjRenderBatch();
  }

  if (prjGrid) {
    document.querySelectorAll('.prj-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.prj-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        prjActiveFilter = btn.dataset.filter;
        prjReset();
      });
    });

    prjLoadBtn.addEventListener('click', () => {
      prjLoadBtn.classList.add('loading');
      prjLoadBtn.disabled = true;
      setTimeout(() => {
        prjLoadBtn.classList.remove('loading');
        prjRenderBatch();
      }, 600);
    });

    prjReset();
  }
});
