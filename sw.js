// HypeMode service worker: çevrimdışı açılış + kapalıyken bildirim
const V = 'hm-v10';
const SHELL = ['./', './index.html', './manifest.webmanifest', './hm-icon-192-v3.png', './hm-icon-512-v3.png', './hm-apple-v3.png', './hm-favicon-v3.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    // önce ağ (güncellemeler hemen gelsin), yoksa önbellek
    e.respondWith(fetch(r, { cache: 'no-cache' }).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)) } return res })
      .catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
  } else if (/^(www\.gstatic\.com|fonts\.gstatic\.com|fonts\.googleapis\.com)$/.test(u.hostname)) {
    // Firebase SDK ve yazı tipleri: önbellekten, arka planda tazele
    e.respondWith(caches.match(r).then(m => { const net = fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)) } return res }).catch(() => m); return m || net }));
  }
});
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {} } catch (x) { d = { body: e.data && e.data.text() } }
  e.waitUntil(self.registration.showNotification(d.title || 'HypeMode', { body: d.body || '', icon: 'hm-icon-192-v3.png', badge: 'hm-icon-192-v3.png', tag: d.tag || undefined, data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close(); const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => { for (const c of cs) { if ('focus' in c) return c.focus() } return self.clients.openWindow(url) }));
});
