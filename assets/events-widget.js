(()=>{
  const sidebar = document.querySelector('.portal-sidebar');
  if (!sidebar || document.getElementById('ciwaraEventsBox')) return;

  const style = document.createElement('style');
  style.textContent = `.ciwara-facebook-live-box{border:3px solid #d71920!important;border-radius:14px!important;overflow:hidden!important;background:#111214!important;color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.28);width:100%;margin:18px 0!important;box-sizing:border-box}.ciwara-facebook-live-box .side-title{background:linear-gradient(90deg,#d71920,#b20f16,#111214);color:#fff;border:0!important;padding:17px 15px!important;font:900 15px Montserrat!important;letter-spacing:.4px;text-align:center}.cfb-frame{padding:0!important;background:#090a0c;line-height:0;width:100%;overflow:hidden;position:relative;aspect-ratio:560/314}.cfb-frame iframe{position:absolute;inset:0;display:block;width:100%!important;height:100%!important;border:0!important;overflow:hidden;border-radius:0!important;margin:0!important;max-width:100%!important;box-sizing:border-box}.cfb-note{padding:8px 11px 11px;color:#aaa;font:700 8px/1.4 Montserrat;text-align:center}.ciwara-events-box{border:3px solid #d71920!important;border-radius:14px!important;overflow:hidden!important;background:#111214!important;color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.28);transform:none!important;transform-origin:top center;width:100%;margin:0 0 18px}.ciwara-events-box .side-title{background:linear-gradient(90deg,#d71920,#b20f16,#111214);color:#fff;border:0!important;padding:17px 15px!important;font:900 15px Montserrat!important;letter-spacing:.4px;text-align:center}.ce-list{padding:11px}.ce-card{display:grid;grid-template-columns:82px 1fr;gap:10px;padding:10px 0;border-bottom:1px solid #333;text-decoration:none;color:#fff}.ce-card:first-child{display:block;padding:0 0 15px}.ce-card img,.ce-noimg{width:82px;height:62px;border-radius:7px;object-fit:cover;background:#292a2c}.ce-card:first-child img,.ce-card:first-child .ce-noimg{display:block;width:100%;height:auto;aspect-ratio:16/9;border-radius:10px;object-fit:contain;object-position:center;background:#090a0c;margin:0 0 12px}.ce-noimg{display:grid;place-items:center;text-align:center;font:900 8px Montserrat;color:#f7d51b}.ce-card:first-child .ce-noimg{font-size:12px}.ce-card span{display:block;color:#f7d51b;font:900 8px Montserrat;line-height:1.25}.ce-card:first-child span{font-size:10px}.ce-card b{display:block;color:#fff;font:900 11px/1.25 Montserrat;margin:4px 0}.ce-card:first-child b{font-size:17px;line-height:1.2;margin:7px 0}.ce-card small{display:block;color:#bbb;font-size:9px}.ce-card:first-child small{font-size:10px}.ce-more{display:block;text-align:center;padding:15px 5px 9px;color:#f7d51b;text-decoration:none;font:900 9px Montserrat}.ce-loading,.ce-empty{padding:22px;color:#aaa;font-size:10px;text-align:center}.ciwara-videos-box{border:3px solid #f7d51b!important;border-radius:14px!important;overflow:hidden!important;background:#111214!important;color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.28);width:100%;margin:0!important;box-sizing:border-box;align-self:center!important;order:999!important}.ciwara-videos-box .side-title{background:linear-gradient(90deg,#111214,#087f3f,#d71920);color:#fff;border:0!important;padding:17px 15px!important;font:900 15px Montserrat!important;letter-spacing:.4px;text-align:center}.cv-list{padding:10px}.cv-card{display:block;color:#fff;text-decoration:none;border-bottom:1px solid #333;padding:0 0 12px;margin-bottom:12px}.cv-thumb{position:relative;width:100%;aspect-ratio:16/9;background:#24262a;border-radius:9px;overflow:hidden;margin-bottom:8px}.cv-thumb img{display:block;width:100%;height:100%;object-fit:cover}.cv-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:#d71920;color:#fff;display:grid;place-items:center;font:900 18px Arial;box-shadow:0 4px 16px rgba(0,0,0,.45)}.cv-card b{display:block;font:900 11px/1.3 Montserrat}.cv-card small{display:block;color:#aaa;font:500 9px/1.35 Roboto;margin-top:4px}.cv-more{display:block;text-align:center;padding:4px 5px 7px;color:#f7d51b;text-decoration:none;font:900 9px Montserrat}.cv-empty{padding:15px 8px;color:#bbb;font:500 10px/1.5 Roboto;text-align:center}.cv-empty a{display:inline-block;margin-top:9px;color:#f7d51b;text-decoration:none;font:900 9px Montserrat}@media(max-width:650px){.ciwara-videos-box{margin-top:0}.cv-card b{font-size:10px}}`;
  document.head.appendChild(style);

  const box = document.createElement('section');
  box.id = 'ciwaraEventsBox';
  box.className = 'side-box ciwara-events-box';
  box.innerHTML = '<div class="side-title">ÉVÉNEMENT À VENIR</div><div class="ce-list"><div class="ce-loading">Chargement…</div></div>';
  sidebar.prepend(box);

  const liveBox = document.createElement('section');
  liveBox.id = 'ciwaraFacebookLiveBox';
  liveBox.className = 'side-box ciwara-facebook-live-box';
  liveBox.innerHTML = '<div class="side-title">🔴 LIVE FACEBOOK</div><div class="cfb-frame"><iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fradiociwarafm%2Fvideos%2F2030453480969779%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true" title="Live Facebook Radio Ciwara"></iframe></div><div class="cfb-note">Suivez le direct Facebook de Radio Ciwara 105.5 FM</div>';
  const hero = document.querySelector('.lead-news');
  if (hero) hero.insertAdjacentElement('afterend', liveBox);
  else sidebar.appendChild(liveBox);

  fetch('data/events.json?v=' + Date.now()).then(r=>r.json()).then(events=>{
    const list = events.filter(e=>e.published!==false).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))).slice(0,4);
    const el = box.querySelector('.ce-list');
    if (!list.length) { el.innerHTML='<div class="ce-empty">Aucun événement à venir.</div>'; return; }
    el.innerHTML=list.map(e=>`<a class="ce-card" href="events.html">${e.image?`<img src="${e.image}" alt="Affiche ${e.title||'événement'}" loading="eager">`:'<div class="ce-noimg">CIWARA<br>105.5 FM</div>'}<div><span>${e.dateLabel||e.date||''} · ${e.time||''}</span><b>${e.title||''}</b><small>${e.show||''}${e.host?' · '+e.host:''}</small></div></a>`).join('')+'<a class="ce-more" href="events.html">VOIR TOUS LES ÉVÉNEMENTS →</a>';
  }).catch(()=>{box.querySelector('.ce-list').innerHTML='<div class="ce-empty">Événements momentanément indisponibles.</div>';});

  const videos=document.createElement('section');
  videos.id='ciwaraVideosBox';
  videos.className='side-box ciwara-videos-box';
  videos.innerHTML='<div class="side-title">▶ ÉMISSIONS VIDÉO CIWARA</div><div class="cv-list"><div class="cv-empty">Chargement des émissions vidéo…</div></div>';

  const placeVideos=()=>{
    document.getElementById('ciwara-upcoming-programs')?.remove();
    const articles=sidebar.querySelector('.cms-side-managed');
    if(articles&&articles.parentNode){
      if(articles.nextElementSibling!==videos) articles.insertAdjacentElement('afterend',videos);
    }else if(!videos.isConnected){
      sidebar.appendChild(videos);
    }
    return !!articles;
  };
  placeVideos();
  const observer=new MutationObserver(()=>placeVideos());
  observer.observe(sidebar,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),30000);

  fetch('data/videos.json?v='+Date.now()).then(r=>r.json()).then(data=>{
    const list=(data.items||[]).filter(v=>v.active!==false).slice(0,4);
    const el=videos.querySelector('.cv-list');
    if(!list.length){el.innerHTML='<div class="cv-empty">Les émissions vidéo de Radio Ciwara apparaîtront ici.<br><a href="ciwara-tv.html">OUVRIR CIWARA TV →</a></div>';return;}
    el.innerHTML=list.map(v=>`<a class="cv-card" href="${v.link||'ciwara-tv.html'}" target="${v.external?'_blank':'_self'}" rel="${v.external?'noopener':''}"><div class="cv-thumb">${v.image?`<img src="${v.image}" alt="${v.title||'Émission vidéo Ciwara'}" loading="lazy">`:'<span></span>'}<i class="cv-play">▶</i></div><b>${v.title||'Émission Ciwara'}</b>${v.description?`<small>${v.description}</small>`:''}</a>`).join('')+'<a class="cv-more" href="ciwara-tv.html">VOIR TOUTES LES VIDÉOS →</a>';
  }).catch(()=>{videos.querySelector('.cv-list').innerHTML='<div class="cv-empty">Les vidéos sont momentanément indisponibles.<br><a href="ciwara-tv.html">OUVRIR CIWARA TV →</a></div>';});
})();
