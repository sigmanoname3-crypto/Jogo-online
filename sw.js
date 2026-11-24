const V='bonecos-v11',CORE=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 const store=r=>{if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r};
 // página: rede primeiro (garante cliente na mesma versão do servidor online); o resto: cache primeiro
 if(e.request.mode==='navigate')return e.respondWith(fetch(e.request).then(store).catch(()=>caches.match('/index.html')));
 e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(store).catch(()=>caches.match('/index.html'))))});
