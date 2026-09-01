const audio=document.getElementById('radioPlayer');
const statusEl=document.getElementById('status');
const playButtons=[...document.querySelectorAll('[data-play]')];
const menu=document.getElementById('mainNav');
const menuToggle=document.getElementById('menuToggle');
const ticker=document.getElementById('breakingItems');
let tickerPaused=false;

function setStatus(text){if(statusEl)statusEl.textContent=text;}
function syncButtons(){
  const playing=!audio.paused&&!audio.ended;
  playButtons.forEach(btn=>{btn.classList.toggle('playing',playing);if(btn.id==='barPlay')btn.textContent=playing?'Ⅱ':'▶';else if(btn.tagName==='BUTTON')btn.innerHTML=playing?'Ⅱ ARRÊTER':'▶ ÉCOUTER EN DIRECT';});
}
async function toggleRadio(){
  try{
    if(!audio.paused){audio.pause();audio.currentTime=0;setStatus('Radio en pause');syncButtons();return;}
    setStatus('Connexion au direct…');
    await audio.play();
    setStatus('🔴 Radio Ciwara — EN DIRECT');
  }catch(err){
    setStatus('Le lecteur principal est indisponible — utilisez le lecteur Caster.fm ci-dessus.');
  }
  syncButtons();
}
playButtons.forEach(btn=>btn.addEventListener('click',toggleRadio));
audio.addEventListener('play',()=>{setStatus('🔴 Radio Ciwara — EN DIRECT');syncButtons()});
audio.addEventListener('pause',()=>syncButtons());
audio.addEventListener('error',()=>setStatus('Flux direct temporairement indisponible.'));

if(menuToggle)menuToggle.addEventListener('click',()=>menu.classList.toggle('open'));
if(menu)menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

const toggle=document.getElementById('tickerToggle');
if(toggle)toggle.addEventListener('click',()=>{tickerPaused=!tickerPaused;ticker.style.animationPlayState=tickerPaused?'paused':'running';toggle.textContent=tickerPaused?'▶':'Ⅱ'});

function escapeHtml(value=''){return value.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function renderNews(items){
 const grid=document.getElementById('newsGrid'); if(!grid)return;
 if(!items?.length){grid.innerHTML='<div class="empty-note">Les dernières actualités seront publiées ici dès la prochaine synchronisation RSS.</div>';return}
 grid.innerHTML=items.slice(0,8).map((item,i)=>`<article class="news-card"><div class="news-image">${escapeHtml(item.source||'ACTUALITÉ')}<span></span></div><div class="news-content"><span class="news-source">${escapeHtml(item.source||'ACTUALITÉ')}</span><h3>${escapeHtml(item.title||'Actualité')}</h3><p>${escapeHtml(item.description||'Retrouvez cette actualité sur le site de sa source.')}</p><div class="news-meta">${escapeHtml(item.date||'Aujourd’hui')} · Source : ${escapeHtml(item.source||'Média')}</div><p style="margin-top:10px"><a href="${escapeHtml(item.link||'#')}" target="_blank" rel="noopener">Lire la source →</a></p></div></article>`).join('');
}
async function loadNews(){
 try{const res=await fetch('data/news.json?ts='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error('news');const data=await res.json();renderNews(data.items||[]);if(ticker&&data.items?.length){ticker.innerHTML=data.items.slice(0,6).map(x=>`<span>${escapeHtml(x.title)}</span>`).join('')}}catch(e){renderNews([])}
}
loadNews();
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
