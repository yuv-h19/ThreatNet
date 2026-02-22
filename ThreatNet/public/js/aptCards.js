document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('aptModal');
    const closeBtn = modal.querySelector('.close-modal');

    document.querySelectorAll('.apt-card').forEach((card) => {
      const webp = card.getAttribute('data-bg-webp');
      const jpg = card.getAttribute('data-bg-jpg');
      const def = card.getAttribute('data-bg-default');

      // Background fallback chain: prefer WebP, then JPG, then default 
      card.style.backgroundImage = `url('${webp}'), url('${jpg}'), url('${def}')`;

      // Reads dataset attributes and injects values into the modal 
      card.addEventListener('click', function () {
        const name = card.getAttribute('data-name') || '';
        const type = card.getAttribute('data-type') || '';
        const origin = card.getAttribute('data-origin') || '';
        const confidence = card.getAttribute('data-confidence') || '';
        const motivation = card.getAttribute('data-motivation') || '';
        const sectors = card.getAttribute('data-sectors') || '';

        document.getElementById('modalTitle').innerText = '> ' + name;
        document.getElementById('modalType').innerText = type;
        document.getElementById('modalOrigin').innerText = origin;
        document.getElementById('modalConfidence').innerText = confidence;
        document.getElementById('modalMotivation').innerText = motivation;
        document.getElementById('modalSectors').innerText = sectors;

        /* Shows modal and updates accessibility state */
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
      });
    });

    // Hides modal and restores accessibility state 
    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }

    closeBtn.addEventListener('click', closeModal);

    // Close when clicking outside the modal content 
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape for keyboard accessibility 
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  });