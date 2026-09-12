(() => {
  'use strict';

  const VIDEO_URL = 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fradiociwarafm%2Fvideos%2F3154611518262011%2F&show_text=false&width=560&t=0';
  const PAGE_URL = 'https://www.facebook.com/radiociwarafm';

  const css = `
    .ciwara-facebook-live-below-news{
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
    .ciwara-facebook-live-below-news .facebook-live-title{
      height:44px;
      padding:0 14px;
      background:linear-gradient(90deg,#111214,#1877f2);
      font-size:12px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      border-bottom:3px solid #f7d51b;
      color:#fff;
    }
    .ciwara-facebook-live-below-news .facebook-live-title span{color:#f7d51b;font-size:8px}
    .ciwara-facebook-live-below-news .facebook-live-frame{position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden}
    .ciwara-facebook-live-below-news .facebook-live-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
    .ciwara-facebook-live-below-news .facebook-live-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:#111214;color:#bbb;font:500 9px Roboto,Arial,sans-serif}
    .ciwara-facebook-live-below-news .facebook-live-button{display:inline-flex;align-items:center;justify-content:center;padding:8px 10px;border-radius:6px;background:#1877f2;color:#fff;text-decoration:none;font:900 8px Montserrat,Arial,sans-serif;white-space:nowrap}
    @media(max-width:650px){
      .ciwara-facebook-live-below-news{margin-top:16px!important}
      .ciwara-facebook-live-below-news .facebook-live-title{height:40px}
      .ciwara-facebook-live-below-news .facebook-live-foot{flex-direction:column;align-items:stretch}
      .ciwara-facebook-live-below-news .facebook-live-button{width:100%;box-sizing:border-box}
    }
  `;
  const style = document.createElement('style');
  style.id = 'ciwara-facebook-player-placement';
  document.head.appendChild(style);
  style.textContent = css;

  const shows = [
    ['LUNDI · 07:00 — 08:00','TOUR D’HORIZON','Actualités et informations'],
    ['LUNDI · 08:00 — 09:00','CIWARA MATIN','Infos · société · musique'],
    ['LUNDI · 10:00 — 11:30','REVUE DE LA PRESSE','Gaffé · commentaire des articles'],
    ['LUNDI · 11:30 — 13:00','BARONI SENSIBILISATION','Émission de sensibilisation'],
    ['LUNDI · 14:05 — 15:00','MOUNA POURQUOI','Magazine Ciwara'],
    ['LUNDI · 15:00 — 16:00','CIWARA SPORTS','Sport et actualités'],
    ['LUNDI · 16:00 — 17:00','SOUMOU','Émission musicale'],
    ['LUNDI · 17:00 — 18:00','CIWARA LOVE','Musique et interactivité'],
    ['LUNDI · 18:00 — 18:15','GRAND JOURNAL','Radio Ciwara FM 105.5'],
    ['MARDI · 14:05 — 15:00','FEMMES ET SOCIÉTÉ','Société · débats'],
    ['MERCREDI · 15:00 — 16:00','J’AIME MA COMMUNE','Vie locale et proximité'],
    ['SAMEDI · 15:00 — 16:00','HIT DE LA GUINÉE','Musique'],
    ['DIMANCHE · 17:00 — 18:00','CIWARA CONTES, HUMOUR ET RIRE','Divertissement']
  ];

  function makeShowsSlider() {
    const section = document.createElement('div');
    section.className = 'ciwara-emissions-slider';
    section.setAttribute('aria-label', 'Les émissions de Radio Ciwara 105.5 FM');
    section.innerHTML = `
      <div class="ces-head"><div><span>PROGRAMMES RADIO CIWARA</span><b>LES ÉMISSIONS</b></div><strong>105.5 FM</strong></div>
      <div class="ces-track-wrap"><div class="ces-track">${shows.map(s => `<article class="ces-slide"><span>${s[0]}</span><b>${s[1]}</b><small>${s[2]}</small></article>`).join('')}</div></div>
      <div class="ces-foot"><button type="button" class="ces-prev" aria-label="Emission précédente">‹</button><small>Défilement automatique</small><button type="button" class="ces-next" aria-label="Emission suivante">›</button></div>
    `;
    return section;
  }

  function initSlider(slider) {
    if (!slider) return;
    const track = slider.querySelector('.ces-track');
    if (!track || track.dataset.ready === '1') return;
    track.dataset.ready = '1';
    const cards = [...track.children];
    track.innerHTML = cards.map(c => c.outerHTML).join('') + cards.map(c => c.outerHTML).join('');
    const reset = () => {
      track.style.animation = 'none';
      void track.offsetHeight;
      track.style.animation = 'ciwaraEmissionSlide 42s linear infinite';
    };
    slider.querySelector('.ces-prev')?.addEventListener('click', () => {
      slider.querySelector('.ces-track-wrap')?.scrollBy({left:-300, behavior:'smooth'});
      reset();
    });
    slider.querySelector('.ces-next')?.addEventListener('click', () => {
      slider.querySelector('.ces-track-wrap')?.scrollBy({left:300, behavior:'smooth'});
      reset();
    });
  }

  function removeOldPlayerBox() {
    // Supprimer uniquement les anciens lecteurs/cadres autonomes.
    // NE PAS toucher au lecteur Caster.fm (.ciwara-caster-card / .cstrEmbed).
    document.querySelectorAll('iframe[src*="lecteur-ciwara.html"], .ciwara-direct-widget, .ciwara-facebook-live-in-player').forEach((element) => {
      const box = element.matches('.ciwara-direct-widget, .ciwara-facebook-live-in-player')
        ? element
        : (element.closest('.ciwara-direct-widget, .ciwara-facebook-live-in-player') || element);
      box.remove();
    });
  }

  function removeDuplicateFacebookBoxes(keep) {
    document.querySelectorAll('.ciwara-facebook-live').forEach((box) => {
      if (box !== keep && !box.classList.contains('ciwara-facebook-live-below-news')) box.remove();
    });
  }

  function render() {
    const hero = document.querySelector('.ciwara-hero');
    const left = document.querySelector('.ciwara-hero-video-col');
    const facebook = document.querySelector('.ciwara-facebook-live');
    const newsMain = document.querySelector('.portal-main .portal-columns > div');
    const newsGrid = document.querySelector('#newsGrid');

    if (!hero || !left || !facebook || !newsMain || !newsGrid) return;

    removeOldPlayerBox();

    // Le Hero ne contient plus le Facebook Live : on y conserve les émissions.
    if (!left.querySelector('.ciwara-emissions-slider')) {
      const caption = left.querySelector('.ciwara-hero-caption');
      const slider = makeShowsSlider();
      facebook.replaceWith(slider);
      if (caption) caption.textContent = 'Programmes et émissions de Radio Ciwara 105.5 FM';
      initSlider(slider);
    }

    // Le Caster.fm reste totalement intact dans le Hero.
    // Le Facebook Live reste uniquement sous le bloc À LA UNE.
    const existingBelow = newsMain.querySelector('.ciwara-facebook-live-below-news');
    if (existingBelow) {
      removeDuplicateFacebookBoxes(existingBelow);
      return;
    }

    facebook.classList.add('ciwara-facebook-live-below-news');
    facebook.setAttribute('aria-label', 'Facebook Live Radio Ciwara');
    facebook.innerHTML = `
      <div class="facebook-live-title"><b>CIWARA LIVE</b><span>● FACEBOOK LIVE</span></div>
      <div class="facebook-live-frame">
        <iframe src="${VIDEO_URL}" title="Radio Ciwara 105.5 FM — Facebook Live" scrolling="no" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="facebook-live-foot">
        <span>Suivez Radio Ciwara 105.5 FM en direct sur Facebook.</span>
        <a class="facebook-live-button" href="${PAGE_URL}" target="_blank" rel="noopener noreferrer">Voir sur Facebook</a>
      </div>
    `;
    newsMain.insertBefore(facebook, newsGrid.parentElement || newsGrid);
    removeDuplicateFacebookBoxes(facebook);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, {once:true});
  } else {
    render();
  }
})();
