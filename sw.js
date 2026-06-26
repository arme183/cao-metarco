const CACHE_NAME = 'cao-metarco-v2';
const ASSETS = [
  '/cao-metarco/supervisor.html',
  '/cao-metarco/LOGO_METARCO1.png',
  '/cao-metarco/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Excluir Azure Table Storage y cualquier API externa — nunca cachear
  if (url.includes('table.core.windows.net') ||
      url.includes('login.microsoftonline.com') ||
      url.includes('graph.microsoft.com') ||
      url.includes('msauth.net')) {
    return; // dejar pasar sin interceptar
  }

  // Para assets propios: red primero, caché como fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
