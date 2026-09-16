(()=>{'use strict';
/* Correctif ciblé du menu principal + direction artistique du HERO.
   Le périmètre reste strictement limité au HERO : menu, slider actualités et lecteur Caster.fm. */
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

/* =========================================================
   CIWARA HERO — direction artistique premium
   Design uniquement : aucune donnée, URL, player ou logique n'est modifié.
   ========================================================= */
.ciwara-hero .hero-player.ciwara-caster-card{
  position:relative!important;
  overflow:hidden!important;
  border:1px solid rgba(247,213,27,.55)!important;
  border-radius:18px!important;
  padding:0!important;
  background:linear-gradient(145deg,#071a12 0%,#0b2d1e 48%,#07110d 100%)!important;
  box-shadow:0 22px 55px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08)!important;
  isolation:isolate!important;
}
.ciwara-hero .ciwara-caster-card:before{
  content:'';position:absolute;inset:-35% auto auto -12%;width:210px;height:210px;border-radius:50%;
  background:radial-gradient(circle,rgba(247,213,27,.22),transparent 68%);pointer-events:none;z-index:-1;
}
.ciwara-hero .ciwara-caster-card:after{
  content:'';position:absolute;right:-65px;bottom:-95px;width:240px;height:240px;border-radius:50%;
  background:radial-gradient(circle,rgba(11,143,77,.42),transparent 68%);pointer-events:none;z-index:-1;
}
.ciwara-hero .ciwara-caster-card .player-title{
  min-height:64px!important;box-sizing:border-box!important;padding:16px 18px!important;
  display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;
  border-bottom:1px solid rgba(255,255,255,.1)!important;background:linear-gradient(90deg,rgba(0,0,0,.34),rgba(255,255,255,.035))!important;
}
.ciwara-hero .ciwara-caster-card .player-title b{
  font:900 14px/1.15 Montserrat,sans-serif!important;letter-spacing:.15px!important;color:#fff!important;
}
.ciwara-hero .ciwara-caster-card .player-title span{
  display:inline-flex!important;align-items:center!important;gap:6px!important;white-space:nowrap!important;
  padding:7px 10px!important;border:1px solid rgba(247,213,27,.45)!important;border-radius:999px!important;
  background:rgba(247,213,27,.1)!important;color:#f7d51b!important;font:900 8px Montserrat,sans-serif!important;letter-spacing:.7px!important;
  box-shadow:0 0 18px rgba(247,213,27,.08)!important;
}
.ciwara-hero .ciwara-caster-card .player-title span:first-letter{font-size:12px}
.ciwara-hero .ciwara-caster-card .direct-player{
  margin:0!important;padding:15px!important;background:rgba(0,0,0,.18)!important;
  border:0!important;min-height:112px!important;display:flex!important;align-items:center!important;justify-content:center!important;
}
.ciwara-hero .ciwara-caster-card .cstrEmbed{
  width:100%!important;min-height:82px!important;border-radius:12px!important;overflow:hidden!important;
  background:rgba(255,255,255,.96)!important;box-shadow:0 10px 28px rgba(0,0,0,.24)!important;
}

/* Slider actualités : look éditorial premium */
.ciwara-hero .hero-preserve-slider{
  position:relative!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;
  margin-top:16px!important;border:1px solid rgba(247,213,27,.58)!important;border-radius:18px!important;
  overflow:hidden!important;background:linear-gradient(145deg,#0a0d0f 0%,#111820 58%,#071b12 100%)!important;
  color:#fff!important;box-shadow:0 22px 55px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.07)!important;
}
.ciwara-hero .hero-preserve-slider:before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,#0b8f4d 0 33%,#f7d51b 33% 66%,#d71920 66% 100%);z-index:4;
}
.ciwara-hero .hero-preserve-slider .hps-head{
  min-height:66px;box-sizing:border-box;padding:15px 17px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;
  border-bottom:1px solid rgba(255,255,255,.09)!important;background:linear-gradient(90deg,rgba(255,255,255,.045),transparent)!important;
}
.ciwara-hero .hero-preserve-slider .hps-head b{
  font:900 15px/1.15 Montserrat,sans-serif!important;letter-spacing:.1px!important;color:#fff!important;
}
.ciwara-hero .hero-preserve-slider .hps-head span{
  padding:7px 10px!important;border:1px solid rgba(247,213,27,.38)!important;border-radius:999px!important;
  background:rgba(247,213,27,.08)!important;color:#f7d51b!important;font:900 8px Montserrat,sans-serif!important;letter-spacing:.7px!important;white-space:nowrap!important;
}
.ciwara-hero .hero-preserve-slider .hps-track{
  display:flex!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:14px!important;scrollbar-width:none!important;scroll-behavior:smooth!important;
}
.ciwara-hero .hero-preserve-slider .hps-track::-webkit-scrollbar{display:none!important}
.ciwara-hero .hero-preserve-slider .hps-card{
  position:relative!important;flex:0 0 250px!important;height:156px!important;border-radius:12px!important;overflow:hidden!important;
  background:#181b1e!important;border:1px solid rgba(255,255,255,.1)!important;box-shadow:0 10px 24px rgba(0,0,0,.25)!important;
  transform:translateZ(0);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease!important;
}
.ciwara-hero .hero-preserve-slider .hps-card:hover{
  transform:translateY(-4px)!important;border-color:rgba(247,213,27,.65)!important;box-shadow:0 16px 32px rgba(0,0,0,.38)!important;
}
.ciwara-hero .hero-preserve-slider .hps-card img{
  width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;transition:transform .45s ease,filter .45s ease!important;
}
.ciwara-hero .hero-preserve-slider .hps-card:hover img{transform:scale(1.045)!important;filter:saturate(1.08)!important}
.ciwara-hero .hero-preserve-slider .hps-card:after{
  content:''!important;position:absolute!important;inset:25% 0 0!important;background:linear-gradient(180deg,transparent 5%,rgba(0,0,0,.82) 100%)!important;
}
.ciwara-hero .hero-preserve-slider .hps-copy{left:13px!important;right:13px!important;bottom:12px!important;z-index:2!important}
.ciwara-hero .hero-preserve-slider .hps-copy small{
  display:inline-block!important;padding:4px 7px!important;border-radius:4px!important;background:#d71920!important;color:#fff!important;
  font:900 7px Montserrat,sans-serif!important;letter-spacing:.45px!important;
}
.ciwara-hero .hero-preserve-slider .hps-copy b{
  display:block!important;margin-top:7px!important;font:900 12px/1.22 Montserrat,sans-serif!important;color:#fff!important;
  text-shadow:0 2px 8px rgba(0,0,0,.65)!important;
}
.ciwara-hero .hero-preserve-slider .hps-controls{
  min-height:52px;box-sizing:border-box;padding:8px 12px!important;border-top:1px solid rgba(255,255,255,.09)!important;
  background:rgba(0,0,0,.16)!important;
}
.ciwara-hero .hero-preserve-slider .hps-controls button{
  width:34px!important;height:34px!important;border:1px solid rgba(247,213,27,.55)!important;background:#111214!important;color:#fff!important;border-radius:50%!important;
  box-shadow:0 4px 14px rgba(0,0,0,.2)!important;transition:transform .2s ease,background .2s ease!important;
}
.ciwara-hero .hero-preserve-slider .hps-controls button:hover{transform:scale(1.08)!important;background:#0b8f4d!important}
.ciwara-hero .hero-preserve-slider .hps-controls span{font:800 8px Montserrat,sans-serif!important;letter-spacing:.55px!important;color:#bfc5c2!important}

@media(max-width:650px){
  .ciwara-hero .ciwara-caster-card{border-radius:14px!important}
  .ciwara-hero .ciwara-caster-card .player-title{padding:13px 14px!important;min-height:58px!important}
  .ciwara-hero .ciwara-caster-card .player-title b{font-size:12px!important}
  .ciwara-hero .ciwara-caster-card .player-title span{padding:6px 8px!important}
  .ciwara-hero .ciwara-caster-card .direct-player{padding:10px!important;min-height:98px!important}
  .ciwara-hero .hero-preserve-slider{margin-top:12px!important;border-radius:14px!important}
  .ciwara-hero .hero-preserve-slider .hps-head{padding:12px 13px!important;min-height:58px}
  .ciwara-hero .hero-preserve-slider .hps-head b{font-size:13px!important}
  .ciwara-hero .hero-preserve-slider .hps-head span{padding:6px 8px!important;font-size:7px!important}
  .ciwara-hero .hero-preserve-slider .hps-track{padding:10px!important;gap:10px!important}
  .ciwara-hero .hero-preserve-slider .hps-card{flex-basis:220px!important;height:138px!important}
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
})();