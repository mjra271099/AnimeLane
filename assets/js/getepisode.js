const fs = require('fs');

// Fungsi untuk membaca data dari file JSON yang berisi daftar anime
function readJsonData(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8')); // Membaca file JSON
  return data || []; // Mengembalikan data yang ada
}

// Fungsi untuk menyimpan hasil ke file JSON
function saveResultsToJson(results, outputFilePath) {
  fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2), 'utf8'); // Menyimpan hasil sebagai file JSON
}

// Fungsi untuk mengambil iframe atau data terkait dari episode
async function fetchEpisodeData(episode) {
  const url = episode.link;  // Menggunakan link episode untuk diambil datanya
  const result = {};  // Menyimpan hasil dari episode ini

  try {
    // Di sini Anda bisa menggunakan metode 'get' untuk mendapatkan iframe atau data lainnya jika diperlukan
    // Misalnya, jika 'get' adalah fungsi scraping untuk mendapatkan data dari URL:
    // const result = await get(url); 
    
    result.title = episode.title || 'No title found';
    result.link = episode.link;
    result.uploaded_on = episode.uploaded_on;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err);
  }

  return result;
}

// Fungsi untuk mengambil data semua episode dari semua anime
async function fetchAllEpisodes(animeData) {
  const results = [];
  const totalAnimes = animeData.length;

  // Menyimpan waktu mulai di luar loop utama
  const startTime = Date.now();  // Inisialisasi startTime di sini

  for (let i = 0; i < totalAnimes; i++) {
    const anime = animeData[i];
    const episodeData = [];

    console.log(`Processing anime: ${anime.title} (${i + 1}/${totalAnimes})`);

    // Proses semua episode untuk anime ini
    for (let j = 0; j < anime.episode_list.length; j++) {
      const episode = anime.episode_list[j];
      const result = await fetchEpisodeData(episode);
      episodeData.push(result);
    }

    results.push({
      animeTitle: anime.title,
      episodes: episodeData,
    });

    const elapsedTime = (Date.now() - startTime);
    console.log(`Processed ${anime.title} - ${episodeData.length} episodes`);
  }

  return results;
}

// Membaca data anime dari file JSON
const animeData = readJsonData('dataanime.json'); // Pastikan file JSON sesuai

// Mengambil data episode dari semua anime dan simpan hasilnya ke dalam file JSON
fetchAllEpisodes(animeData).then(results => {
  saveResultsToJson(results, 'episode_results.json'); // Menyimpan hasil ke dalam file JSON
  console.log("Hasil telah disimpan ke dalam episode_results.json");
}).catch(err => {
  console.error(err);
});
