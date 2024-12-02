// document.addEventListener("DOMContentLoaded", function () {
//     const preloader = document.getElementById("preloader");
//     if (preloader) {
//         setTimeout(() => {
//             preloader.style.opacity = 0; // Tambahkan transisi
//             setTimeout(() => {
//                 preloader.style.display = "none"; // Hilangkan dari DOM
//             }, 500); // Waktu transisi sesuai animasi CSS
//         }, 500); // Waktu jeda sebelum menyembunyikan
//     }
// });
window.addEventListener('load', () => {
    // Setelah seluruh halaman selesai dimuat, sembunyikan preloader
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('content');

    // Menghilangkan preloader
    preloader.style.display = 'none';

    // Menampilkan konten halaman
    // content.style.opacity = 1;
});

// Jika Anda ingin menunggu sampai gambar atau elemen lain selesai dimuat:
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;

    images.forEach(image => {
        image.addEventListener('load', () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                // Semua gambar telah dimuat, sembunyikan preloader
                document.getElementById('preloader').style.display = 'none';
                document.getElementById('content').style.opacity = 1;
            }
        });
    });

    // Jika tidak ada gambar, langsung sembunyikan preloader
    if (images.length === 0) {
        document.getElementById('preloader').style.display = 'none';
        document.getElementById('content').style.opacity = 1;
    }
});
