document.addEventListener("DOMContentLoaded", function () {
  // Menyimpan data movie yang telah dimuat
  let currentIndex = 0;
  const moviesPerPage = 4;
  let allMovies = [];

  // Mengambil data dari file anime.json
  fetch('./json/animeUpdate.json')
    .then(response => response.json()) // Parse JSON dari file anime.json
    .then(movies => {
      // Urutkan data berdasarkan tahun terbaru
      allMovies = movies.sort((a, b) => {
        const dateA = new Date(a.uploaded_on); // Konversi ke objek Date
        const dateB = new Date(b.uploaded_on);
        return dateB - dateA; // Urutkan dari yang terbaru ke yang terlama
      });

      loadMovies(); // Tampilkan film pertama
    })
    .catch(error => {
      console.error('Error fetching movie data:', error);
    });

  // Fungsi untuk memuat film pada setiap pemanggilan
  function loadMovies() {
    const moviesListElement = document.getElementById('movies-list');

    // Menentukan batas indeks yang akan ditampilkan
    const moviesToShow = allMovies.slice(currentIndex, currentIndex + moviesPerPage);

    // Loop untuk setiap movie dan buat elemen HTML
    moviesToShow.forEach(movie => {
      const movieItem = document.createElement('li');

      movieItem.innerHTML = `
          <div class="movie-card">
          <a href="movie-details.html" data-id="">
          
          

            <a href="${movie.link}">
              <figure class="card-banner">
                <img src="${movie.thumb}" alt="${movie.title} movie poster">
              </figure>
            </a>

            <div class="title-wrapper">
              <a href="${movie.link}">
                <h3 class="card-title">${movie.title}</h3>
              </a>
              <time datetime="${movie.uploaded_on}">${movie.uploaded_on}</time>
            </div>

            <div class="card-meta">
              <div class="episode">${movie.episode}</div>
              <div class="rating">
                <ion-icon name="star"></ion-icon>
                <data value="${movie.score}">${movie.score}</data>
              </div>
            </div>
          </div>
        `;

      // Menambahkan elemen movie ke dalam list
      moviesListElement.appendChild(movieItem);
    });

    // Update currentIndex untuk pemuatan berikutnya
    currentIndex += moviesPerPage;

    // Jika ada lebih banyak movie yang bisa dimuat, tampilkan tombol "Load More"
    if (currentIndex < allMovies.length) {
      document.getElementById('load-more').style.display = 'inline-block';
    } else {
      document.getElementById('load-more').style.display = 'none'; // Sembunyikan tombol jika tidak ada lagi yang dapat dimuat
    }
  }

  // Fungsi untuk menangani tombol "Load More"
  document.getElementById('load-more').addEventListener('click', loadMovies);

  // Pastikan semua tautan film memiliki atribut data-id
  document.querySelectorAll(".movie-card a").forEach((link) => {
    link.addEventListener("click", function (event) {
      const movieId = this.getAttribute("data-id");
      localStorage.setItem("selectedMovieId", movieId);
    });
  });
});

