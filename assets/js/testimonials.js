// ════════════════════════════
// TESTIMONIAL CAROUSEL
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const TESTIMONIALS = [
    { name:'Sarah Amelia',  role:'CEO, Verdura Studio',         badge:'UI/UX',    initials:'SA', stars:5, quote:'Abdal benar-benar memahami apa yang kami butuhkan. Hasilnya <strong>melampaui ekspektasi</strong> kami — desainnya bersih, intuitif, dan langsung diterima baik oleh pengguna kami.' },
    { name:'Reza Mahendra', role:'Founder, Kopihaus',           badge:'Frontend', initials:'RM', stars:5, quote:'Website kami sekarang terlihat jauh lebih profesional. Proses kerja Abdal sangat terstruktur dan <strong>komunikasinya sangat responsif</strong>. Highly recommended!' },
    { name:'Dina Pratiwi',  role:'Brand Manager, Aether Co.',   badge:'Branding', initials:'DP', stars:5, quote:'Brand identity yang dibuat Abdal <strong>benar-benar merepresentasikan nilai perusahaan</strong> kami. Tim internal kami langsung jatuh cinta dengan hasilnya.' },
    { name:'Farid Akbar',   role:'Product Manager, Pulse',      badge:'UI/UX',    initials:'FA', stars:5, quote:'Dashboard yang dirancang Abdal memudahkan tim kami membaca data dengan cepat. <strong>Kualitasnya setara agensi besar</strong>, tapi komunikasinya jauh lebih personal.' },
    { name:'Layla Nurfitri',role:'Director, Nomad Travel',      badge:'Branding', initials:'LN', stars:5, quote:'Proses rebranding berjalan mulus dari awal hingga akhir. Abdal sangat detail dan <strong>proaktif memberikan masukan</strong> yang membuat hasil akhirnya semakin sempurna.' },
    { name:'Bima Santoso',  role:'CTO, Taskly App',             badge:'UI/UX',    initials:'BS', stars:5, quote:'Abdal berhasil menerjemahkan kebutuhan kompleks kami menjadi UI yang simpel. <strong>Developer kami langsung bisa implement</strong> — design system-nya sangat lengkap.' },
  ];

  const tsmTrack    = document.getElementById('tsmTrack');
  const tsmDotsWrap = document.getElementById('tsmDots');
  const tsmPrevBtn  = document.getElementById('tsmPrev');
  const tsmNextBtn  = document.getElementById('tsmNext');

  if (!tsmTrack) return;

  let tsmCurrent = 0;
  const tsmVisible = window.innerWidth <= 900 ? 1 : 3;
  const tsmTotal   = TESTIMONIALS.length;
  const tsmMaxIdx  = tsmTotal - tsmVisible;

  function tsmStars(n) {
    return Array.from({length:5}, (_,i) =>
      `<span class="tsm-star"><svg viewBox="0 0 12 12"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" fill="${i < n ? 'rgba(240,240,240,0.8)' : 'rgba(240,240,240,0.12)'}"/></svg></span>`
    ).join('');
  }

  TESTIMONIALS.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'tsm-card' + (i === 0 ? ' active' : '');
    card.innerHTML = `
      <div class="tsm-quote-mark">"</div>
      <div class="tsm-stars">${tsmStars(t.stars)}</div>
      <p class="tsm-quote">"${t.quote}"</p>
      <div class="tsm-card-divider"></div>
      <div class="tsm-author">
        <div class="tsm-avatar">${t.initials}</div>
        <div class="tsm-author-info">
          <div class="tsm-author-name">${t.name}</div>
          <div class="tsm-author-role">${t.role}</div>
        </div>
        <div class="tsm-author-badge">${t.badge}</div>
      </div>`;
    tsmTrack.appendChild(card);
  });

  const tsmDots = [];
  Array.from({length: tsmMaxIdx + 1}, (_, i) => {
    const d = document.createElement('div');
    d.className = 'tsm-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => tsmGoTo(i));
    tsmDotsWrap.appendChild(d);
    tsmDots.push(d);
  });

  function tsmGoTo(idx) {
    tsmCurrent = Math.max(0, Math.min(idx, tsmMaxIdx));
    const cardW = tsmTrack.children[0].offsetWidth + 24;
    tsmTrack.style.transform = `translateX(-${tsmCurrent * cardW}px)`;
    Array.from(tsmTrack.children).forEach((c, i) => c.classList.toggle('active', i === tsmCurrent));
    tsmDots.forEach((d, i) => d.classList.toggle('active', i === tsmCurrent));
    tsmPrevBtn.disabled = tsmCurrent === 0;
    tsmNextBtn.disabled = tsmCurrent >= tsmMaxIdx;
  }

  tsmPrevBtn.addEventListener('click', () => tsmGoTo(tsmCurrent - 1));
  tsmNextBtn.addEventListener('click', () => tsmGoTo(tsmCurrent + 1));

  let tsmAuto = setInterval(() => tsmGoTo(tsmCurrent >= tsmMaxIdx ? 0 : tsmCurrent + 1), 4500);
  tsmTrack.addEventListener('mouseenter', () => clearInterval(tsmAuto));
  tsmTrack.addEventListener('mouseleave', () => {
    tsmAuto = setInterval(() => tsmGoTo(tsmCurrent >= tsmMaxIdx ? 0 : tsmCurrent + 1), 4500);
  });

  tsmGoTo(0);
});
