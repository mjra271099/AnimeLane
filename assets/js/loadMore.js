document.addEventListener("DOMContentLoaded", function () {
    // Menyimpan data dari semua elemen film di HTML
    const allMovies = [...document.querySelectorAll('.movie-card')];
    const moviesPerPage = 20; // Jumlah film per halaman
    let currentIndex = 0; // Indeks awal

    // Sembunyikan semua elemen film terlebih dahulu
    allMovies.forEach(movie => movie.style.display = 'none');

    // Fungsi untuk memuat film
    function loadMovies() {
        // Menampilkan sejumlah film sesuai moviesPerPage
        const moviesToShow = allMovies.slice(currentIndex, currentIndex + moviesPerPage);
        moviesToShow.forEach(movie => movie.style.display = 'block');

        // Perbarui indeks untuk batch berikutnya
        currentIndex += moviesPerPage;

        // Sembunyikan tombol jika semua film telah ditampilkan
        if (currentIndex >= allMovies.length) {
            document.getElementById('load-more').style.display = 'none';
        }
    }

    // Muat batch pertama
    loadMovies();

    // Tambahkan event listener untuk tombol "Load More"
    document.getElementById('load-more').addEventListener('click', loadMovies);
});
