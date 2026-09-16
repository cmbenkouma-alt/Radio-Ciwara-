(()=>{
'use strict';

/* Programme accueil Radio Ciwara 2026.
   Ce module ne modifie aucun lecteur radio ni aucun élément Caster.fm. */
const WEEK=[
  {d:'Lundi',items:[['06:45','Ouverture d’antenne'],['07:00','Tour d’Horizon'],['08:00','Ciwara Matin'],['09:00','Flash Infos'],['09:05','Musiques · Annonces et Publicités'],['10:00','Revue de la Presse – Gaffé'],['11:30','Baroni Sensibilisation'],['13:00','Maana'],['14:00','Flash Ciwara FM'],['14:05','Mouna Pourquoi'],['15:00','Ciwara Sports'],['16:00','Soumou'],['17:00','Ciwara Love'],['18:00','Grand Journal'],['18:15','Baroni Sensibilisation'],['19:00','Rediffusion Revue de la Presse'],['20:00','Senoufo'],['21:00','Seko ni Donko'],['22:00','Retro Mali'],['23:00','Top Mandingue'],['00:00',''] ]},
  {d:'Mardi',items:[['06:45','Ouverture d’antenne'],['07:00','Tour d’Horizon'],['08:00','Ciwara Matin'],['09:00','Flash Infos'],['09:05','Musiques · Annonces et Publicités'],['10:00','Revue de la Presse – Gaffé'],['11:30','Baroni Sensibilisation'],['13:00','Maana'],['13:00','Maana'],['14:00','Flash Ciwara FM'],['14:05','Femmes et Société'],['15:00','Fôli Douman Kènè'],['16:00','Soumou'],['17:00','Ciwara Love'],['18:00','Grand Journal'],['18:15','Baroni Sensibilisation'],['19:00','Rediffusion Revue de la Presse'],['20:00','Sécurité routière'],['21:00','Top Indou'],['22:00','Salsa'],['23:00','Diaspora'],['00:00',''] ]},
  {d:'Mercredi',items:[['06:45','Ouverture d’antenne'],['07:00','Tour d’Horizon'],['08:00','Ciwara Matin'],['09:00','Flash Infos'],['09:05','Musiques · Annonces et Publicités'],['10:00','Revue de la Presse – Gaffé'],['11:30','Baroni Sensibilisation'],['13:00','Maana'],['14:00','Flash Ciwara FM'],['14:05','Douba ni A Konokow'],['15:00','J’aime Ma Commune'],['16:00','Soumou'],['17:00','Ciwara Love'],['18:00','Grand Journal'],['18:15','Baroni Sensibilisation'],['19:00','Rediffusion Revue de la Presse'],['20:00','Bani Ka Dou Tanou'],['21:00','Hit du Mali'],['22:00','Sénégal'],['23:00','Top Mandingue'],['00:00',''] ]},
  {d:'Jeudi',items:[['06:45','Ouverture d’antenne'],['07:00','Tour d’Horizon'],['08:00','Ciwara Matin'],['09:00','Flash Infos'],['09:05','Musiques · Annonces et Publicités'],['10:00','Revue de la Presse – Gaffé'],['11:30','Baroni Sensibilisation'],['13:00','Maana'],['14:00','Flash Ciwara FM'],['14:05','Education Civique'],['15:00','Fôli Douman Kènè'],['16:00','Zikiri Kènè'],['17:00','Ciwara Love'],['18:00','Grand Journal'],['18:15','Baroni Sensibilisation'],['19:00','Rediffusion Revue de la Presse'],['20:00','Ciwara Sports'],['21:00','Tièben Kènè'],['22:00','Yéelen'],['23:00','Ciwara Mix'],['00:00',''] ]},
  {d:'Vendredi',items:[['06:45','Ouverture d’antenne'],['07:00','Tour d’Horizon'],['08:00','Ciwara Matin'],['09:00','Flash Infos'],['09:05','Musiques · Annonces et Publicités'],['10:00','Revue de la Presse – Gaffé'],['11:30','Baroni Sensibilisation'],['13:00','Mali Koura Djô Kènè'],['14:00','Flash Ciwara FM'],['15:00','Yéelen'],['16:00','Sonrhai'],['17:00','Ciwara Love'],['18:00','Bwa'],['19:00','Rap Mali'],['20:00','Bani Ka Dou Tanou'],['21:00','Ciwara Sports'],['22:00','Yéelen'],['23:00','Terroir'],['00:00','Ciwara Mix'] ]},
  {d:'Samedi',items:[['06:45','Ouverture d’antenne'],['07:00','Tour d’Horizon'],['08:00','Ciwara Matin'],['09:00','Retro Music'],['10:00','Ciwara Sports'],['11:30','Naré kènè A ni Fôli Duman'],['13:00','Mali Koura Djô Kènè'],['14:00','Mon Environnement'],['15:00','Hit de la Guinnée'],['16:00','Dogon'],['17:00','A ma Famou'],['18:00','Bwa'],['19:00','Rap Mali'],['20:00','L’émission Songhaï'],['22:00','Terroir'],['23:00','Ciwara Mix'],['00:00','Ciwara Mix'] ]},
  {d:'Dimanche',items:[['06:45','Ouverture d’antenne'],['07:00','Tour d’Horizon'],['08:00','OMA'],['09:00','Retro Music'],['10:00','Droit et devoir'],['11:30','Maliba ni à Kungow'],['13:00','Hit du Mali'],['14:00','Tièssiri Kènè'],['15:00','Nous les enfants'],['16:00','Dogon'],['17:00','Ciwara Contes, Humour et Rire'],['18:00','Côte D’Ivoire'],['19:00','Rap Mali'],['20:00','L’émission Top Indou'],['22:00','Yéelen'],['23:00','Ciwara Mix'],['00:00','Ciwara Mix'] ]}
];

const css=`

/* CIWARA FULL-WIDTH PROGRAMME REDESIGN 2026-09-16 */
.home-programme-card{
  width:100%!important;max-width:none!important;margin:0!important;
  border:1px solid rgba(247,213,27,.72)!important;border-radius:18px!important;
  background:
    radial-gradient(circle at 92% 8%,rgba(247,213,27,.20),transparent 22%),
    radial-gradient(circle at 8% 100%,rgba(215,25,32,.16),transparent 25%),
    linear-gradient(115deg,#0b0d0f 0%,#10271b 48%,#087f3f 100%)!important;
  box-shadow:0 18px 42px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.08)!important;
}
.home-programme-card:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent 0 72%,rgba(247,213,27,.035) 100%)}
.hpc-top{padding:17px 20px 14px!important;min-height:62px;border-bottom:1px solid rgba(255,255,255,.13)!important}
.hpc-kicker{font-size:9px!important;letter-spacing:1.3px!important;color:#f7d51b!important}
.hpc-title{font-size:clamp(17px,1.8vw,22px)!important;letter-spacing:-.3px}
.hpc-fm{padding:7px 10px;border:1px solid rgba(247,213,27,.55);border-radius:999px;background:rgba(247,213,27,.08);font-size:9px!important}
.hpc-days{padding:10px 16px 9px!important;gap:7px!important;background:rgba(0,0,0,.12)}
.hpc-day{padding:8px 12px!important;font-size:8px!important;transition:transform .2s ease,background .2s ease,border-color .2s ease}
.hpc-day:hover{transform:translateY(-1px);border-color:rgba(247,213,27,.65)}
.hpc-main{grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr)!important;gap:10px!important;padding:8px 16px 14px!important}
.hpc-now,.hpc-next{min-height:112px;padding:15px!important;border-radius:13px!important;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(0,0,0,.22))!important;border:1px solid rgba(255,255,255,.12)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
.hpc-now{position:relative;overflow:hidden}
.hpc-now:before{content:'EN DIRECT';position:absolute;right:12px;top:12px;color:#fff;background:#d71920;border-radius:999px;padding:5px 7px;font:900 7px Montserrat;letter-spacing:.4px;box-shadow:0 0 0 4px rgba(215,25,32,.12)}
.hpc-label{font-size:8px!important;letter-spacing:.8px!important}
.hpc-dot{width:7px!important;height:7px!important;animation:hpcLivePulse 1.7s ease-in-out infinite}
.hpc-program{font-size:clamp(15px,1.6vw,20px)!important;line-height:1.12!important;margin:9px 0 6px!important;max-width:75%}
.hpc-time{font-size:10px!important;color:#ddd!important}
.hpc-next .hpc-program{font-size:clamp(14px,1.35vw,18px)!important;max-width:100%}
.hpc-progress{height:4px!important;margin-top:11px!important;background:rgba(255,255,255,.14)!important}
.hpc-progress i{background:linear-gradient(90deg,#d71920,#f7d51b)!important}
.hpc-foot{padding:10px 16px!important;min-height:48px;background:rgba(0,0,0,.18)!important}
.hpc-foot small{font-size:9px!important;color:#c9c9c9!important}
.hpc-link{padding:9px 13px!important;font-size:8px!important;box-shadow:0 5px 16px rgba(0,0,0,.18);transition:transform .2s ease,box-shadow .2s ease}
.hpc-link:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,0,0,.24)}
@keyframes hpcLivePulse{0%,100%{box-shadow:0 0 0 3px rgba(239,51,64,.10)}50%{box-shadow:0 0 0 7px rgba(239,51,64,.20)}}
@media(max-width:900px){
  .home-programme-card{border-radius:15px!important}
  .hpc-main{grid-template-columns:1.15fr .85fr!important}
}
@media(max-width:650px){
  .home-programme-card{border-radius:13px!important}
  .hpc-top{padding:14px!important}.hpc-title{font-size:16px!important}.hpc-fm{font-size:8px!important;padding:6px 8px}
  .hpc-days{padding:9px 10px!important}
  .hpc-main{grid-template-columns:1fr!important;padding:7px 10px 11px!important}
  .hpc-now,.hpc-next{min-height:96px;padding:13px!important}
  .hpc-now:before{right:10px;top:10px}
  .hpc-program{max-width:72%!important;font-size:16px!important}
  .hpc-next .hpc-program{font-size:15px!important}
  .hpc-foot{padding:9px 10px!important;align-items:flex-start;flex-direction:column}
  .hpc-link{width:100%;justify-content:center}
}
@media(prefers-reduced-motion:reduce){.hpc-dot{animation:none}.hpc-link,.hpc-day{transition:none}}

.home-programme-card{position:relative;background:linear-gradient(135deg,#101214 0%,#163a28 58%,#087f3f 100%);border:1px solid rgba(247,213,27,.55);border-radius:16px;overflow:hidden;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.16)}
.home-programme-card:before{content:'';position:absolute;right:-65px;top:-75px;width:170px;height:170px;border:28px solid rgba(247,213,27,.10);border-radius:50%}.hpc-top{position:relative;padding:15px 16px 12px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:space-between;gap:12px}.hpc-kicker{color:#f7d51b;font:900 8px Montserrat;letter-spacing:1px}.hpc-title{font:900 17px Montserrat;margin-top:3px}.hpc-fm{white-space:nowrap;color:#f7d51b;font:900 9px Montserrat}.hpc-days{position:relative;display:flex;gap:6px;padding:10px 12px;overflow:auto;scrollbar-width:none}.hpc-days::-webkit-scrollbar{display:none}.hpc-day{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#ddd;border-radius:999px;padding:7px 10px;font:800 8px Montserrat;white-space:nowrap;cursor:pointer}.hpc-day.active{background:#f7d51b;color:#111214;border-color:#f7d51b}.hpc-main{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px 12px 12px}.hpc-now,.hpc-next{min-width:0;border-radius:12px;padding:13px;background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.10)}.hpc-label{display:flex;align-items:center;gap:5px;color:#f7d51b;font:900 7px Montserrat;letter-spacing:.6px}.hpc-dot{width:6px;height:6px;background:#ef3340;border-radius:50%;box-shadow:0 0 0 4px rgba(239,51,64,.13)}.hpc-program{font:900 14px/1.18 Montserrat;margin:7px 0 5px}.hpc-time{color:#d7d7d7;font:600 9px Roboto}.hpc-foot{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:rgba(0,0,0,.18);border-top:1px solid rgba(255,255,255,.1)}.hpc-foot small{color:#bbb;font:600 8px Roboto}.hpc-link{display:inline-flex;align-items:center;gap:5px;color:#111214;background:#f7d51b;border-radius:999px;padding:8px 11px;text-decoration:none;font:900 8px Montserrat}.hpc-empty{color:#bbb;font:600 10px Roboto;margin-top:8px}.hpc-progress{height:3px;background:rgba(255,255,255,.13);margin-top:9px;border-radius:99px;overflow:hidden}.hpc-progress i{display:block;height:100%;width:38%;background:#f7d51b;border-radius:99px}
@media(max-width:650px){.hpc-main{grid-template-columns:1fr}.hpc-top{padding:13px}.hpc-title{font-size:15px}.hpc-program{font-size:15px}.hpc-next{display:block}}
`;

function minutes(t){let [h,m]=t.split(':').map(Number);return h*60+m}
function currentDay(){const d=new Date().getDay();return d===0?6:d-1}
function nowMinutes(){const d=new Date();return d.getHours()*60+d.getMinutes()}
function nextItem(items,idx){return items[idx+1]||null}
function findCurrent(items){const n=nowMinutes();let found=-1;for(let i=0;i<items.length;i++){const start=minutes(items[i][0]);const end=i<items.length-1?minutes(items[i+1][0]):1440;if(n>=start&&n<end){found=i;break}}return found}
function render(card,dayIndex,forcedIndex){
 const day=WEEK[dayIndex];let idx=forcedIndex==null?findCurrent(day.items):forcedIndex;if(idx<0)idx=0;
 const cur=day.items[idx],nxt=nextItem(day.items,idx);const next=card.querySelector('.hpc-next');
 card.querySelector('.hpc-now .hpc-program').textContent=cur[1]||'Antenne musicale';card.querySelector('.hpc-now .hpc-time').textContent=cur[0]+' · '+(nxt?nxt[0]:'01:00');
 card.querySelector('.hpc-now .hpc-dot').style.display=(forcedIndex==null&&dayIndex===currentDay()&&findCurrent(day.items)>=0)?'block':'none';
 card.querySelector('.hpc-next .hpc-program').textContent=nxt?(nxt[1]||'Antenne musicale'):'Fin de grille';card.querySelector('.hpc-next .hpc-time').textContent=nxt?(nxt[0]+' · prochain rendez-vous'):'Programme terminé';
 const pct=Math.max(5,Math.min(100,((nowMinutes()-minutes(cur[0]))/Math.max(1,(nxt?minutes(nxt[0]):1440)-minutes(cur[0])))*100));card.querySelector('.hpc-progress i').style.width=(dayIndex===currentDay()&&!forcedIndex?' '+pct+'%':'0%');
}
function init(){
 const section=document.querySelector('#programmes');if(!section)return;
 const old=section.querySelector('.schedule');if(!old)return;
 const card=document.createElement('div');card.className='home-programme-card';
 card.innerHTML='<div class="hpc-top"><div><div class="hpc-kicker">GRILLE OFFICIELLE · 2026</div><div class="hpc-title">Programme Ciwara</div></div><div class="hpc-fm">105.5 FM</div></div><div class="hpc-days">'+WEEK.map((d,i)=>'<button class="hpc-day" type="button" data-day="'+i+'">'+d.d+'</button>').join('')+'</div><div class="hpc-main"><div class="hpc-now"><div class="hpc-label"><i class="hpc-dot"></i><span>EN DIRECT</span></div><div class="hpc-program">—</div><div class="hpc-time">—</div><div class="hpc-progress"><i></i></div></div><div class="hpc-next"><div class="hpc-label">À SUIVRE</div><div class="hpc-program">—</div><div class="hpc-time">—</div></div></div><div class="hpc-foot"><small>Information · musique · culture · société</small><a class="hpc-link" href="programmes.html">GRILLE COMPLÈTE →</a></div>';
 old.replaceWith(card);
 const today=currentDay();card.querySelectorAll('.hpc-day').forEach(btn=>{btn.classList.toggle('active',Number(btn.dataset.day)===today);btn.addEventListener('click',()=>{card.querySelectorAll('.hpc-day').forEach(x=>x.classList.remove('active'));btn.classList.add('active');render(card,Number(btn.dataset.day));});});
 render(card,today);
 setInterval(()=>{const active=card.querySelector('.hpc-day.active');if(active&&Number(active.dataset.day)===currentDay())render(card,currentDay());},60000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();