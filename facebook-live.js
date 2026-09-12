(() => {
  'use strict';

  const VIDEO_URL = 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fradiociwarafm%2Fvideos%2F3154611518262011%2F&show_text=false&width=560&t=0';
  const PAGE_URL = 'https://www.facebook.com/radiociwarafm';

  const css = `
    .ciwara-facebook-live-in-player{
      width:100%!important;
      max-width:500px!important;
      margin:0!important;
      justify-self:end;
      border:2px solid #1877f2!important;
      border-radius:8px!important;
      overflow:hidden;
      background:#000;
      box-shadow:0 12px 30px rgba(0,0,0,.5);
      box-sizing:border-box;
    }
    .ciwara-facebook-live-in-player .facebook-live-title{
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
    .ciwara-facebook-live-in-player .facebook-live-title span{color:#f7d51b;font-size:8px}
    .ciwara-facebook-live-in-player .facebook-live-frame{position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden}
    .ciwara-facebook-live-in-player .facebook-live-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
    .ciwara-facebook-live-in-player .facebook-live-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:#111214;color:#bbb;font:500 9px Roboto,Arial,sans-serif}
    .ciwara-facebook-live-in-player .facebook-live-button{display:inline-flex;align-items:center;justify-content:center;padding:8px 10px;border-radius:6px;background:#1877f2;color:#fff;text-decoration:none;font:900 8px Montserrat,Arial,sans-serif;white-space:nowrap}
    @media(max-width:900px){.ciwara-facebook-live-in-player{max-width:620px!important;justify-self:center;margin:0 auto!important}}
    @media(max-width:650px){.ciwara-facebook-live-in-player .facebook-live-title{height:40px}.ciwara-facebook-live-in-player .facebook-live-foot{flex-direction:column;align-items:stretch}.ciwara-facebook-live-in-player .facebook-live-button{width:100%;box-sizing:border-box}}
  `;
  const style = document.createElement('style');
  style.id = 'ciwara-facebook-player-placement';
  style.textContent = css;
  document.head.appendChild(style);

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

  function render() {
    const hero = document.querySelector('.ciwara-hero');
    const left = document.querySelector('.ciwara-hero-video-col');
    const caster = document.querySelector('.ciwara-caster-card');
    const facebook = document.querySelector('.ciwara-facebook-live');

    if (!hero || !left || !caster || !facebook) return;

    // 1. Remettre les émissions à gauche : Facebook ne doit plus occuper cet emplacement.
    const caption = left.querySelector('.ciwara-hero-caption');
    const slider = makeShowsSlider();
    const oldFacebook = facebook;
    oldFacebook.replaceWith(slider);
    if (caption) caption.textContent = 'Programmes et émissions de Radio Ciwara 105.5 FM';
    initSlider(slider);

    // 2. Déplacer exactement le même lecteur Facebook à la place du lecteur Caster.fm.
    oldFacebook.classList.add('ciwara-facebook-live-in-player');
    oldFacebook.setAttribute('aria-label', 'Facebook Live Radio Ciwara');
    oldFacebook.innerHTML = `
      <div class="facebook-live-title"><b>LIVE FACEBOOK</b><span>● FACEBOOK LIVE</span></div>
      <div class="facebook-live-frame">
        <iframe src="${VIDEO_URL}" title="Radio Ciwara 105.5 FM — Facebook Live" scrolling="no" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="facebook-live-foot">
        <span>Suivez Radio Ciwara 105.5 FM en direct sur Facebook.</span>
        <a class="facebook-live-button" href="${PAGE_URL}" target="_blank" rel="noopener noreferrer">Voir sur Facebook</a>
      </div>
    `;
    caster.replaceWith(oldFacebook);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, {once:true});
  } else {
    render();
  }
})();
