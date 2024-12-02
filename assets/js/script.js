'use strict';

/**
 * navbar variables
 */

const navOpenBtn = document.querySelector("[data-menu-open-btn]");
const navCloseBtn = document.querySelector("[data-menu-close-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");
  });
}

/**
 * header sticky
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");
});

/**
 * go top
 */

const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");
});

// Fungsi untuk menulis cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Menentukan waktu kedaluwarsa cookie
  let expires = "expires=" + d.toUTCString(); // Format waktu kedaluwarsa
  document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Menyimpan cookie di browser
}

// Fungsi untuk membaca cookie
function getCookie(name) {
  const nameEq = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length, c.length);
  }
  return "";
}

// Fungsi untuk menghapus cookie
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// Contoh penggunaan
setCookie("user", "JohnDoe", 7);  // Menyimpan cookie selama 7 hari
console.log(getCookie("user"));    // Membaca cookie 'user'
deleteCookie("user");             // Menghapus cookie 'user'

// Fungsi untuk menambahkan file ke cache
function cacheFiles() {
  if ('caches' in window) {
    caches.open('my-cache-v1').then(function (cache) {
      cache.addAll([
        // File di root folder
        '/index.html',          // File utama di root folder
        '/movie.html',
        '/movie-details.html',
        '/index-anime.html',
        '/iframe.html',
        '/404.html',

        // File di subfolder
        '/assets/css/style.css',  // File CSS di folder 'assets/css'
        '/assets/css/ajaxcss.css',  // File CSS di folder 'assets/css'
        '/assets/css/indexanime.css',  // File CSS di folder 'assets/css'
        '/assets/css/marque.css',  // File CSS di folder 'assets/css'
        '/assets/css/othercss.css',  // File CSS di folder 'assets/css'
        '/assets/css/preloader.css',  // File CSS di folder 'assets/css'
        '/assets/css/style-index.css',  // File CSS di folder 'assets/css'
        '/assets/css/style-movie.css',  // File CSS di folder 'assets/css'
        '/assets/css/iframe.css',  // File CSS di folder 'assets/css'

        '/assets/js/ajaxsearch.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/editlink.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/episode.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/genremovie.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/getepisode.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/iframe.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/indexanime.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/movie-details.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/movie.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/preloader.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/script.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/top-rated.js',    // File JavaScript di folder 'assets/js'
        '/assets/js/uncoming.js',    // File JavaScript di folder 'assets/js'

        '/assets/images/hero-bgker.jpg', // Gambar di folder 'assets/images'

        // Jika ada file lain, tambahkan di sini
      ]).then(() => {
        console.log('Files cached successfully!');
      }).catch(err => {
        console.log('Error caching files: ', err);
      });
    });
  }
}

// Fungsi untuk mengambil file dari cache
function fetchFromCache(event) {
  if ('caches' in window) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;  // Mengambil dari cache jika ada
        }
        return fetch(event.request);  // Jika tidak ada, ambil dari server
      })
    );
  }
}

// Menambahkan event listener untuk service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
    console.log('Service Worker registered with scope: ', registration.scope);
  }).catch(function (error) {
    console.log('Service Worker registration failed: ', error);
  });
}

// Menangani event beforeinstallprompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Mencegah prompt default
  e.preventDefault();
  deferredPrompt = e;

  // Menampilkan tombol install ke pengguna
  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});
