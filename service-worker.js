const CACHE_NAME = 'rubi-frota-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// 1. Instalação: Guarda os ficheiros básicos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Ficheiros em cache guardados com sucesso!');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Ativação: Limpa caches antigos se atualizar a versão (ex: v2)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cache antigo removido:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Interceção: Tenta ir à net (para ter a versão mais recente), se falhar, abre o que está no cache
self.addEventListener('fetch', (event) => {
    // Ignora os pedidos à API do Google Sheets (não queremos fazer cache da base de dados, só da interface)
    if (event.request.url.includes('script.google.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((response) => {
                return response || caches.match('./index.html');
            });
        })
    );
});
