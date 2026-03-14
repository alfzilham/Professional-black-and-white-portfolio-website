// ════════════════════════════
// CV DOWNLOAD MODAL
// ════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const cvModalBackdrop = document.getElementById('cvModalBackdrop');
  const openCvModalBtn  = document.getElementById('openCvModal');
  const cvModalClose    = document.getElementById('cvModalClose');
  const cvCancelBtn     = document.getElementById('cvCancelBtn');

  function openCvModal() {
    cvModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCvModal() {
    cvModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openCvModalBtn) openCvModalBtn.addEventListener('click', openCvModal);
  if (cvModalClose)   cvModalClose.addEventListener('click', closeCvModal);
  if (cvCancelBtn)    cvCancelBtn.addEventListener('click', closeCvModal);

  cvModalBackdrop.addEventListener('click', (e) => {
    if (e.target === cvModalBackdrop) closeCvModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModalBackdrop.classList.contains('open')) closeCvModal();
  });

  // Expose globally so other modules (CTA button) can open it
  window.openCvModal  = openCvModal;
  window.closeCvModal = closeCvModal;
});
