(() => {
  'use strict';
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  const esc = (v) => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const clean = (v,m=180) => String(v ?? '').replace(/\s+/g,' ').trim().slice(0,m);

  function getHero(){
    const grid=document.querySelector('.hero-grid,.hero-layout,.hero-shell'); if(!grid) return null;
    const caster=document.getElementById('74o6tf')||grid.querySelector('.cstrEmbed');
    if(!caster) return null;
    const casterCol=caster.closest('.hero-player,.hero-news-col,.hero-video-col,.ciwara-caster-card')||caster.parentElement;
    const cols=[...grid.children].filter(x=>x.nodeType===1);
    const sliderCol=cols.find(x=>x!==casterCol&&!x.contains(caster))||null;
    return sliderCol ? {grid,sliderCol,casterCol} : null;
  }

  async function emissions(){
    const out=[];
    const add=(a)=>{const img=a.querySelector('img');const src=img?.currentSrc||img?.src;const href=a.href||a.getAttribute('href');if(!src||!href||/^javascript:/i.test(href))return;const title=clean(img?.alt||a.innerText||img?.title,90)||'Émission Radio Ciwara';const hay=(a.className+' '+href+' '+title).toLowerCase();const score=/(emission|émission|programme|animateur|podcast)/.test(hay)?5:1;out.push({src,href,title,score});};
    try{const r=await fetch('emissions.html',{cache:'no-store'});if(r.ok){const d=new DOMParser().parseFromString(await r.text(),'text/html');d.querySelectorAll('article a,.emission-card a,.emission-item a,.program-card a,.card a').forEach(add)}}catch(_){ }
    if(out.length<3) document.querySelectorAll('.emission-card a,.emission-item a,.program-card a').forEach(add);
    const seen=new Set(); return out.sort((a,b)=>b.score-a.score).filter(x=>{const k=x.href+'|'+x.src;if(seen.has(k))return false;seen.add(k);return true}).slice(0,10);
  }

  function emissionStage(items){
    const s=document.createElement('section');s.className='ciwara-future-emissions';s.setAttribute('aria-label','Émissions Radio Ciwara');
    const slides=items.length?items:[{src:'logo.jpg',href:'emissions.html',title:'Les émissions de Radio Ciwara'}];
    s.innerHTML=`<div class="future-kicker"><strong>CIWARA • ÉMISSIONS</strong><span class="future-live-dot">PROGRAMME EN CONTINU</span></div><div class="future-emission-slider">${slides.map((x,i)=>`<article class="future-emission-slide${i?'':' is-active'}"><div class="future-emission-copy"><span class="eyebrow">105.5 FM • Radio Ciwara</span><h2>${esc(x.title)}</h2><p>Vos émissions, vos animateurs et vos rendez-vous en un seul espace.</p><a class="future-emission-cta" href="${esc(x.href)}">DÉCOUVRIR L'ÉMISSION →</a></div><a class="future-emission-art" href="${esc(x.href)}" aria-label="Ouvrir ${esc(x.title)}"><img src="${esc(x.src)}" alt="${esc(x.title)}" loading="eager"></a></article>`).join('')}</div><div class="future-emission-dots">${slides.map((_,i)=>`<button type="button" data-slide="${i}" aria-label="Émission ${i+1}" class="${i?'':'is-active'}"></button>`).join('')}</div>`;
    const els=[...s.querySelectorAll('.future-emission-slide')],dots=[...s.querySelectorAll('.future-emission-dots button')];let i=0,t;
    const go=n=>{i=(n+els.length)%els.length;els.forEach((e,k)=>e.classList.toggle('is-active',k===i));dots.forEach((e,k)=>e.classList.toggle('is-active',k===i));};
    const start=()=>{clearInterval(t);if(els.length>1)t=setInterval(()=>go(i+1),5000)};
    dots.forEach((d,k)=>d.onclick=()=>{go(k);start()});s.onmouseenter=()=>clearInterval(t);s.onmouseleave=start;start();return s;
  }

  async function buildHero(){const h=getHero();if(!h)return;h.grid.classList.add('ciwara-future-hero');if(h.sliderCol===h.casterCol||h.sliderCol.contains(document.getElementById('74o6tf')))return;h.sliderCol.replaceChildren(emissionStage(await emissions()));}

  function newsItems(p){const a=Array.isArray(p)?p:(p?.news||p?.articles||p?.items||p?.data||[]);return Array.isArray(a)?a.map(n=>({title:clean(n.title||n.name||n.headline,120),description:clean(n.description||n.summary||n.excerpt,160),image:n.image||n.imageUrl||n.thumbnail||n.urlToImage||n.enclosure?.url||'',url:n.url||n.link||n.href||'ciwara-info.html',source:clean(n.source?.name||n.source||n.category||'Ciwara Infos',40)})).filter(n=>n.title):[];}

  function newsStage(items){
    if(!items.length||document.querySelector('.ciwara-news-stage'))return;
    const hero=document.querySelector('.hero-grid,.hero-layout,.hero-shell');if(!hero)return;
    const s=document.createElement('section');s.className='ciwara-news-stage';s.setAttribute('aria-label','Actualités Ciwara Infos et flux RSS');
    s.innerHTML=`<div class="ciwara-news-stage-head"><div><span class="ciwara-rss-pill">● CIWARA INFOS • FLUX RSS</span><h2>L'actualité <span>en mouvement</span></h2><p>Les dernières informations et flux éditoriaux de Ciwara Infos.</p></div><a class="future-news-more" href="ciwara-info.html">TOUTES LES ACTUALITÉS →</a></div><div class="ciwara-news-track">${items.slice(0,12).map(n=>`<article class="ciwara-news-card"><a href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${n.image?`<img src="${esc(n.image)}" alt="" loading="lazy">`:'<div class="future-news-placeholder"></div>'}<div class="ciwara-news-card-body"><small>${esc(n.source)}</small><h3>${esc(n.title)}</h3>${n.description?`<p>${esc(n.description)}</p>`:''}</div></a></article>`).join('')}</div>`;
    hero.insertAdjacentElement('afterend',s);
    const track=s.querySelector('.ciwara-news-track');
    if(!track||track.children.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let timer=null, paused=false;
    const step=()=>{if(paused)return;const card=track.querySelector('.ciwara-news-card');if(!card)return;const max=track.scrollWidth-track.clientWidth;const next=track.scrollLeft+card.getBoundingClientRect().width+18;track.scrollTo({left:next>=max-8?0:next,behavior:'smooth'});};
    const start=()=>{clearInterval(timer);timer=setInterval(step,4500)};
    track.addEventListener('mouseenter',()=>{paused=true;clearInterval(timer)});
    track.addEventListener('mouseleave',()=>{paused=false;start()});
    track.addEventListener('touchstart',()=>{paused=true;clearInterval(timer)},{passive:true});
    track.addEventListener('touchend',()=>{paused=false;start()},{passive:true});
    start();
  }

  async function buildNews(){try{const r=await fetch('data/news.json',{cache:'no-store'});if(r.ok){const x=newsItems(await r.json());if(x.length){newsStage(x);return}}}catch(_){ }const x=[...document.querySelectorAll('.news-card,.article-card,.news-grid article')].map(c=>{const a=c.querySelector('a'),im=c.querySelector('img');return a?{title:clean(c.innerText,120),image:im?.src||'',url:a.href,source:'Ciwara Infos'}:null}).filter(Boolean);newsStage(x)}
  ready(async()=>{await new Promise(r=>setTimeout(r,220));await buildHero();await buildNews();});
})();
