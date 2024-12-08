fetch('json/animeUpdate.json')
  .then(response => response.json())
  .then(animeData => {
    // Mengelompokkan anime berdasarkan huruf pertama dari judul
    const groupedAnime = {};

    // Kelompokkan anime berdasarkan huruf pertama
    animeData.forEach(anime => {
      const firstChar = anime.title.trim().toLowerCase().charAt(0).toUpperCase(); // Mengambil huruf pertama dan ubah ke huruf kapital
      if (!groupedAnime[firstChar]) {
        groupedAnime[firstChar] = [];
      }
      groupedAnime[firstChar].push(anime);
    });

    // Menampilkan anime yang telah dikelompokkan berdasarkan abjad
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = ''; // Clear any previous content

    // Membuat kontainer untuk dua kolom
    const twoColumnContainer = document.createElement('div');
    twoColumnContainer.classList.add('two-column-container'); // Menambahkan kelas untuk styling dua kolom

    // Loop untuk setiap kategori huruf
    Object.keys(groupedAnime).sort().forEach(letter => {
      // Menambahkan kategori (A, B, C, dst.)
      const categoryContainer = document.createElement('div');  // Kontainer untuk setiap huruf
      categoryContainer.classList.add('category-container');    // Kelas khusus untuk kategori

      const categoryHeader = document.createElement('h3');
      categoryHeader.textContent = letter; // Menampilkan kategori huruf
      categoryContainer.appendChild(categoryHeader);

      // Menambahkan list anime untuk kategori tersebut
      const animeList = document.createElement('ul');
      animeList.classList.add('anime-list'); // Menambahkan kelas untuk styling list anime

      groupedAnime[letter].forEach(anime => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="movie-details.html?id=${anime.id}">${anime.title}</a>`;
        animeList.appendChild(listItem);
      });

      // Menambahkan daftar anime ke dalam kategori
      categoryContainer.appendChild(animeList);

      // Menambahkan kategori ke dalam kontainer dua kolom
      twoColumnContainer.appendChild(categoryContainer);
    });

    // Menambahkan kontainer dua kolom ke movieContainer
    movieContainer.appendChild(twoColumnContainer);
  })
  .catch(error => {
    console.error('Error loading the anime data:', error);
  });
