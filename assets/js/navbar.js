// ════════════════════════════
// NAVBAR — hide / show on scroll
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScrollY  = window.scrollY;
  let ticking      = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY > lastScrollY && currentY > 80) {
          navbar.classList.add('hidden');
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
        } else {
          navbar.classList.remove('hidden');
        }
        navbar.classList.toggle('scrolled', currentY > 10);
        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));
});
