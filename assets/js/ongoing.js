document.addEventListener("DOMContentLoaded", function () {
  (function manageOngoingMovies() {
    // Namespace variables
    let currentIndex = 0;
    const moviesPerPage = 4;
    let filteredMovies = [];

    // Mengambil data dari file animeUpdate.json
    fetch('./json/animeUpdate.json')
      .then(response => response.json())
      .then(movies => {
        // Filter data mulai dari ID "trilion-game-sub-indo/" ke bawah
        const startIndex = movies.findIndex(movie => movie.id === "trilion-game-sub-indo/");
        if (startIndex !== -1) {
          filteredMovies = movies.slice(startIndex); // Ambil data mulai dari index tersebut hingga akhir
        }

        // Urutkan data berdasarkan tahun terbaru
        filteredMovies = filteredMovies.sort((a, b) => {
          const dateA = new Date(a.uploaded_on);
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
      const moviesListElement = document.getElementById('ongoing-movies-list');

      // Menentukan batas indeks yang akan ditampilkan
      const moviesToShow = filteredMovies.slice(currentIndex, currentIndex + moviesPerPage);

      // Loop untuk setiap movie dan buat elemen HTML
      moviesToShow.forEach(movie => {
        const movieItem = document.createElement('li');

        movieItem.innerHTML = `
          <div class="movie-card">
            <a href="${movie.link}" data-id="${movie.id}">
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
      const loadMoreBtn = document.getElementById('ongoing-load-more-btn');
      if (currentIndex < filteredMovies.length) {
        loadMoreBtn.style.display = 'inline-block';
      } else {
        loadMoreBtn.style.display = 'none'; // Sembunyikan tombol jika tidak ada lagi yang dapat dimuat
      }
    }

    // Fungsi untuk menangani tombol "Load More"
    document.getElementById('ongoing-load-more-btn').addEventListener('click', loadMovies);

    // Pastikan semua tautan film memiliki atribut data-id
    document.addEventListener("click", function (event) {
      if (event.target.closest(".movie-card a")) {
        const movieId = event.target.closest(".movie-card a").getAttribute("data-id");
        localStorage.setItem("selectedMovieId", movieId);
      }
    });
  })();
});
