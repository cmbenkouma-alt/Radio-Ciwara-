const playButtons=[...document.querySelectorAll('[data-play]')];
const menu=document.getElementById('mainNav');
const menuToggle=document.getElementById('menuToggle');
const ticker=document.getElementById('breakingItems');
const DIRECT_SOURCES=['https://ciwarafm.radiostream321.com/','https://ciwarafm.radiostream321.com/stream','http://ciwarafm.radiostream321.com/'];
let tickerPaused=false;
let directAudio=null;
let directIndex=0;

function getOrbPlay(){return document.querySelector('.radio-widget-wrap .orbPp')}
function getOrbAudio(){return document.querySelector('.radio-widget-wrap audio')}
function setStatus(text){const el=document.getElementById('status');if(el)el.textContent=text}
function isPlaying(){return !!directAudio&&!directAudio.paused&&!directAudio.ended || !!getOrbAudio()&&!getOrbAudio().paused&&!getOrbAudio().ended}
function syncButtons(){const playing=isPlaying();playButtons.forEach(btn=>{btn.classList.toggle('playing',playing);if(btn.id==='barPlay')btn.textContent=playing?'Ⅱ':'▶';else if(btn.tagName==='BUTTON')btn.innerHTML=playing?'Ⅱ ARRÊTER':'▶ ÉCOUTER EN DIRECT'});}

function ensureDirectAudio(){
 if(directAudio)return directAudio;
 directAudio=document.createElement('audio');
 directAudio.id='ciwaraDirectAudio';directAudio.preload='none';directAudio.controls=false;directAudio.crossOrigin='anonymous';
 directAudio.style.display='none';document.body.appendChild(directAudio);
 directAudio.addEventListener('playing',()=>{setStatus('🔴 Radio Ciwara — EN DIRECT');syncButtons()});
 directAudio.addEventListener('pause',syncButtons);
 directAudio.addEventListener('error',()=>{directIndex++;if(directIndex<DIRECT_SOURCES.length){directAudio.src=DIRECT_SOURCES[directIndex];directAudio.play().catch(()=>fallbackOrb())}else fallbackOrb()});
 return directAudio;
}
function fallbackOrb(){const p=getOrbPlay();if(p){setStatus('🔴 Connexion au lecteur radio…');p.click();setTimeout(syncButtons,1000)}else setStatus('Flux direct momentanément indisponible.');}
async function startRadio(){
 const a=ensureDirectAudio();
 if(!a.src){directIndex=0;a.src=DIRECT_SOURCES[0]}
 try{await a.play();return true}catch(e){
  // Certains navigateurs refusent HTTPS si le serveur ne sert pas le flux en HTTPS.
  directIndex=1;a.src=DIRECT_SOURCES[directIndex];
  try{await a.play();return true}catch(_){fallbackOrb();return false}
 }
}
async function toggleRadio(){
 if(directAudio&&!directAudio.paused&&!directAudio.ended){directAudio.pause();syncButtons();setStatus('Radio en pause');return}
 const orb=getOrbAudio();if(orb&&!orb.paused&&!orb.ended){orb.pause();syncButtons();setStatus('Radio en pause');return}
 setStatus('🔴 Connexion à Radio Ciwara…');await startRadio();
}
playButtons.forEach(btn=>btn.addEventListener('click',toggleRadio));

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
async function loadNews(){try{const res=await fetch('data/news.json?ts='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error('news');const data=await res.json();renderNews(data.items||[]);if(ticker&&data.items?.length)ticker.innerHTML=data.items.slice(0,8).map(x=>`<span>${escapeHtml(x.title)} <small>— ${escapeHtml(x.source||'')}</small></span>`).join('')}catch(e){renderNews([])}}
loadNews();

function installAds(){
 const old=document.querySelector('.ad-strip');if(!old||document.querySelector('.ciwara-ads'))return;
 const wrap=document.createElement('section');wrap.className='ciwara-ads';
 wrap.innerHTML=`<div class="container"><div class="ciwara-ads-title"><span>PUBLICITÉS</span><h2>Nos partenaires</h2></div><div class="ciwara-ads-grid"><a class="ciwara-ad dolo" href="tel:+22375228622"><div class="ad-art"><b>KARIM KONARÉ</b><strong>DIT DOLO KARAMOKO</strong><span>GÉOMANCIEN ET ASTROLOGUE</span><small>Géomancie • Astrologie • Conseils • Orientation • Prédictions • Protection • Réussite</small><em>DOLO ÉMISSION · Vendredi 15h–17h · Rediffusion jeudi et dimanche 22h–00h</em><label>75228622 / 76108816</label></div></a><a class="ciwara-ad baradji" href="tel:+22374150891"><div class="ad-art"><b>ALIMENTATION</b><strong>BARADJI ET FRÈRES</strong><span>ALIMENTATION GÉNÉRALE</span><small>Produits alimentaires · Boissons · Consommables · Produits d'entretien · Service de qualité</small><label>0033612537757 / +223 74150891</label></div></a><a class="ciwara-ad transport" href="#contact"><div class="ad-art"><b>TRANSPORT & LOGISTIQUE</b><strong>SÉCURITÉ · RAPIDITÉ · FIABILITÉ</strong><span>Transport routier · Fret aérien · Fret maritime · Douane & dédouanement</span><label>VOTRE MARCHANDISE, NOTRE PRIORITÉ !</label></div></a></div></div>`;
 old.replaceWith(wrap);
 const style=document.createElement('style');style.textContent='.ciwara-ads{padding:34px 0;background:#f5f5f5}.ciwara-ads-title{margin-bottom:18px}.ciwara-ads-title span{font-size:12px;font-weight:900;color:#ef2b2b;letter-spacing:1.5px}.ciwara-ads-title h2{margin:4px 0 0}.ciwara-ads-grid{display:grid;gap:18px}.ciwara-ad{display:block;text-decoration:none;border-radius:12px;overflow:hidden;box-shadow:0 7px 24px rgba(0,0,0,.12);transition:transform .2s}.ciwara-ad:hover{transform:translateY(-2px)}.ad-art{min-height:170px;padding:24px 30px;display:flex;flex-direction:column;justify-content:center;gap:5px;font-family:Montserrat,Arial,sans-serif}.ad-art b{font-size:18px}.ad-art strong{font-size:30px;font-weight:900}.ad-art span{font-size:17px;font-weight:800}.ad-art small{font-size:13px;line-height:1.45}.ad-art em{font-style:normal;font-size:13px;font-weight:800;margin-top:5px}.ad-art label{align-self:flex-start;margin-top:10px;padding:8px 14px;border-radius:20px;font-size:18px;font-weight:900}.dolo .ad-art{background:radial-gradient(circle at 15% 40%,#7b145e,#17051f 65%);color:#fff}.dolo .ad-art strong,.dolo .ad-art label{color:#ffd447}.dolo .ad-art label{background:#ffd447;color:#18051f}.baradji .ad-art{background:linear-gradient(135deg,#e9f4df,#fff);color:#173d1e;border:5px solid #1f6b2a}.baradji .ad-art strong{color:#b11f1f}.baradji .ad-art label{background:#1f6b2a;color:#fff}.transport .ad-art{background:linear-gradient(135deg,#dcecff,#fff);color:#12365e;border:5px solid #194b83}.transport .ad-art strong{color:#b31d1d}.transport .ad-art label{background:#b31d1d;color:#fff}@media(max-width:700px){.ad-art{padding:20px;min-height:160px}.ad-art strong{font-size:22px}.ad-art span{font-size:14px}.ad-art label{font-size:15px}}';document.head.appendChild(style);
}
installAds();
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));