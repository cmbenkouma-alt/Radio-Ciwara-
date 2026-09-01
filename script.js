const playButtons=[...document.querySelectorAll('[data-play]')];
const menu=document.getElementById('mainNav');
const menuToggle=document.getElementById('menuToggle');
const ticker=document.getElementById('breakingItems');
const orbPlaySelector='.radio-widget-wrap .orbPp';
let tickerPaused=false;
let orbReady=false;
let autoplayAttempted=false;

function getOrbPlay(){return document.querySelector(orbPlaySelector)}
function getOrbAudio(){return document.querySelector('.radio-widget-wrap audio')}
function setStatus(text){const el=document.getElementById('status');if(el)el.textContent=text}
function isOrbPlaying(){const audio=getOrbAudio();return !!audio&&!audio.paused&&!audio.ended}
function syncButtons(){
  const playing=isOrbPlaying();
  playButtons.forEach(btn=>{
    btn.classList.toggle('playing',playing);
    if(btn.id==='barPlay')btn.textContent=playing?'Ⅱ':'▶';
    else if(btn.tagName==='BUTTON')btn.innerHTML=playing?'Ⅱ ARRÊTER':'▶ ÉCOUTER EN DIRECT';
  });
}

function clickOrbPlayer(){
  const play=getOrbPlay();
  if(!play){setStatus('Chargement du lecteur…');return false}
  play.click();
  setStatus('🔴 Connexion à Radio Ciwara…');
  setTimeout(syncButtons,600);
  setTimeout(syncButtons,1800);
  return true;
}

async function tryAutoplay(){
  if(autoplayAttempted||isOrbPlaying())return;
  autoplayAttempted=true;
  const audio=getOrbAudio();
  const play=getOrbPlay();
  if(!play||!audio)return;

  // OnlineRadioBox prévoit l'autostart dans son widget. On déclenche aussi
  // le bouton une fois le widget prêt. Les navigateurs peuvent refuser le
  // son automatique : dans ce cas le bouton Play reste immédiatement utilisable.
  audio.autoplay=true;
  try{await audio.play();syncButtons();setStatus('🔴 Radio Ciwara — EN DIRECT');return}catch(_e){}
  try{play.click();setTimeout(syncButtons,900);setTimeout(syncButtons,2200)}catch(_e){}
}

async function toggleRadio(){
  const audio=getOrbAudio();
  if(audio&&!audio.paused&&!audio.ended){
    audio.pause();
    syncButtons();
    setStatus('Radio en pause');
    return;
  }
  autoplayAttempted=true;
  if(!clickOrbPlayer()){
    document.querySelector('#direct')?.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(clickOrbPlayer,700);
  }
}

playButtons.forEach(btn=>btn.addEventListener('click',toggleRadio));

const orbObserver=new MutationObserver(()=>{
  const audio=getOrbAudio();
  if(audio&&!orbReady){
    orbReady=true;
    audio.addEventListener('play',()=>{setStatus('🔴 Radio Ciwara — EN DIRECT');syncButtons()});
    audio.addEventListener('pause',syncButtons);
    audio.addEventListener('playing',()=>{setStatus('🔴 Radio Ciwara — EN DIRECT');syncButtons()});
    audio.addEventListener('error',()=>setStatus('Flux direct temporairement indisponible.'));
    syncButtons();
    setTimeout(tryAutoplay,700);
  }
});
orbObserver.observe(document.body,{childList:true,subtree:true});

// Si le widget était déjà présent avant l'installation de l'observateur.
window.addEventListener('load',()=>{
  syncButtons();
  setTimeout(tryAutoplay,1400);
});

if(menuToggle)menuToggle.addEventListener('click',()=>menu.classList.toggle('open'));
if(menu)menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

const toggle=document.getElementById('tickerToggle');
if(toggle)toggle.addEventListener('click',()=>{tickerPaused=!tickerPaused;if(ticker)ticker.style.animationPlayState=tickerPaused?'paused':'running';toggle.textContent=tickerPaused?'▶':'Ⅱ'});

function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function renderNews(items){
 const grid=document.getElementById('newsGrid');if(!grid)return;
 if(!items?.length){grid.innerHTML='<div class="empty-note">Les dernières actualités seront publiées ici dès la prochaine synchronisation RSS.</div>';return}
 grid.innerHTML=items.slice(0,8).map(item=>`<article class="news-card"><div class="news-image">${escapeHtml(item.source||'ACTUALITÉ')}<span></span></div><div class="news-content"><span class="news-source">${escapeHtml(item.source||'ACTUALITÉ')}</span><h3>${escapeHtml(item.title||'Actualité')}</h3><p>${escapeHtml(item.description||'Retrouvez cette actualité sur le site de sa source.')}</p><div class="news-meta">${escapeHtml(item.date||'Aujourd’hui')} · Source : ${escapeHtml(item.source||'Média')}</div><p style="margin-top:10px"><a href="${escapeHtml(item.link||'#')}" target="_blank" rel="noopener">Lire la source →</a></p></div></article>`).join('');
}
async function loadNews(){
 try{const res=await fetch('data/news.json?ts='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error('news');const data=await res.json();renderNews(data.items||[]);if(ticker&&data.items?.length)ticker.innerHTML=data.items.slice(0,8).map(x=>`<span>${escapeHtml(x.title)} <small>— ${escapeHtml(x.source||'')}</small></span>`).join('')}catch(e){renderNews([])}
}
loadNews();
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
