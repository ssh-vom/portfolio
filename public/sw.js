const CACHE_NAME = 'resume-cache-v1';
const RESUME_URL = 'https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/preview';
const PDF_URL = 'https://drive.google.com/uc?export=download&id=1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  if (url.includes('drive.google.com') && (url.includes('/preview') || url.includes('export=download'))) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(e.request);
        if (cached) return cached;

        try {
          const response = await fetch(e.request);
          if (response.ok) {
            cache.put(e.request, response.clone());
          }
          return response;
        } catch (err) {
          return cached || Response.error();
        }
      })
    );
  }
});
