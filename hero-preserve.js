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
})();