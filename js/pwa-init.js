/* ============================================================
   Europa Hub — PWA init
   Genera icones PNG via canvas i registra el service worker
   ============================================================ */

(function () {

  /* ── Genera icones PNG a partir del SVG i els guarda al cache ── */
  function generateIcons () {
    const sizes = [192, 512];
    const svgUrl = '/assets/escut.svg';

    sizes.forEach(size => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Fons blau fosc (requerit per iOS maskable icons)
        ctx.fillStyle = '#060d1c';
        ctx.fillRect(0, 0, size, size);

        // Logo centrat amb padding
        const pad = size * 0.15;
        ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);

        canvas.toBlob(blob => {
          if (!blob) return;
          // Posa al cache perquè el SW el pugui servir
          if ('caches' in window) {
            caches.open('europa-hub-v1').then(cache => {
              cache.put(`/assets/icon-${size}.png`, new Response(blob, {
                headers: { 'Content-Type': 'image/png' }
              }));
            });
          }

          // Afegeix apple-touch-icon dinàmicament per a 192px
          if (size === 192) {
            const blobUrl = URL.createObjectURL(blob);
            let link = document.querySelector('link[rel="apple-touch-icon"]');
            if (!link) {
              link = document.createElement('link');
              link.rel = 'apple-touch-icon';
              document.head.appendChild(link);
            }
            link.href = blobUrl;
          }
        }, 'image/png');
      };
      img.src = svgUrl;
    });
  }

  /* ── Registra el Service Worker ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(reg => {
          console.log('[PWA] Service Worker registrat:', reg.scope);
          generateIcons();
        })
        .catch(err => console.warn('[PWA] Error registrant SW:', err));
    });
  }

  /* ── Prompt d'instal·lació personalitzat ── */
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;

    // Mostra el botó d'instal·lació si existeix
    const btn = document.getElementById('pwa-install-btn');
    if (btn) {
      btn.style.display = 'flex';
      btn.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
          btn.style.display = 'none';
        });
      });
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App instal·lada correctament');
    deferredPrompt = null;
  });

  /* ── Detecta si s'executa com a app standalone ── */
  window.isPWA = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

})();
