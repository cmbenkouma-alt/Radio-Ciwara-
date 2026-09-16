(()=>{'use strict';
const target=()=>document.getElementById('caster-player');
const go=()=>{const el=target();if(el)el.scrollIntoView({behavior:'smooth',block:'center'});};
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-play]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();go();},true);
})();
