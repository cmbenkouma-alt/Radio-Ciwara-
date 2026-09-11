(() => {
  const sidebar = document.querySelector('.portal-sidebar');
  if (!sidebar || document.getElementById('ciwaraEventsBox')) return;

  const style = document.createElement('style');
  style.textContent = `.ciwara-facebook-live-box{border:3px solid #d71920!important;border-radius:14px!important;overflow:hidden!important;background:#111214!important;color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.28);width:100%;margin:18px 0!important}.ciwara-facebook-live-box .side-title{background:linear-gradient(90deg,#d71920,#b20f16,#111214);color:#fff;border:0!important;padding:17px 15px!important;font:900 15px Montserrat!important;letter-spacing:.4px;text-align:center}.cfb-frame{padding:10px;background:#090a0c}.cfb-frame iframe{display:block;width:100%!important;height:auto!important;aspect-ratio:560/314;border:0!important;overflow:hidden;border-radius:9px}.cfb-note{padding:8px 11px 11px;color:#aaa;font:700 8px/1.4 Montserrat;text-align:center}.ciwara-events-box{border:3px solid #d71920!important;border-radius:14px!important;overflow:hidden!important;background:#111214!important;color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.28);transform:none!important;transform-origin:top center;width:100%;margin:0 0 18px}.ciwara-events-box .side-title{background:linear-gradient(90deg,#d71920,#b20f16,#111214);color:#fff;border:0!important;padding:17px 15px!important;font:900 15px Montserrat!important;letter-spacing:.4px;text-align:center}.ce-list{padding:11px}.ce-card{display:grid;grid-template-columns:82px 1fr;gap:10px;padding:10px 0;border-bottom:1px solid #333;text-decoration:none;color:#fff}.ce-card:first-child{display:block;padding:0 0 15px}.ce-card img,.ce-noimg{width:82px;height:62px;border-radius:7px;object-fit:cover;background:#292a2c}.ce-card:first-child img,.ce-card:first-child .ce-noimg{display:block;width:100%;height:auto;aspect-ratio:16/9;border-radius:10px;object-fit:contain;object-position:center;background:#090a0c;margin:0 0 12px}.ce-noimg{display:grid;place-items:center;text-align:center;font:900 8px Montserrat;color:#f7d51b}.ce-card:first-child .ce-noimg{font-size:12px}.ce-card span{display:block;color:#f7d51b;font:900 8px Montserrat;line-height:1.25}.ce-card:first-child span{font-size:10px}.ce-card b{display:block;color:#fff;font:900 11px/1.25 Montserrat;margin:4px 0}.ce-card:first-child b{font-size:17px;line-height:1.2;margin:7px 0}.ce-card small{display:block;color:#bbb;font-size:9px}.ce-card:first-child small{font-size:10px}.ce-more{display:block;text-align:center;padding:15px 5px 9px;color:#f7d51b;text-decoration:none;font:900 9px Montserrat}.ce-loading,.ce-empty{padding:22px;color:#aaa;font-size:10px;text-align:center}@media(max-width:900px){.ciwara-events-box{transform:none!important}.ce-card:first-child img,.ce-card:first-child .ce-noimg{aspect-ratio:16/9}}@media(max-width:650px){.ciwara-facebook-live-box{margin:15px 0}.ciwara-events-box{margin-bottom:15px}.ce-card:first-child img,.ce-card:first-child .ce-noimg{aspect-ratio:16/9}.ce-card:first-child b{font-size:15px}}`;
  document.head.appendChild(style);

  const box = document.createElement('section');
  box.id = 'ciwaraEventsBox';
  box.className = 'side-box ciwara-events-box';
  box.innerHTML = '<div class="side-title">ÉVÉNEMENT À VENIR</div><div class="ce-list"><div class="ce-loading">Chargement…</div></div>';
  sidebar.prepend(box);

  const liveBox = document.createElement('section');
  liveBox.id = 'ciwaraFacebookLiveBox';
  liveBox.className = 'side-box ciwara-facebook-live-box';
  liveBox.innerHTML = '<div class="side-title">🔴 LIVE FACEBOOK</div><div class="cfb-frame"><iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fradiociwarafm%2Fvideos%2F1079483461717667%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="Live Facebook Radio Ciwara"></iframe></div><div class="cfb-note">Suivez le direct Facebook de Radio Ciwara 105.5 FM</div>';

  // Place the Facebook player directly below the HERO principal (.lead-news).
  const hero = document.querySelector('.lead-news');
  if (hero) {
    hero.insertAdjacentElement('afterend', liveBox);
  } else {
    sidebar.appendChild(liveBox);
  }

  fetch('data/events.json?v=' + Date.now())
    .then(r => r.json())
    .then(events => {
      const list = events.filter(e => e.published !== false).sort((a,b) => String(a.date||'').localeCompare(String(b.date||''))).slice(0,4);
      const el = box.querySelector('.ce-list');
      if (!list.length) { el.innerHTML = '<div class="ce-empty">Aucun événement à venir.</div>'; return; }
      el.innerHTML = list.map(e => `
        <a class="ce-card" href="events.html">
          ${e.image ? `<img src="${e.image}" alt="Affiche ${e.title || 'événement'}" loading="eager">` : '<div class="ce-noimg">CIWARA<br>105.5 FM</div>'}
          <div><span>${e.dateLabel || e.date || ''} · ${e.time || ''}</span><b>${e.title || ''}</b><small>${e.show || ''}${e.host ? ' · ' + e.host : ''}</small></div>
        </a>`).join('') + '<a class="ce-more" href="events.html">VOIR TOUS LES ÉVÉNEMENTS →</a>';
    })
    .catch(() => { box.querySelector('.ce-list').innerHTML = '<div class="ce-empty">Événements momentanément indisponibles.</div>'; });
})();
