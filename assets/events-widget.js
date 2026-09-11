(() => {
  const sidebar = document.querySelector('.portal-sidebar');
  if (!sidebar || document.getElementById('ciwaraEventsBox')) return;
  const style = document.createElement('style');
  style.textContent = `.ciwara-events-box{border:0!important;border-radius:10px!important;overflow:hidden!important;background:#111214!important;color:#fff;box-shadow:0 10px 28px rgba(0,0,0,.14)}.ciwara-events-box .side-title{background:linear-gradient(90deg,#d71920,#111214);color:#fff;border:0!important;padding:13px 14px!important;font:900 11px Montserrat!important}.ce-list{padding:8px}.ce-card{display:grid;grid-template-columns:82px 1fr;gap:10px;padding:9px 0;border-bottom:1px solid #333;text-decoration:none;color:#fff}.ce-card img,.ce-noimg{width:82px;height:62px;border-radius:6px;object-fit:cover;background:#292a2c}.ce-noimg{display:grid;place-items:center;text-align:center;font:900 8px Montserrat;color:#f7d51b}.ce-card span{display:block;color:#f7d51b;font:900 7px Montserrat;line-height:1.2}.ce-card b{display:block;font:900 11px/1.2 Montserrat;margin:4px 0}.ce-card small{display:block;color:#bbb;font-size:9px}.ce-more{display:block;text-align:center;padding:12px 5px 7px;color:#f7d51b;text-decoration:none;font:900 8px Montserrat}.ce-loading,.ce-empty{padding:16px;color:#aaa;font-size:10px;text-align:center}`;
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
          ${e.image ? `<img src="${e.image}" alt="" loading="lazy">` : '<div class="ce-noimg">CIWARA<br>105.5 FM</div>'}
          <div><span>${e.dateLabel || e.date || ''} · ${e.time || ''}</span><b>${e.title || ''}</b><small>${e.show || ''}${e.host ? ' · ' + e.host : ''}</small></div>
        </a>`).join('') + '<a class="ce-more" href="events.html">VOIR TOUS LES ÉVÉNEMENTS →</a>';
    })
    .catch(() => { box.querySelector('.ce-list').innerHTML = '<div class="ce-empty">Événements momentanément indisponibles.</div>'; });
})();
