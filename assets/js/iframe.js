// Mengambil parameter 'title' dari URL
const params = new URLSearchParams(window.location.search);
const episodeTitle = params.get('title'); // Mengambil parameter 'title'

// Jika parameter 'title' ada
if (episodeTitle) {
    // Menampilkan judul episode yang dipilih
    const titleContainer = document.getElementById('title-container');
    titleContainer.textContent = `Now Playing: ${episodeTitle}`;

    // Mengambil data iframe_sources.json untuk mendapatkan link iframe berdasarkan judul
    fetch('json/iframe_sources.json')
        .then(response => response.json())
        .then(iframeData => {
            // Mencari episode yang sesuai dengan judul
            const iframeEpisode = iframeData.find(iframe => iframe.title === episodeTitle);

            if (iframeEpisode) {
                // Membuat elemen iframe untuk menampilkan konten
                const iframe = document.createElement('iframe');
                iframe.src = iframeEpisode.iframeSources[0];  // Mengambil sumber iframe pertama
                iframe.width = '100%';                       // Lebar iframe
                iframe.height = '500px';                     // Tinggi iframe
                iframe.frameBorder = '0';                    // Menghapus border
                iframe.allowFullscreen = true;               // Mendukung layar penuh

                // Menampilkan iframe di dalam kontainer
                const iframeContainer = document.getElementById('iframe-container');
                iframeContainer.appendChild(iframe);
            } else {
                console.error('Episode iframe link tidak ditemukan untuk title:', episodeTitle);
            }
        })
        .catch(error => console.error('Error loading the iframe data:', error));
} else {
    console.error('Parameter "title" tidak ditemukan di URL.');
}
