// ════════════════════════════
// FAQ ACCORDION
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const FAQS = [
    { q: 'Berapa lama biasanya proyek UI/UX design selesai?', a: 'Durasi pengerjaan bervariasi tergantung kompleksitas proyek. <strong>Landing page</strong> biasanya 5&ndash;7 hari, <strong>aplikasi mobile</strong> 2&ndash;4 minggu, dan <strong>design system lengkap</strong> bisa memakan waktu 4&ndash;8 minggu. Saya selalu menyepakati timeline yang jelas di awal sebelum pekerjaan dimulai.' },
    { q: 'Apakah kamu menerima proyek dari luar Indonesia?', a: 'Ya, saya menerima klien dari seluruh dunia. Saya terbiasa bekerja secara remote dan berkomunikasi dalam <strong>Bahasa Indonesia maupun Inggris</strong>. Pembayaran dapat dilakukan melalui transfer bank lokal maupun internasional.' },
    { q: 'Apa saja yang termasuk dalam paket branding?', a: 'Paket branding standar mencakup: <strong>logo (3 variasi)</strong>, color palette, tipografi primer &amp; sekunder, brand guidelines dokumen, dan aplikasi mockup dasar (kartu nama, letterhead, media sosial). Paket dapat dikustomisasi sesuai kebutuhan.' },
    { q: 'Bagaimana proses pembayaran yang kamu terapkan?', a: 'Saya menerapkan sistem <strong>50% di awal</strong> sebagai tanda jadi, dan <strong>50% setelah final delivery</strong> disetujui. Untuk proyek besar (&gt; 10 juta), dapat dinegosiasikan menjadi 3 tahap pembayaran: 40% &ndash; 30% &ndash; 30%.' },
    { q: 'Apakah kamu bisa langsung coding setelah design selesai?', a: 'Ya! Saya menawarkan layanan <strong>design-to-code</strong> menggunakan HTML, CSS, JavaScript, dan React. Ini memastikan hasil implementasi 100% sesuai dengan desain tanpa distorsi, karena dikerjakan oleh orang yang sama yang merancang UI-nya.' },
    { q: 'Berapa revisi yang didapat dalam satu paket?', a: 'Setiap paket sudah mencakup <strong>3 putaran revisi gratis</strong> setelah presentasi pertama. Revisi tambahan dikenakan biaya yang transparan dan disepakati bersama. Saya selalu memastikan klien puas sebelum proyek dinyatakan selesai.' },
    { q: 'File apa saja yang akan saya terima setelah proyek selesai?', a: 'Kamu akan mendapatkan: <strong>file Figma (.fig)</strong> dengan semua layer terorganisir, export asset dalam format PNG/SVG/WebP, dokumentasi design system (jika ada), dan source code (untuk proyek frontend). Semua file diserahkan melalui Google Drive.' },
  ];

  const faqList = document.getElementById('faqList');
  if (!faqList) return;

  FAQS.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <button class="faq-question" aria-expanded="false">
        <div class="faq-q-left">
          <span class="faq-q-num">${String(i+1).padStart(2,'0')}</span>
          <span class="faq-q-text">${item.q}</span>
        </div>
        <div class="faq-icon"></div>
      </button>
      <div class="faq-answer" role="region">
        <div class="faq-answer-inner">
          <div class="faq-answer-body">${item.a}</div>
        </div>
      </div>`;

    const btn = el.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = el.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(x => {
        x.classList.remove('open');
        x.querySelector('.faq-question').setAttribute('aria-expanded','false');
      });
      if (!isOpen) {
        el.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });

    faqList.appendChild(el);
  });

  // Open first item by default
  const first = faqList.querySelector('.faq-item');
  if (first) {
    first.classList.add('open');
    first.querySelector('.faq-question').setAttribute('aria-expanded','true');
  }
});
