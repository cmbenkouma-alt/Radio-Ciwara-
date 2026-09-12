(() => {
  const VIDEO_URL = 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fradiociwarafm%2Fvideos%2F3154611518262011%2F&show_text=false&width=560&t=0';
  const PAGE_URL = 'https://www.facebook.com/radiociwarafm';

  const css = `
    .ciwara-facebook-live{width:100%;max-width:1100px;margin:28px auto;background:#0b0c0e;border:1px solid #292b30;border-radius:14px;overflow:hidden;box-shadow:0 16px 38px rgba(0,0,0,.18);color:#fff;box-sizing:border-box}
    .ciwara-facebook-live__head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 18px;background:linear-gradient(135deg,#121418,#20242a);border-bottom:1px solid #30343a}
    .ciwara-facebook-live__title{display:flex;align-items:center;gap:11px;min-width:0}.ciwara-facebook-live__dot{width:11px;height:11px;border-radius:50%;background:#e31837;box-shadow:0 0 0 5px rgba(227,24,55,.13);animation:ciwaraLivePulse 1.6s infinite;flex:0 0 auto}
    .ciwara-facebook-live__eyebrow{display:block;font:900 9px/1 Montserrat,Arial,sans-serif;letter-spacing:1.1px;color:#e31837;text-transform:uppercase}.ciwara-facebook-live__name{display:block;margin-top:5px;font:900 20px/1.1 Montserrat,Arial,sans-serif}.ciwara-facebook-live__badge{font:900 8px/1 Montserrat,Arial,sans-serif;padding:8px 10px;border-radius:999px;background:#e31837;color:#fff;white-space:nowrap}
    .ciwara-facebook-live__video{position:relative;width:100%;aspect-ratio:16/9;background:#050505;overflow:hidden}.ciwara-facebook-live__video iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
    .ciwara-facebook-live__foot{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 16px;background:#111317}.ciwara-facebook-live__foot p{margin:0;color:#c7c9cc;font:500 11px/1.45 Roboto,Arial,sans-serif}.ciwara-facebook-live__button{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 14px;border-radius:7px;background:#1877f2;color:#fff;text-decoration:none;font:900 9px Montserrat,Arial,sans-serif}
    @keyframes ciwaraLivePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.82)}}
    @media(max-width:650px){.ciwara-facebook-live{margin:20px auto;border-radius:10px}.ciwara-facebook-live__head{padding:13px 14px}.ciwara-facebook-live__name{font-size:16px}.ciwara-facebook-live__foot{align-items:stretch;flex-direction:column;padding:12px 14px}.ciwara-facebook-live__button{width:100%;box-sizing:border-box}}
  `;

  function addStyle(){
    if(document.getElementById('ciwara-facebook-live-style')) return;
    const style=document.createElement('style');style.id='ciwara-facebook-live-style';style.textContent=css;document.head.appendChild(style);
  }

  function render(){
    if(document.querySelector('.ciwara-facebook-live')) return;
    const iframe=[...document.querySelectorAll('iframe')].find(el=>/facebook\.com\/plugins\/video\.php/i.test(el.src));
    if(!iframe) return;

    // Ne remonte jamais jusqu'au hero : on remplace uniquement le conteneur
    // immédiat du lecteur Facebook existant.
    const host=iframe.parentElement;
    if(!host || host === document.body || host === document.documentElement) return;

    const card=document.createElement('section');
    card.className='ciwara-facebook-live';
    card.setAttribute('aria-label','Facebook Live Radio Ciwara');
    card.innerHTML=`
      <div class="ciwara-facebook-live__head"><div class="ciwara-facebook-live__title"><span class="ciwara-facebook-live__dot"></span><div><span class="ciwara-facebook-live__eyebrow">Direct Facebook</span><strong class="ciwara-facebook-live__name">CIWARA LIVE</strong></div></div><span class="ciwara-facebook-live__badge">● EN DIRECT</span></div>
      <div class="ciwara-facebook-live__video"><iframe src="${VIDEO_URL}" title="Radio Ciwara — Facebook Live" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div>
      <div class="ciwara-facebook-live__foot"><p>Suivez Radio Ciwara 105.5 FM en direct sur Facebook.</p><a class="ciwara-facebook-live__button" href="${PAGE_URL}" target="_blank" rel="noopener noreferrer">f&nbsp;&nbsp;Voir Radio Ciwara sur Facebook</a></div>`;

    host.replaceWith(card);
  }

  addStyle();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render,{once:true}); else render();
})();
