document.addEventListener("DOMContentLoaded", function () {
    const moviesPerPage = 20;
    let currentIndex = 0;
    let allMovies = []; // Data lengkap dari animeUpdate.json
    let filteredMovies = []; // Data setelah difilter
    const genreSet = new Set(); // Menyimpan genre unik

    const moviesListElement = document.getElementById('movies-list');
    const filterListElement = document.querySelector('.filter-list');
    const loadMoreButton = document.getElementById('load-more');
    const moreGenreButton = document.getElementById('more-genre'); // Tombol untuk menampilkan genre lebih banyak

    // Fungsi untuk mendapatkan query parameter dari URL
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Ambil data dari kedua file JSON
    Promise.all([
        fetch('json/dataanime.json').then(response => response.json()),
        fetch('json/animeUpdate.json').then(response => response.json())
    ])
        .then(([dataanime, animeUpdate]) => {
            // Ambil daftar judul dari dataanime.json
            const validTitles = dataanime.map(item => item.title);

            // Filter animeUpdate.json berdasarkan validTitles
            animeUpdate = animeUpdate.filter(movie => validTitles.includes(movie.title));

            // Gabungkan genre dari dataanime.json ke animeUpdate.json
            animeUpdate.forEach(movie => {
                const matchedData = dataanime.find(item => item.title === movie.title);

                if (matchedData) {
                    movie.genre = matchedData.genre_list.map(genre => genre.genre_name).join(', ');

                    // Tambahkan genre ke genreSet
                    matchedData.genre_list.forEach(genre => genreSet.add(genre.genre_name));
                }
            });

            allMovies = animeUpdate; // Simpan data gabungan
            filteredMovies = allMovies; // Awalnya tampilkan semua film

            // Buat tombol filter berdasarkan genre
            createFilterButtons(Array.from(genreSet));

            // Cek apakah ada parameter genre di URL
            const genreFromUrl = getQueryParameter('genre');
            if (genreFromUrl) {
                // Jika genre ditemukan di URL, langsung filter
                filterMoviesByGenre(genreFromUrl);
            } else {
                // Jika tidak ada genre di URL, tampilkan semua film
                loadMovies();
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fungsi untuk membuat tombol filter
    function createFilterButtons(genres) {
        // Batasi tampilan genre hanya 4 genre pertama
        const genresToShow = genres.slice(0, 4);

        filterListElement.innerHTML = ''; // Bersihkan filter yang ada

        genresToShow.forEach(genre => {
            const filterButton = document.createElement('button');
            filterButton.classList.add('filter-btn');
            filterButton.textContent = genre;

            // Event listener untuk tombol filter
            filterButton.addEventListener('click', function () {
                filterMoviesByGenre(genre);
            });

            const listItem = document.createElement('li');
            listItem.appendChild(filterButton);
            filterListElement.appendChild(listItem);
        });

        // Jika ada lebih dari 4 genre, tampilkan tombol "More Genre"
        if (genres.length > 4) {
            moreGenreButton.style.display = 'inline-block';
        } else {
            moreGenreButton.style.display = 'none'; // Sembunyikan tombol jika genre tidak lebih dari 4
        }
    }

    // Fungsi untuk menampilkan semua genre
    function displayAllGenres(genres) {
        filterListElement.innerHTML = ''; // Bersihkan daftar genre yang ada
        genres.forEach(genre => {
            const filterButton = document.createElement('button');
            filterButton.classList.add('filter-btn');
            filterButton.textContent = genre;

            // Event listener untuk tombol filter
            filterButton.addEventListener('click', function () {
                filterMoviesByGenre(genre);
            });

            const listItem = document.createElement('li');
            listItem.appendChild(filterButton);
            filterListElement.appendChild(listItem);
        });

        // Sembunyikan tombol More Genre setelah genre dipilih
        moreGenreButton.style.display = 'none';
    }

    // Fungsi untuk memfilter film berdasarkan genre
    function filterMoviesByGenre(genre) {
        currentIndex = 0; // Reset indeks
        filteredMovies = allMovies.filter(movie => movie.genre && movie.genre.includes(genre));
        moviesListElement.innerHTML = ''; // Hapus daftar film yang ada
        loadMovies(); // Muat film yang sesuai filter

        // Perbarui daftar genre dan tampilkan tombol "More Genre" jika diperlukan
        createFilterButtons(Array.from(genreSet).slice(0, 4));
        if (genreSet.size > 4) {
            moreGenreButton.style.display = 'inline-block';
        }
    }

    // Fungsi untuk memuat film ke halaman
    function loadMovies() {
        const moviesToShow = filteredMovies.slice(currentIndex, currentIndex + moviesPerPage);

        moviesToShow.forEach(movie => {
            const movieItem = document.createElement('li');

            movieItem.innerHTML = `
                <div class="movie-card">
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

            moviesListElement.appendChild(movieItem);
        });

        currentIndex += moviesPerPage;

        if (currentIndex < filteredMovies.length) {
            loadMoreButton.style.display = 'inline-block';
        } else {
            loadMoreButton.style.display = 'none';
        }
    }

    // Event listener untuk tombol "Load More"
    loadMoreButton.addEventListener('click', loadMovies);

    // Event listener untuk tombol "More Genre"
    moreGenreButton.addEventListener('click', function () {
        // Menampilkan semua genre jika tombol More Genre diklik
        displayAllGenres(Array.from(genreSet));
        // Tombol More Genre tidak akan muncul setelah klik
        moreGenreButton.style.display = 'none';
    });
});
