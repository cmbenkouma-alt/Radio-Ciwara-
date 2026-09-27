(()=>{'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=v=>v||'logo.jpg';
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
const key=x=>clean(x.link||'').toLowerCase()||clean(x.title||'').toLowerCase().replace(/[^a-z0-9à-ÿ]+/gi,' ');
const unique=items=>{const seen=new Set();return (items||[]).filter(x=>{const k=key(x);if(!k||seen.has(k))return false;seen.add(k);return true})};
async function json(path){const r=await fetch(path+'?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error(path);return r.json()}
function itemDate(x){return clean(x.date||x.publishedAt||'')}
function card(x,small=false){
 const href=esc(x.link||'ciwara-info.html'), title=esc(x.title||'Actualité'), im=esc(image(x.image));
 const source=esc(x.source||x.category||'CIWARA INFOS'), date=esc(itemDate(x));
 if(small)return '<a class="rc-thumb" href="'+href+'"><img src="'+im+'" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'logo.jpg\'"><div class="rc-thumb-copy"><span class="rc-tag">'+source+'</span><h4>'+title+'</h4><small>'+date+'</small></div></a>';
 return '<a class="rc-feature" href="'+href+'"><img src="'+im+'" alt="'+title+'" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'logo.jpg\'"><div class="rc-feature-copy"><span class="rc-tag">'+source+'</span><h3>'+title+'</h3><p>'+esc(x.description||x.excerpt||'')+'</p><div class="rc-feature-meta">'+date+(x.author?' · '+esc(x.author):'')+'</div></div></a>';
}
function makeSlider(kind,title,subtitle,items){
 const section=document.createElement('section');section.className='rc-editorial-section '+kind;
 section.innerHTML='<div class="rc-editorial-head"><div><span class="rc-editorial-kicker">'+esc(kind==='ciwara'?'CIWARA INFOS':'ACTUALITÉS · RSS')+'</span><h2>'+esc(title)+'</h2><p>'+esc(subtitle)+'</p></div><div class="rc-editorial-nav"><button type="button" class="rc-prev" aria-label="Article précédent">‹</button><button type="button" class="rc-next" aria-label="Article suivant">›</button></div></div><div class="rc-editorial-track"></div>';
 const track=section.querySelector('.rc-editorial-track');
 let index=0;
 const render=()=>{if(!items.length){track.innerHTML='<div class="rc-slider-empty">Aucune actualité disponible pour le moment.</div>';return}const current=items[index%items.length], thumbs=[1,2,3].map(n=>items[(index+n)%items.length]).filter(Boolean);track.innerHTML=card(current)+ '<div class="rc-thumbs">'+thumbs.map(x=>card(x,true)).join('')+'</div>'};
 const next=()=>{if(items.length){index=(index+1)%items.length;render()}};
 const prev=()=>{if(items.length){index=(index-1+items.length)%items.length;render()}};
 section.querySelector('.rc-next').addEventListener('click',next);section.querySelector('.rc-prev').addEventListener('click',prev);
 let timer=setInterval(next,7000);section.addEventListener('mouseenter',()=>clearInterval(timer));section.addEventListener('mouseleave',()=>timer=setInterval(next,7000));
 render();return section;
}
async function buildEditorial(){
 const host=document.querySelector('#actualites>.container>div');
 if(!host)return;
 const oldLead=host.querySelector('.lead-news');if(oldLead)oldLead.hidden=true;
 const oldGrid=host.querySelector('#newsGrid');if(oldGrid)oldGrid.hidden=true;
 let stack=host.querySelector('.rc-editorial-stack');if(!stack){stack=document.createElement('div');stack.className='rc-editorial-stack';host.appendChild(stack)}
 let info={items:[]},rss={items:[]};
 try{info=await json('data/ciwara-info.json')}catch(e){}
 try{rss=await json('data/news.json')}catch(e){try{rss=await json('data/actualites-slider.json')}catch(_){}}
 const infoItems=unique(info.items||[]).filter(x=>x.published!==false);
 const infoKeys=new Set(infoItems.map(key));
 const rssItems=unique(rss.items||[]).filter(x=>x.published!==false&&!infoKeys.has(key(x)));
 stack.innerHTML='';
 stack.appendChild(makeSlider('ciwara','Les informations de Ciwara','Reportages, analyses et contenus publiés par Ciwara Infos.',infoItems));
 stack.appendChild(makeSlider('rss','Actualités en continu','Les dernières informations issues des flux RSS partenaires, séparées de Ciwara Infos.',rssItems));
}
function improveProgramAndPodcast(){
 const schedule=document.querySelector('#programmes .schedule');
 if(schedule) schedule.setAttribute('aria-label','Programmes Radio Ciwara');
 const podcast=document.querySelector('#podcasts .podcast-list');
 if(podcast) podcast.querySelectorAll('article').forEach(a=>{if(/Les voix de la communauté|À la découverte du Mali profond|Les rendez-vous de Ciwara/i.test(a.textContent||''))a.classList.add('rc-placeholder-check')});
}
function protectCaster(){
 const caster=document.querySelector('.ciwara-caster-card .cstrEmbed');
 if(!caster)return;
 caster.dataset.refonteProtected='true';
}
function init(){buildEditorial();improveProgramAndPodcast();protectCaster()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();