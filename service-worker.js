const CACHE_NAME = 'rubi-frota-v1';
const ASSETS = [
    './index.html',
    './manifest.json'
];

// Instalação: Guarda os ficheiros básicos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Intercetação: Permite abrir a app mesmo se a internet falhar momentaneamente
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
