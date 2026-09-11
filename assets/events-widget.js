(() => {
  const sidebar = document.querySelector('.portal-sidebar');
  if (!sidebar || document.getElementById('ciwaraEventsBox')) return;
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
