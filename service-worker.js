const CACHE_NAME = 'futsal-total-v1';

// Lista de archivos principales que la app descargará y guardará 
// en el teléfono para que funcionen sin cobertura.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icono.jpg',
  '/Futsal_Pizarra.html',
  '/Futsal_Estadisticas.html'
];

// 1. Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta correctamente');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. Activación y limpieza de versiones antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Interceptar las peticiones: si no hay internet, carga lo guardado en el móvil
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en la memoria del teléfono, lo devuelve. Si no, intenta buscarlo en internet.
        return response || fetch(event.request);
      }).catch(() => {
        // Opcional: Aquí podrías mostrar una página de aviso si falla la red y no está en caché
      })
  );
});