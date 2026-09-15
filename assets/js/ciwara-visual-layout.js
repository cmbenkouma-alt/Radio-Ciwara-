(async()=>{
'use strict';
const url='data/home-layout.json?v=20260915';
const safe=(v,f='')=>v==null?f:String(v);
function apply(b){
 const el=document.querySelector(b.selector); if(!el)return;
 el.dataset.ciwaraBlock=b.id;
 if(b.locked)el.dataset.ciwaraLocked='true';
 el.style.display=b.visible===false?'none':'';
 const s=b.style||{};
 if(s.background&&s.background!=='transparent')el.style.background=s.background;
 if(s.color&&s.color!=='inherit')el.style.color=s.color;
 if(s.radius!==undefined)el.style.borderRadius=Math.max(0,Number(s.radius)||0)+'px';
 if(s.padding!==undefined)el.style.padding=safe(s.padding,'');
 if(s.shadow&&s.shadow!=='none')el.style.boxShadow=s.shadow; else if(s.shadow==='none')el.style.boxShadow='none';
 el.style.setProperty('--ciwara-block-accent',safe(s.accent,'#d71920'));
}
function reorder(blocks){
 const groups={};
 blocks.forEach(b=>{const el=document.querySelector(b.selector);if(!el||b.locked)return;(groups[b.group||'body']??=[]).push({b,el})});
 Object.values(groups).forEach(items=>{
  const parents=new Map();
  items.forEach(x=>{if(!x.el.parentElement)return;const a=parents.get(x.el.parentElement)||[];a.push(x);parents.set(x.el.parentElement,a)});
  parents.forEach(arr=>{arr.sort((a,b)=>(Number(a.b.order)||999)-(Number(b.b.order)||999));const frag=document.createDocumentFragment();arr.forEach(x=>frag.appendChild(x.el));arr[0].el.parentElement.insertBefore(frag,arr[0].el.parentElement.firstChild)})
 });
}
try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('layout '+r.status);const d=await r.json();const blocks=Array.isArray(d.blocks)?d.blocks:[];blocks.forEach(apply);reorder(blocks)}catch(e){console.warn('[Ciwara visual layout]',e)}
})();
