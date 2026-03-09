const CACHE_NAME = 'mom-app-v2';
const ASSETS = ['./', './index.html',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Literata:ital,wght@0,300;0,400;0,600;1,300&display=swap',
  'https://alcdn.msauth.net/browser/2.38.3/js/msal-browser.min.js'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  if(['graph.microsoft.com','login.microsoftonline.com','msauth.net'].some(d=>e.request.url.includes(d))) return;
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached) return cached;
    return fetch(e.request).then(resp=>{ if(resp&&resp.status===200){ const c=resp.clone(); caches.open(CACHE_NAME).then(cc=>cc.put(e.request,c)); } return resp; }).catch(()=>cached);
  }));
});
