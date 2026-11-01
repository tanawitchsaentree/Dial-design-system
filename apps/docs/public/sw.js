// The book's service worker (G-PWA1): the book installs as an app and reads offline. Hand-written, no
// library. The app shell and its hashed assets are cached at install; every route is the same SPA
// shell, so a page opened offline gets the cached index.html and renders from the cached chunks.
// Hashed files under /assets/ never change, so they are served from the cache first; everything else
// (the shell, the gates/evidence JSON) goes to the network first and falls back to the cache.
const CACHE = 'dial-book-v1';
const SHELL = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const res = await fetch(SHELL, { cache: 'no-cache' });
    const html = await res.clone().text();
    await cache.put(SHELL, res);
    const assets = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((m) => m[1]).filter((u) => !u.startsWith('//'));
    await Promise.all(assets.map((u) => cache.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok) (await caches.open(CACHE)).put(SHELL, res.clone());
        return res;
      } catch {
        return (await caches.match(SHELL)) ?? Response.error();
      }
    })());
    return;
  }
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
      return res;
    })());
    return;
  }
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
      return res;
    } catch {
      return (await caches.match(req)) ?? Response.error();
    }
  })());
});
