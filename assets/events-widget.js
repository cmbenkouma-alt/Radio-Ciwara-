(() => {
  const sidebar = document.querySelector('.portal-sidebar');
  if (!sidebar || document.getElementById('ciwaraEventsBox')) return;
  const style = document.createElement('style');
  style.textContent = `.ciwara-events-box{border:2px solid #d71920!important;border-radius:12px!important;overflow:hidden!important;background:#111214!important;color:#fff;box-shadow:0 12px 34px rgba(0,0,0,.25);transform:scale(1.02);transform-origin:top center}.ciwara-events-box .side-title{background:linear-gradient(90deg,#d71920,#b20f16,#111214);color:#fff;border:0!important;padding:16px 15px!important;font:900 14px Montserrat!important;letter-spacing:.3px;text-align:center}.ce-list{padding:10px}.ce-card{display:grid;grid-template-columns:82px 1fr;gap:10px;padding:10px 0;border-bottom:1px solid #333;text-decoration:none;color:#fff}.ce-card:first-child{display:block;padding:0 0 13px}.ce-card img,.ce-noimg{width:82px;height:62px;border-radius:7px;object-fit:cover;background:#292a2c}.ce-card:first-child img,.ce-card:first-child .ce-noimg{width:100%;height:155px;border-radius:8px;object-fit:cover;margin-bottom:10px}.ce-noimg{display:grid;place-items:center;text-align:center;font:900 8px Montserrat;color:#f7d51b}.ce-card:first-child .ce-noimg{font-size:12px}.ce-card span{display:block;color:#f7d51b;font:900 8px Montserrat;line-height:1.25}.ce-card:first-child span{font-size:9px}.ce-card b{display:block;color:#fff;font:900 11px/1.25 Montserrat;margin:4px 0}.ce-card:first-child b{font-size:16px;line-height:1.2;margin:6px 0}.ce-card small{display:block;color:#bbb;font-size:9px}.ce-card:first-child small{font-size:10px}.ce-more{display:block;text-align:center;padding:14px 5px 8px;color:#f7d51b;text-decoration:none;font:900 9px Montserrat}.ce-loading,.ce-empty{padding:20px;color:#aaa;font-size:10px;text-align:center}@media(max-width:900px){.ciwara-events-box{transform:none}.ce-card:first-child img,.ce-card:first-child .ce-noimg{height:180px}}@media(max-width:650px){.ce-card:first-child img,.ce-card:first-child .ce-noimg{height:170px}}`;
  document.head.appendChild(style);
  const box = document.createElement('section');
  box.id = 'ciwaraEventsBox';
  box.className = 'side-box ciwara-events-box';
  box.innerHTML = '<div class="side-title">ÉVÉNEMENTS RADIO CIWARA</div><div class="ce-list"><div class="ce-loading">Chargement…</div></div>';
  sidebar.prepend(box);
  fetch('data/events.json?v=' + Date.now())
    .then(r => r.json())
    .then(events => {
      const list = events.filter(e => e.published !== false).sort((a,b) => String(a.date||'').localeCompare(String(b.date||''))).slice(0,4);
      const el = box.querySelector('.ce-list');
      if (!list.length) { el.innerHTML = '<div class="ce-empty">Aucun événement à venir.</div>'; return; }
      el.innerHTML = list.map(e => `
        <a class="ce-card" href="events.html">
          ${e.image ? `<img src="${e.image}" alt="Affiche ${e.title || 'événement'}" loading="lazy">` : '<div class="ce-noimg">CIWARA<br>105.5 FM</div>'}
          <div><span>${e.dateLabel || e.date || ''} · ${e.time || ''}</span><b>${e.title || ''}</b><small>${e.show || ''}${e.host ? ' · ' + e.host : ''}</small></div>
        </a>`).join('') + '<a class="ce-more" href="events.html">VOIR TOUS LES ÉVÉNEMENTS →</a>';
    })
    .catch(() => { box.querySelector('.ce-list').innerHTML = '<div class="ce-empty">Événements momentanément indisponibles.</div>'; });
})();
