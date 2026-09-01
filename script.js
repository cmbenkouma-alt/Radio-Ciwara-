const buttons=[...document.querySelectorAll('[data-play]')];
const audio=document.getElementById('radioPlayer');
const statusEls=[document.getElementById('status'),document.getElementById('playerStatus')].filter(Boolean);
const sources=['https://ciwarafm.radiostream321.com/stream','https://ciwarafm.radiostream321.com/','http://ciwarafm.radiostream321.com/'];
let sourceIndex=0;
function status(t){statusEls.forEach(e=>e.textContent=t)}
function sync(){const p=!audio.paused&&!audio.ended;buttons.forEach(b=>{b.classList.toggle('playing',p);if(b.id==='barPlay')b.textContent=p?'Ⅱ':'▶';else b.textContent=p?'Ⅱ ARRÊTER':'▶ ÉCOUTER EN DIRECT'});document.querySelectorAll('.big-play').forEach(b=>b.textContent=p?'Ⅱ':'▶')}
function setSource(){audio.src=sources[sourceIndex];audio.load()}
async function playRadio(){status('🔴 Connexion à Radio Ciwara…');if(!audio.src)setSource();try{await audio.play();status('🔴 Radio Ciwara — EN DIRECT')}catch(e){if(sourceIndex<sources.length-1){sourceIndex++;setSource();try{await audio.play();status('🔴 Radio Ciwara — EN DIRECT')}catch(_){status('Le flux direct est indisponible pour le moment.')}}else status('Le flux direct est indisponible pour le moment.')}sync()}
function toggle(){if(!audio.paused&&!audio.ended){audio.pause();status('Radio en pause');sync()}else playRadio()}
buttons.forEach(b=>b.addEventListener('click',toggle));
audio.addEventListener('playing',()=>{status('🔴 Radio Ciwara — EN DIRECT');sync()});audio.addEventListener('pause',sync);audio.addEventListener('error',()=>{if(sourceIndex<sources.length-1){sourceIndex++;setSource();audio.play().catch(()=>status('Le flux direct est indisponible pour le moment.'))}else status('Le flux direct est indisponible pour le moment.');sync()});

/* LECTEUR PRINCIPAL : lecteur Caster.fm officiel fourni par Radio Ciwara. */
const mainBox=document.querySelector('.hero-player .direct-player');
if(mainBox){mainBox.innerHTML='<iframe src="https://cloud.caster.fm/player/a27e1e52-bcc3-4ee8-9b8d-8bce0f345b47" title="Lecteur principal Radio Ciwara FM 105.5 MHz" style="display:block;width:100%;height:180px;border:0;overflow:hidden" scrolling="no" allow="autoplay; encrypted-media"></iframe>';mainBox.style.padding='0';mainBox.style.overflow='hidden';mainBox.style.background='transparent'}

const menu=document.getElementById('mainNav'),toggleMenu=document.getElementById('menuToggle');if(toggleMenu)toggleMenu.addEventListener('click',()=>menu.classList.toggle('open'));if(menu)menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
const ticker=document.getElementById('breakingItems'),tickerBtn=document.getElementById('tickerToggle');let paused=false;if(tickerBtn)tickerBtn.addEventListener('click',()=>{paused=!paused;ticker.style.animationPlayState=paused?'paused':'running';tickerBtn.textContent=paused?'▶':'Ⅱ'});
function esc(v=''){return String(v).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function imageSrc(url){if(!url)return 'logo.jpg';if(/^https:\/\//i.test(url))return url;if(/^http:\/\//i.test(url))return 'https://images.weserv.nl/?url='+encodeURIComponent(url);if(url.startsWith('data/'))return url;return 'logo.jpg'}
function renderNews(items){const grid=document.getElementById('newsGrid');if(!grid)return;if(!items.length){grid.innerHTML='<div class="empty-note">Les actualités sont temporairement indisponibles.</div>';return}grid.innerHTML=items.slice(0,8).map(x=>`<article class="news-card"><div class="news-image"><img src="${esc(imageSrc(x.image))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='logo.jpg'"></div><div class="news-content"><span class="news-source">${esc(x.source||'ACTUALITÉ')}</span><h3>${esc(x.title||'Actualité')}</h3><p>${esc(x.description||'Retrouvez cette actualité sur Radio Ciwara.')}</p><div class="news-meta">${esc(x.date||'Aujourd’hui')} · ${esc(x.source||'Média')}</div><p style="margin-top:10px"><a href="${esc(x.link||'#')}" target="_blank" rel="noopener">Lire la source →</a></p></div></article>`).join('')}
async function loadNews(){try{const r=await fetch('data/news.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error();const d=await r.json();renderNews(d.items||[]);if(ticker&&d.items?.length)ticker.innerHTML=d.items.slice(0,8).map(x=>`<span>${esc(x.title)} <small>— ${esc(x.source||'')}</small></span>`).join('')}catch(e){renderNews([])}}
loadNews();const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();setSource();