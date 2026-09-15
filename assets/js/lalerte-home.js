(function(){
  'use strict';
  function esc(v){return String(v??'').replace(/[&<>\"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[c]})}
  function init(){
    if(document.querySelector('[data-lalerte-section]')) return;
    fetch('data/lalerte-180.json?v=20260915-1',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('LALERTE data');return r.json()}).then(function(d){
      if(!d||!Array.isArray(d.pages)||!d.pages.length)return;
      var section=document.createElement('section');
      section.className='lalerte-section';section.setAttribute('data-lalerte-section','');
      var cards=d.pages.slice(0,4).map(function(p){
        var title=esc(p.title||('Page '+p.page));
        var ex=esc(p.excerpt||'').slice(0,220);
        return '<a class="lalerte-card" href="lalerte.html#page-'+p.page+'"><img loading="lazy" decoding="async" src="'+esc(p.image)+'" alt="'+title+' — L’ALERTE N°180"><div class="lalerte-card-body"><span>PAGE '+esc(p.page)+'</span><h3>'+title+'</h3><p>'+ex+'</p></div></a>';
      }).join('');
      section.innerHTML='<div class="lalerte-head"><div><div class="eyebrow">PRESSE DU MALI</div><h2>L’ALERTE N°180</h2><p>Découvrez les pages et articles de la nouvelle édition directement sur Radio Ciwara.</p></div><a class="lalerte-link" href="lalerte.html">VOIR L’ÉDITION COMPLÈTE →</a></div><div class="lalerte-grid">'+cards+'</div>';
      var link=document.createElement('link');link.rel='stylesheet';link.href='assets/css/lalerte.css?v=20260915-1';document.head.appendChild(link);
      var main=document.querySelector('main')||document.querySelector('#contenu')||document.body;
      var anchor=main.querySelector('.portal-main')||main.firstElementChild;
      if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(section,anchor)}else{main.appendChild(section)}
    }).catch(function(){/* LALERTE remains optional if data is unavailable. */});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();