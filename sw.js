const CACHE='ciwara-v20260912';
const CORE=['./','./index.html','./style.css?v=20260902','./script.js?v=20260902','./manifest.webmanifest','./favicon-ciwara.svg','./logo.jpg','./logo%20hitradio.png','./data/news.json','./data/ciwara-info.json','./ciwara-info.html','./ciwara-tv.html','./download-app.html'];
const DATA_PREFIX='/data/';

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;

  // CMS JSON: network-first so published changes appear quickly, with offline fallback.
  if(url.pathname.startsWith(DATA_PREFIX)){
    event.respondWith(
      fetch(request)
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put(request,copy));
          }
          return response;
        })
        .catch(()=>caches.match(request))
    );
    return;
  }

  // HTML navigations: network-first, then cached page for offline use.
  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
          return response;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  // Static assets: cache-first for fast repeat visits.
  event.respondWith(
    caches.match(request).then(cached=>cached||fetch(request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(request,copy));
      }
      return response;
    }))
  );
});
