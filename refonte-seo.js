(()=>{'use strict';
const q=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').trim();
function meta(name,content){if(!content)return;let m=document.querySelector(`meta[name="${name}"]`);if(!m){m=document.createElement('meta');m.name=name;document.head.appendChild(m)}m.content=content}
function og(property,content){if(!content)return;let m=document.querySelector(`meta[property="${property}"]`);if(!m){m=document.createElement('meta');m.setAttribute('property',property);document.head.appendChild(m)}m.content=content}
async function apply(){try{const r=await fetch('data/cms-portal.json?v=20260917',{cache:'no-store'});if(!r.ok)return;const d=await r.json();const s=d?.seo;if(!s)return;const title=esc(s.title);const description=esc(s.description);const keywords=esc(s.keywords);if(title){document.title=title;og('og:title',title);meta('twitter:title',title)}if(description){meta('description',description);og('og:description',description);meta('twitter:description',description)}if(keywords)meta('keywords',keywords);const canonical=q('link[rel="canonical"]');if(canonical)og('og:url',canonical.href)}catch{}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();