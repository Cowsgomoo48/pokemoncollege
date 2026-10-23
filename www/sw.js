// PokémonCollege offline app shell, version 0.12.1
const CACHE='pokemoncollege-shell-0331';
const APP=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./assets/sudo/head.png','./assets/sudo/body.png','./assets/sudo/feet.png','./assets/sudo/br_end.png','./assets/sudo/br_arm.png','./assets/sudo/meta.json','./assets/safari/grass-reveal.gif','./assets/pmd/manifest.json','./assets/costume/witch.png','./assets/costume/grad.png','./assets/costume/beanie.png','./assets/costume/flowers.png','./assets/costume/sunhat.png','./assets/shop/shop_bg.jpg','./assets/shop/mag_body.png','./assets/shop/mag_armL.png','./assets/shop/mag_armR.png','./assets/tm/scene.png','./assets/tm/glass.png','./assets/tm/shelf_cap.png','./assets/tm/shelf_row.png','./assets/ult/band.png','./assets/ult/band_mask.png'].concat(['standard','curious','happy','sad','mad'].map(k=>'./assets/shop/cry_'+k+'.mp3'));
// Also precache every bundled sprite sheet and portrait so the whole app works offline after the first launch.
self.addEventListener('install', event=>{event.waitUntil(caches.open(CACHE).then(async cache=>{
 await cache.addAll(APP);
 const all=await (await fetch('./assets/pmd/manifest.json')).json();
 await cache.addAll(Object.entries(all).flatMap(([num,a])=>Object.values(a).map(x=>x.url).concat('./assets/portrait/'+num+'.png')));
 const rare=await (await fetch('./assets/costume/rare/manifest.json')).json();
 await cache.addAll(['./assets/costume/rare/manifest.json'].concat(Object.values(rare).flatMap(a=>{const u=Object.values(a).map(x=>x.url);return u.concat(u[0].replace(/[^/]+$/,'portrait.png'))})));
}).then(()=>self.skipWaiting()))});
self.addEventListener('activate', event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pokemoncollege-shell-0331')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch', event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{})}return res}).catch(()=>caches.match(req).then(c=>c|| (req.mode==='navigate'?caches.match('./index.html'):Response.error()))))});
