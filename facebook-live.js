(() => {
  'use strict';
  const cleanup = () => {
    document.querySelectorAll('.ciwara-facebook-live-below-news, .ciwara-facebook-live, iframe[src*=' + JSON.stringify('facebook.com') + ']').forEach(el => {
      if (!el.closest('.cstrEmbed')) el.remove();
    });
    document.querySelectorAll('.ciwara-hero-caption').forEach(el => el.remove());
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cleanup, { once: true });
  else cleanup();
})();
