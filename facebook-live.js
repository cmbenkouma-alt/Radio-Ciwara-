(() => {
  'use strict';

  const VIDEO_URL = 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fradiociwarafm%2Fvideos%2F3154611518262011%2F&show_text=false&width=560&t=0';
  const PAGE_URL = 'https://www.facebook.com/radiociwarafm';
  const BOX_CLASS = 'ciwara-facebook-live-below-news';
  const STYLE_ID = 'ciwara-facebook-player-placement';

  const css = `
    .${BOX_CLASS}{
      width:100%!important;
      max-width:none!important;
      margin:20px 0 0!important;
      border:2px solid #1877f2!important;
      border-radius:8px!important;
      overflow:hidden;
      background:#000;
      box-shadow:0 12px 30px rgba(0,0,0,.18);
      box-sizing:border-box;
    }
    .${BOX_CLASS} .facebook-live-title{
      height:44px;
      padding:0 14px;
      background:linear-gradient(90deg,#111214,#1877f2);
      font-size:12px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      border-bottom:3px solid #f7d51b;
      color:#fff;
      box-sizing:border-box;
    }
    .${BOX_CLASS} .facebook-live-title span{color:#f7d51b;font-size:8px}
    .${BOX_CLASS} .facebook-live-frame{position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden}
    .${BOX_CLASS} .facebook-live-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
    .${BOX_CLASS} .facebook-live-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:#111214;color:#bbb;font:500 9px Roboto,Arial,sans-serif}
    .${BOX_CLASS} .facebook-live-button{display:inline-flex;align-items:center;justify-content:center;padding:8px 10px;border-radius:6px;background:#1877f2;color:#fff;text-decoration:none;font:900 8px Montserrat,Arial,sans-serif;white-space:nowrap}
    @media(max-width:650px){
      .${BOX_CLASS}{margin-top:16px!important}
      .${BOX_CLASS} .facebook-live-title{height:40px}
      .${BOX_CLASS} .facebook-live-foot{flex-direction:column;align-items:stretch}
      .${BOX_CLASS} .facebook-live-button{width:100%;box-sizing:border-box}
    }
  `;

  function addStyles() {
    document.getElementById(STYLE_ID)?.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildFacebookBox() {
    const box = document.createElement('section');
    box.className = BOX_CLASS;
    box.setAttribute('aria-label', 'Facebook Live Radio Ciwara');
    box.innerHTML = `
      <div class="facebook-live-title"><b>CIWARA LIVE</b><span>● FACEBOOK LIVE</span></div>
      <div class="facebook-live-frame">
        <iframe src="${VIDEO_URL}" title="Radio Ciwara 105.5 FM — Facebook Live" loading="lazy" scrolling="no" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="facebook-live-foot">
        <span>Suivez Radio Ciwara 105.5 FM en direct sur Facebook.</span>
        <a class="facebook-live-button" href="${PAGE_URL}" target="_blank" rel="noopener noreferrer">Voir sur Facebook</a>
      </div>
    `;
    return box;
  }

  function render() {
    addStyles();

    const newsMain = document.querySelector('.portal-main .portal-columns > div');
    const newsGrid = document.querySelector('#newsGrid');
    if (!newsMain || !newsGrid) return;

    // Ne touche ni au Hero, ni au lecteur Caster.fm, ni aux émissions.
    // On supprime uniquement les anciens doublons de CE bloc sous À LA UNE.
    newsMain.querySelectorAll(`.${BOX_CLASS}`).forEach(el => el.remove());

    const box = buildFacebookBox();
    const newsGridWrapper = newsGrid.parentElement;
    if (newsGridWrapper && newsGridWrapper.parentElement === newsMain) {
      newsMain.insertBefore(box, newsGridWrapper);
    } else {
      newsMain.appendChild(box);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }
})();
