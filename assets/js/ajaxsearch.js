document.addEventListener("DOMContentLoaded", function () {
  // Elemen pencarian atas
  const searchButtonTop = document.querySelector('.search-btn');
  const searchInputTop = document.getElementById('search-input');
  const searchResultsTop = document.getElementById('search-results');

  // Elemen pencarian bawah
  const searchButtonBottom = document.querySelector('.search-button');
  const searchInputBottom = document.getElementById('anime-search');
  const searchResultsBottom = document.getElementById('search-results1');

  // Fungsi utama untuk mencari anime
  function searchAnime(query, resultsContainer) {
    fetch('json/animeUpdate.json')
      .then(response => response.json())
      .then(animeData => {
        // Filter data berdasarkan query pencarian
        const filteredAnime = animeData.filter(anime =>
          anime.title.toLowerCase().includes(query.toLowerCase())
        );

        // Tampilkan hasil pencarian
        displaySearchResults(filteredAnime, resultsContainer);
      })
      .catch(error => {
        console.error('Error loading the anime data:', error);
        resultsContainer.innerHTML = '<p>Failed to load data.</p>';
      });
  }

  // Fungsi untuk menampilkan hasil pencarian
  function displaySearchResults(animeList, resultsContainer) {
    resultsContainer.innerHTML = ''; // Bersihkan hasil sebelumnya

    if (animeList.length === 0) {
      resultsContainer.innerHTML = '<p>No anime found.</p>';
      return;
    }

    animeList.forEach(anime => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('search-result-item');
      resultItem.innerHTML = `
        <a href="movie-details.html?id=${anime.id}" target="_blank">
          ${anime.title}
        </a>
      `;
      resultsContainer.appendChild(resultItem);
    });
  }

  // Fungsi untuk menambahkan event listener
  function addSearchEventListeners(searchButton, searchInput, resultsContainer) {
    // Event listener untuk tombol pencarian
    searchButton.addEventListener('click', function () {
      const query = searchInput.value.trim();
      if (query) {
        searchAnime(query, resultsContainer);
      }
    });

    // Event listener untuk pencarian langsung saat mengetik
    searchInput.addEventListener('input', function () {
      const query = searchInput.value.trim();
      if (query) {
        searchAnime(query, resultsContainer);
      } else {
        resultsContainer.innerHTML = ''; // Kosongkan hasil jika input kosong
      }
    });
  }

  // Tambahkan event listener untuk pencarian atas
  addSearchEventListeners(searchButtonTop, searchInputTop, searchResultsTop);

  // Tambahkan event listener untuk pencarian bawah
  addSearchEventListeners(searchButtonBottom, searchInputBottom, searchResultsBottom);
});
