document.addEventListener("DOMContentLoaded", function () {
  // Mengambil parameter id dari URL
  const urlParams = new URLSearchParams(window.location.search);
  let animeId = urlParams.get('id');  // Mengambil nilai id dari query parameter

  console.log('Anime ID dari URL:', animeId);  // Debug: Menampilkan animeId yang diambil dari URL

  if (!animeId) {
    console.error("Anime ID tidak ditemukan di URL.");
    return;
  }

  // Menghapus karakter '/' di akhir id, jika ada
  animeId = animeId.replace(/\/$/, '');  // Menggunakan regex untuk menghapus '/' di akhir string

  console.log('Anime ID setelah pemrosesan:', animeId);  // Debug: Menampilkan animeId setelah pemrosesan

  // Mengambil file JSON yang berisi daftar anime
  fetch('json/dataanime.json')
    .then(response => response.json())  // Mengonversi response menjadi objek JSON
    .then(animeData => {
      console.log('Data anime yang dimuat:', animeData);  // Debug: Menampilkan data yang dimuat dari JSON

      // Mencari anime berdasarkan anime_id yang diambil dari URL
      const selectedAnime = animeData.find(anime => anime.anime_id === animeId);

      console.log('Anime yang ditemukan:', selectedAnime);  // Debug: Menampilkan anime yang ditemukan

      if (selectedAnime) {
        // Memanggil fungsi untuk menampilkan episode berdasarkan anime yang dipilih
        displayEpisodes(selectedAnime);
      } else {
        console.error("Anime tidak ditemukan.");
      }
    })
    .catch(error => {
      console.error('Error loading the anime data:', error);
    });

  // Fungsi untuk menampilkan episode ke dalam halaman
  function displayEpisodes(anime) {
    const episodeListContainer = document.querySelector('.episode-items');

    // Periksa apakah ada container episode
    if (!episodeListContainer) {
      console.error("Container episode-items tidak ditemukan.");
      return;
    }

    // Mengakses array episode_list dari anime yang dipilih dan membuat elemen untuk setiap episode
    anime.episode_list.forEach(episode => {
      // Membuat elemen <li> untuk setiap episode
      const listItem = document.createElement('li');

      // Membuat elemen <a> untuk link episode
      const episodeLink = document.createElement('a');
      episodeLink.textContent = `${episode.title}`; // Menampilkan judul episode
      episodeLink.href = `iframe.html?title=${encodeURIComponent(episode.title)}`; // Mengatur href ke iframe.html dengan query parameter
      episodeLink.target = '_blank'; // Membuka link di tab baru

      // Menambahkan event listener untuk menampilkan iframe ketika link diklik (opsional, jika ingin melakukan sesuatu sebelum membuka link)
      episodeLink.addEventListener('click', function (event) {
        console.log(`Membuka iframe untuk episode: ${episode.title}`);
      });

      // Menambahkan elemen <a> ke dalam <li>
      listItem.appendChild(episodeLink);

      // Menambahkan <li> ke dalam <ul> di halaman
      episodeListContainer.appendChild(listItem);
    });
  };
});

