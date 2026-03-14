// ════════════════════════════
// VISITOR COUNTER
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'ar_visitor_data';
  const SESSION_KEY = 'ar_session_counted';
  const today       = new Date().toISOString().slice(0, 10);

  let data;
  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch(e) { data = null; }

  if (!data) {
    data = { total: 4837, unique: 2194, daily: {} };
  }

  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, '1');
    data.total  += 1;
    data.unique += (Math.random() > 0.45) ? 1 : 0;
    data.daily[today] = (data.daily[today] || 0) + 1;
    const days = Object.keys(data.daily).sort();
    while (days.length > 30) { delete data.daily[days.shift()]; }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function animateCount(el, target, duration) {
    if (!el) return;
    const start   = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 4);
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * easeOut(progress)).toLocaleString('id-ID');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const footerEl     = document.getElementById('footer');
  const counterNumEl = document.getElementById('ftCounterNum');
  const todayNumEl   = document.getElementById('ftTodayNum');
  const uniqueNumEl  = document.getElementById('ftUniqueNum');
  const todayCount   = data.daily[today] || 0;
  let animated       = false;

  const ftObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      animateCount(counterNumEl, data.total,  1800);
      animateCount(todayNumEl,   todayCount,   900);
      animateCount(uniqueNumEl,  data.unique, 1500);
      ftObserver.disconnect();
    }
  }, { threshold: 0.15 });
  if (footerEl) ftObserver.observe(footerEl);

  // Build 7-day sparkline bars
  const barChart = document.getElementById('ftBarChart');
  if (barChart) {
    const days7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days7.push(d.toISOString().slice(0, 10));
    }

    function seededRand(seed) {
      let s = seed;
      return function() {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
      };
    }

    const vals = days7.map((d, i) => {
      if (data.daily[d] !== undefined) return data.daily[d];
      const rng = seededRand(d.split('-').join('') * 1 + i);
      return Math.floor(rng() * 80 + 20);
    });

    const maxVal   = Math.max(...vals, 1);
    const todayIdx = days7.indexOf(today);

    vals.forEach((v, i) => {
      const bar = document.createElement('div');
      bar.className = 'ft-bar' + (i === todayIdx ? ' active' : '');
      bar.style.height = Math.max(8, Math.round((v / maxVal) * 36)) + 'px';
      bar.title = days7[i] + ': ' + v + ' views';
      barChart.appendChild(bar);
    });

    const startLabelEl = document.getElementById('ftBarStart');
    if (startLabelEl) {
      const d0 = new Date(days7[0] + 'T00:00:00');
      startLabelEl.textContent = d0.toLocaleDateString('id-ID', { weekday: 'short' });
    }
  }
});
