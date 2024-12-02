document.addEventListener("DOMContentLoaded", function () {
    // Ambil parameter query id dari URL
    const urlParams = new URLSearchParams(window.location.search);
    let movieId = urlParams.get('id');

    if (!movieId) {
        console.error("No movie ID found!");
        return;
    }

    // Menghapus karakter '/' di akhir id, jika ada
    movieId = movieId.replace(/\/$/, '');  // Menggunakan regex untuk menghapus '/' di akhir string

    // Ambil data JSON
    fetch("json/dataanime.json")  // Pastikan path file JSON benar
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Temukan data film berdasarkan anime_id
            const movie = data.find((item) => item.anime_id === movieId);

            if (!movie) {
                console.error("Movie not found!");
                return;
            }

            // Isi konten detail film
            document.querySelector(".movie-detail-banner img").src = movie.thumb || 'default-image.jpg';  // Gunakan gambar default jika tidak ada
            document.querySelector(".movie-detail-banner img").alt = `${movie.title} movie poster`;
            document.querySelector(".detail-title").innerHTML = movie.title;
            document.querySelector(".storyline").textContent = movie.synopsis || 'No synopsis available';
            // document.querySelector(".download-btn a").href = movie.batch_link && movie.batch_link.link ? movie.batch_link.link : '#'; // Tautan jika tersedia

            // Update meta information - Lengkapi dengan semua informasi yang ada di JSON
            const metaWrapper = document.querySelector(".meta-wrapper .date-time");
            metaWrapper.innerHTML = `
                <div>
                    <ion-icon name="calendar-outline"></ion-icon>
                    <time datetime="${movie.release_date || ''}">${movie.release_date || 'Unknown'}</time>
                </div>
                <div>
                    <ion-icon name="time-outline"></ion-icon>
                    <time datetime="PT${movie.duration || ''}">${movie.duration || 'Unknown'}</time>
                </div>
                <div>
                    <ion-icon name="star-outline"></ion-icon>
                    <span>Rating: ${movie.score || 'N/A'}</span>
                </div>
                <div>
                    <ion-icon name="school-outline"></ion-icon>
                    <span>Studio: ${movie.studio || 'Unknown'}</span>
                </div>
                <div>
                    <ion-icon name="game-controller-outline"></ion-icon>
                    <span>Type: ${movie.type || 'Unknown'}</span>
                </div>
                <div>
                    <ion-icon name="film-outline"></ion-icon>
                    <span>Episodes: ${movie.total_episode || 'Unknown'}</span>
                </div>
            `;

            // Genre wrapper
            const genreWrapper = document.querySelector(".ganre-wrapper");
            if (movie.genre_list && movie.genre_list.length > 0) {
                genreWrapper.innerHTML = movie.genre_list.map(genre =>
                    `<a href="movie.html?genre=${encodeURIComponent(genre.genre_name)}">${genre.genre_name}</a>`
                ).join(', ');
            } else {
                genreWrapper.innerHTML = 'No genres available';
            }


            // Episode list wrapper (Jika ada episode list)
            const episodeWrapper = document.querySelector(".episode-list");
            if (movie.episode_list && movie.episode_list.length > 0) {
                episodeWrapper.innerHTML = movie.episode_list.map(episode =>
                    `<li><a href="javascript:void(0)" data-episode-url="${episode.link}" data-title="${episode.title}">${episode.title}</a> - <time>${episode.uploaded_on}</time></li>`
                ).join('');
            } else {
                episodeWrapper.innerHTML = '<li>No episodes available</li>';
            }

        })
        .catch((error) => console.error("Failed to fetch movie data:", error));
});
