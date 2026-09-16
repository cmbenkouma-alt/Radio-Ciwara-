(()=>{'use strict';
/* Correctif ciblé du menu principal : le nouveau header utilise .portal-nav/.portal-links,
   tandis que l'ancien responsive ciblait .site-header. Aucun contenu ou lecteur n'est modifié. */
const style=document.createElement('style');
style.id='ciwara-menu-fix';
style.textContent=`
.portal-nav .menu-toggle{display:none;background:transparent;border:0;color:#111214;font-size:28px;line-height:1;width:42px;height:42px;padding:0;cursor:pointer;align-items:center;justify-content:center}
@media(max-width:900px){
  .portal-nav .container{position:relative}
  .portal-nav .menu-toggle{display:flex;margin-left:auto;z-index:1001}
  .portal-nav .portal-links{display:none;position:absolute;z-index:1000;top:100%;left:0;right:0;margin:0;padding:16px 4%;background:#fff;border-top:1px solid #eee;border-bottom:1px solid #ddd;box-shadow:0 12px 24px rgba(0,0,0,.12);flex-direction:column;align-items:stretch;gap:0}
  .portal-nav .portal-links.open{display:flex}
  .portal-nav .portal-links a{display:block;padding:13px 4px;border-bottom:1px solid #eee;font-size:11px}
  .portal-nav .portal-links a:last-child{border-bottom:0}
}
@media(max-width:650px){
  .portal-nav .menu-toggle{font-size:26px;width:38px;height:38px}
  .portal-nav .portal-links{padding:12px 5%}
}
`;
document.head.appendChild(style);

const menu=document.getElementById('mainNav');
const toggle=document.getElementById('menuToggle');
if(menu&&toggle){
  const close=()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');};
  toggle.setAttribute('aria-expanded','false');
  toggle.addEventListener('click',()=>{
    const open=!menu.classList.contains('open');
    menu.classList.toggle('open',open);
    toggle.setAttribute('aria-expanded',String(open));
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  window.addEventListener('resize',()=>{if(window.innerWidth>900)close();});
}

/* CIWARA HERO V1 — refonte visuelle ciblée uniquement sur le HERO.
   Le lecteur Caster.fm existant est conservé et déplacé visuellement dans le HERO. */
const hero=document.querySelector('.ciwara-hero');
if(hero){
  const bg=hero.querySelector('.hero-bg');
  const player=hero.querySelector('.ciwara-caster-card');
  const shell=document.createElement('div');
  shell.className='ciwara-hero-v1';
  shell.innerHTML=`
    <div class="ciwara-hero-v1-bg" aria-hidden="true"></div>
    <div class="container ciwara-hero-v1-inner">
      <div class="ciwara-hero-v1-copy">
        <span class="ciwara-hero-v1-tag">À LA UNE</span>
        <p class="ciwara-hero-v1-kicker">CIWARA MÉDIAS · ACTUALITÉ</p>
        <h1>L’actualité du Mali<br><strong>au cœur de Ciwara</strong></h1>
        <p class="ciwara-hero-v1-desc">L’information, la culture et les événements qui font l’actualité du Mali, avec Radio Ciwara 105.5 FM.</p>
        <a class="ciwara-hero-v1-cta" href="#actualites">LIRE L’ARTICLE <span>→</span></a>
        <div class="ciwara-hero-v1-slider"><b>01</b><i></i><span>04</span><div class="ciwara-hero-v1-dots"><em class="active"></em><em></em><em></em><em></em></div></div>
      </div>
      <div class="ciwara-hero-v1-side">
        <div class="ciwara-hero-v1-live"><span class="live-dot"></span> RADIO CIWARA <b>105.5 FM</b></div>
        <div class="ciwara-hero-v1-player-slot"></div>
      </div>
    </div>`;

  const originalGrid=hero.querySelector('.hero-grid');
  if(originalGrid) originalGrid.style.display='none';
  if(bg) bg.style.display='none';
  hero.insertBefore(shell,hero.firstChild);
  const slot=shell.querySelector('.ciwara-hero-v1-player-slot');
  if(slot&&player) slot.appendChild(player);

  const heroStyle=document.createElement('style');
  heroStyle.id='ciwara-hero-v1-style';
  heroStyle.textContent=`
.ciwara-hero{position:relative!important;min-height:0!important;padding:0!important;border-top:0!important;border-bottom:4px solid #f7d51b!important;background:#08090b!important;overflow:hidden!important}
.ciwara-hero-v1{position:relative;min-height:560px;color:#fff;isolation:isolate;background:#08090b;overflow:hidden}
.ciwara-hero-v1-bg{position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,rgba(4,7,8,.97) 0%,rgba(4,7,8,.82) 42%,rgba(4,7,8,.42) 72%,rgba(4,7,8,.70) 100%),radial-gradient(circle at 75% 42%,rgba(215,25,32,.28),transparent 25%),radial-gradient(circle at 60% 20%,rgba(247,213,27,.16),transparent 23%),url('logo.jpg') center/cover no-repeat;transform:scale(1.02)}
.ciwara-hero-v1-bg:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.72),transparent 42%)}
.ciwara-hero-v1-inner{position:relative;min-height:560px;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:44px;align-items:center;padding-top:30px;padding-bottom:30px;box-sizing:border-box}
.ciwara-hero-v1-copy{max-width:780px;padding-left:4px}
.ciwara-hero-v1-tag{display:inline-flex;align-items:center;background:#d71920;color:#fff;padding:8px 11px;border-radius:2px;font:900 9px Montserrat;letter-spacing:1px;box-shadow:0 8px 22px rgba(215,25,32,.25)}
.ciwara-hero-v1-kicker{margin:18px 0 8px;color:#f7d51b;font:900 10px Montserrat;letter-spacing:2px}
.ciwara-hero-v1-copy h1{margin:0;max-width:760px;font:900 clamp(40px,5.1vw,76px)/.98 Montserrat;letter-spacing:-2.5px;text-transform:uppercase;text-shadow:0 8px 30px rgba(0,0,0,.38)}
.ciwara-hero-v1-copy h1 strong{color:#fff}
.ciwara-hero-v1-desc{max-width:650px;margin:20px 0 22px;color:#e8e8e8;font:500 14px/1.55 Roboto}
.ciwara-hero-v1-cta{display:inline-flex;align-items:center;gap:12px;background:#d71920;color:#fff;text-decoration:none;padding:13px 18px;border-radius:3px;font:900 10px Montserrat;box-shadow:0 10px 26px rgba(215,25,32,.26);transition:transform .2s ease,background .2s ease}
.ciwara-hero-v1-cta:hover{transform:translateY(-2px);background:#ed2028}.ciwara-hero-v1-cta span{font-size:17px;line-height:10px}
.ciwara-hero-v1-slider{display:flex;align-items:center;gap:9px;margin-top:28px;font:900 9px Montserrat;color:#fff}.ciwara-hero-v1-slider i{display:block;width:42px;height:1px;background:rgba(255,255,255,.5)}.ciwara-hero-v1-slider>span{color:#aaa}.ciwara-hero-v1-dots{display:flex;gap:5px;margin-left:8px}.ciwara-hero-v1-dots em{display:block;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.38)}.ciwara-hero-v1-dots em.active{width:18px;border-radius:99px;background:#f7d51b}
.ciwara-hero-v1-side{align-self:center;width:100%;max-width:360px;justify-self:end}.ciwara-hero-v1-live{display:flex;align-items:center;gap:7px;color:#fff;font:900 10px Montserrat;letter-spacing:.5px;margin:0 0 9px;padding-left:4px}.ciwara-hero-v1-live b{color:#f7d51b}.live-dot{width:8px;height:8px;background:#ef3340;border-radius:50%;box-shadow:0 0 0 5px rgba(239,51,64,.14);animation:ciwaraHeroLive 1.6s ease-in-out infinite}.ciwara-hero-v1-player-slot .ciwara-caster-card{display:block!important;max-width:none!important;width:100%!important;justify-self:auto!important;border:1px solid rgba(247,213,27,.75)!important;border-radius:10px!important;background:rgba(255,255,255,.97)!important;box-shadow:0 20px 45px rgba(0,0,0,.42)!important}.ciwara-hero-v1-player-slot .ciwara-caster-card .player-title{height:48px!important;padding:0 15px!important;background:linear-gradient(90deg,#111214,#d71920)!important;border-bottom:3px solid #f7d51b!important}.ciwara-hero-v1-player-slot .ciwara-caster-card .direct-player{min-height:125px!important}
@keyframes ciwaraHeroLive{0%,100%{box-shadow:0 0 0 4px rgba(239,51,64,.10)}50%{box-shadow:0 0 0 8px rgba(239,51,64,.22)}}
@media(max-width:900px){.ciwara-hero-v1-inner{grid-template-columns:1fr;min-height:0;gap:26px;padding:45px 4% 30px}.ciwara-hero-v1-copy{max-width:760px}.ciwara-hero-v1-side{max-width:620px;justify-self:start}.ciwara-hero-v1-copy h1{font-size:clamp(36px,8vw,60px)}}
@media(max-width:650px){.ciwara-hero-v1{min-height:0}.ciwara-hero-v1-inner{padding:32px 5% 22px;gap:22px}.ciwara-hero-v1-kicker{font-size:8px;letter-spacing:1.4px;margin-top:14px}.ciwara-hero-v1-copy h1{font-size:clamp(31px,10vw,46px);letter-spacing:-1.5px}.ciwara-hero-v1-desc{font-size:12px;margin:15px 0 18px}.ciwara-hero-v1-slider{margin-top:22px}.ciwara-hero-v1-side{max-width:none}.ciwara-hero-v1-live{font-size:9px}.ciwara-hero-v1-player-slot .ciwara-caster-card .direct-player{min-height:105px!important}}
@media(prefers-reduced-motion:reduce){.live-dot{animation:none}.ciwara-hero-v1-cta{transition:none}}
`;
  document.head.appendChild(heroStyle);
}
})();