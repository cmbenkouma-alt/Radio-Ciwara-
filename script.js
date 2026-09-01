const playButtons=[...document.querySelectorAll('[data-play]')];
const menu=document.getElementById('mainNav');
const menuToggle=document.getElementById('menuToggle');
const ticker=document.getElementById('breakingItems');
const orbPlaySelector='.radio-widget-wrap .orbPp';
const DIRECT_URL='http://ciwarafm.radiostream321.com/';
let tickerPaused=false;

function getOrbPlay(){return document.querySelector(orbPlaySelector)}
function getOrbAudio(){return document.querySelector('.radio-widget-wrap audio')}
function setStatus(text){const el=document.getElementById('status');if(el)el.textContent=text}
function isOrbPlaying(){const audio=getOrbAudio();return !!audio&&!audio.paused&&!audio.ended}
function syncButtons(){
 const playing=isOrbPlaying();
 playButtons.forEach(btn=>{btn.classList.toggle('playing',playing);if(btn.id==='barPlay')btn.textContent=playing?'Ⅱ':'▶';else if(btn.tagName==='BUTTON')btn.innerHTML=playing?'Ⅱ ARRÊTER':'▶ ÉCOUTER EN DIRECT';});
}

function clickOrbPlayer(){const play=getOrbPlay();if(!play)return false;play.click();setStatus('🔴 Connexion à Radio Ciwara…');setTimeout(syncButtons,700);setTimeout(syncButtons,2000);return true}
async function toggleRadio(){
 const audio=getOrbAudio();
 if(audio&&!audio.paused&&!audio.ended){audio.pause();syncButtons();setStatus('Radio en pause');return}
 if(!clickOrbPlayer()){
  setStatus('Chargement du direct…');
  document.querySelector('#direct')?.scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(clickOrbPlayer,800);
 }
}
playButtons.forEach(btn=>btn.addEventListener('click',toggleRadio));

const observer=new MutationObserver(()=>{
 const audio=getOrbAudio();
 if(!audio||audio.dataset.ciwaraBound)return;
 audio.dataset.ciwaraBound='1';
 audio.addEventListener('play',()=>{setStatus('🔴 Radio Ciwara — EN DIRECT');syncButtons()});
 audio.addEventListener('playing',()=>{setStatus('🔴 Radio Ciwara — EN DIRECT');syncButtons()});
 audio.addEventListener('pause',syncButtons);
 audio.addEventListener('error',()=>{setStatus('Le flux direct est momentanément indisponible.');syncButtons()});
});
observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>{syncButtons();});

if(menuToggle)menuToggle.addEventListener('click',()=>menu.classList.toggle('open'));
if(menu)menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
const toggle=document.getElementById('tickerToggle');
if(toggle)toggle.addEventListener('click',()=>{tickerPaused=!tickerPaused;if(ticker)ticker.style.animationPlayState=tickerPaused?'paused':'running';toggle.textContent=tickerPaused?'▶':'Ⅱ'});

function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function safeImage(url){if(!url)return 'logo.jpg';if(url.startsWith('data/news-images/'))return url;if(/^https:\/\//i.test(url))return url;return 'logo.jpg'}
function renderNews(items){
 const grid=document.getElementById('newsGrid');if(!grid)return;
 if(!items?.length){grid.innerHTML='<div class="empty-note">Les actualités sont temporairement indisponibles. Revenez dans quelques instants.</div>';return}
 grid.innerHTML=items.slice(0,8).map(item=>`<article class="news-card"><div class="news-image"><img src="${escapeHtml(safeImage(item.image))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='logo.jpg'"><span></span></div><div class="news-content"><span class="news-source">${escapeHtml(item.source||'ACTUALITÉ')}</span><h3>${escapeHtml(item.title||'Actualité')}</h3><p>${escapeHtml(item.description||'Retrouvez cette actualité sur le site de sa source.')}</p><div class="news-meta">${escapeHtml(item.date||'Aujourd’hui')} · Source : ${escapeHtml(item.source||'Média')}</div><p style="margin-top:10px"><a href="${escapeHtml(item.link||'#')}" target="_blank" rel="noopener">Lire la source →</a></p></div></article>`).join('');
}
async function loadNews(){
 try{const res=await fetch('data/news.json?ts='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error('news');const data=await res.json();renderNews(data.items||[]);if(ticker&&data.items?.length)ticker.innerHTML=data.items.slice(0,8).map(x=>`<span>${escapeHtml(x.title)} <small>— ${escapeHtml(x.source||'')}</small></span>`).join('')}catch(e){renderNews([])}
}
loadNews();

function installAds(){
 const old=document.querySelector('.ad-strip');
 if(!old)return;
 const wrap=document.createElement('section');wrap.className='ciwara-ads';
 wrap.innerHTML=`<div class="container"><div class="ciwara-ads-title"><span>PUBLICITÉS</span><h2>Nos partenaires</h2></div><div class="ciwara-ads-grid"><a class="ciwara-ad" href="tel:+22375228622"><img src="dolo-banner.svg" alt="Karim Konaré dit Dolo Karamoko — géomancien et astrologue"></a><a class="ciwara-ad" href="tel:+22374150891"><img src="baradji-banner.jpg" alt="Alimentation Baradji et Frères — alimentation générale"></a><a class="ciwara-ad" href="#contact"><img src="transport-banner.jpg" alt="Transport et Logistique — sécurité, rapidité, fiabilité"></a></div></div>`;
 old.replaceWith(wrap);
 const style=document.createElement('style');style.textContent='.ciwara-ads{padding:34px 0;background:#f6f6f6}.ciwara-ads-title{margin-bottom:18px}.ciwara-ads-title span{font-size:12px;font-weight:900;color:#ef2b2b;letter-spacing:1.5px}.ciwara-ads-title h2{margin:4px 0 0}.ciwara-ads-grid{display:grid;gap:18px}.ciwara-ad{display:block;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 5px 22px rgba(0,0,0,.10);transition:transform .2s}.ciwara-ad:hover{transform:translateY(-2px)}.ciwara-ad img{display:block;width:100%;height:auto;max-height:360px;object-fit:cover}.news-image{overflow:hidden;position:relative;background:#eee}.news-image img{display:block;width:100%;height:190px;object-fit:cover}@media(min-width:900px){.ciwara-ads-grid{grid-template-columns:1fr}.ciwara-ad img{max-height:330px}}';document.head.appendChild(style);
}
installAds();
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));