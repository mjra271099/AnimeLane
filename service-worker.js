// Menangani pemasangan dan pembaruan service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache-v1').then((cache) => {
            const filesToCache = [
                '/',  // Halaman utama
                '/index.html',
                '/movie.html',
                '/movie-details.html',
                '/index-anime.html',
                '/iframe.html',
                '/404.html',
                
                // File CSS di subfolder
                '/assets/css/style.css',
                '/assets/css/ajaxcss.css',
                '/assets/css/indexanime.css',
                '/assets/css/marque.css',
                '/assets/css/othercss.css',
                '/assets/css/preloader.css',
                '/assets/css/style-index.css',
                '/assets/css/style-movie.css',
                '/assets/css/iframe.css',

                // File JavaScript di folder 'assets/js'
                '/assets/js/ajaxsearch.js',
                '/assets/js/editlink.js',
                '/assets/js/episode.js',
                '/assets/js/genremovie.js',
                '/assets/js/getepisode.js',
                '/assets/js/iframe.js',
                '/assets/js/indexanime.js',
                '/assets/js/movie-details.js',
                '/assets/js/movie.js',
                '/assets/js/preloader.js',
                '/assets/js/script.js',
                '/assets/js/top-rated.js',
                '/assets/js/uncoming.js',

                // Gambar
                '/assets/images/hero-bgker.jpg',
            ];
            
            return cache.addAll(filesToCache).then(() => {
                console.log('Files cached successfully!');
            });
        })
    );
});

// Menangani permintaan dan memberikan file dari cache atau server
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                // Jika ada di cache, ambil dari cache
                return response;
            }
            // Jika tidak ada, ambil dari server dan cache hasilnya
            return fetch(event.request).then((networkResponse) => {
                // Pastikan hanya cache hasil permintaan yang sukses
                if (networkResponse.ok) {
                    return caches.open('my-cache-v1').then((cache) => {
                        cache.put(event.request, networkResponse.clone()); // Simpan hasil ke cache
                        return networkResponse;
                    });
                }
                return networkResponse;
            });
        })
    );
});

// Menghapus cache lama (versi sebelumnya) dan mengelola versi cache
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['my-cache-v1'];  // Cache versi yang ingin dipertahankan
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);  // Hapus cache lama yang tidak ada dalam whitelist
                    }
                })
            );
        })
    );
});

// Mengatasi cache busting untuk file JSON agar selalu mendapatkan file terbaru
self.addEventListener('fetch', (event) => {
    // Cek jika URL yang diminta adalah file JSON
    if (event.request.url.includes('/dataanime.json') || event.request.url.includes('/animeUpdate.json')) {
        const timestamp = new Date().getTime();
        const urlWithCacheBusting = `${event.request.url}?timestamp=${timestamp}`;

        // Mengambil file JSON dengan query parameter yang unik untuk cache busting
        event.respondWith(
            fetch(urlWithCacheBusting).then((networkResponse) => {
                return caches.open('my-cache-v1').then((cache) => {
                    cache.put(urlWithCacheBusting, networkResponse.clone()); // Simpan ke cache
                    return networkResponse;
                });
            }).catch((error) => {
                console.error('Error fetching JSON with cache busting:', error);
            })
        );
    }
});
