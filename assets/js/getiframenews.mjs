import axios from 'axios';
import * as cheerio from 'cheerio'; // Ubah cara impor
import fs from 'fs';
import pLimit from 'p-limit'; // Menggunakan import untuk p-limit

// Fungsi untuk membaca data dari file JSON
function readJsonData(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data || []; // Mengembalikan data jika ada
}

// Fungsi untuk mengambil semua URL dari file JSON
function extractUrlsFromEpisodes(data) {
  const urls = [];
  
  data.forEach(anime => {
    anime.episodes.forEach(episode => {
      if (episode.link) {
        urls.push(episode.link); // Menambahkan link ke array
      }
    });
  });

  return urls;
}

// Fungsi untuk mengekstrak iframe src dan title episode dari halaman
async function scrapeIframeSource(url) {
  try {
    // Mengambil halaman HTML dengan axios
    const response = await axios.get(url);
    const $ = cheerio.load(response.data); // Parsing HTML dengan Cheerio

    // Menemukan semua elemen iframe dan mengambil atribut 'src'
    const iframeSources = [];
    $('iframe').each((index, iframe) => {
      const src = $(iframe).attr('src');
      if (src) {
        iframeSources.push(src); // Menambahkan src ke array
      }
    });

    // Mengambil title episode dari halaman (misalnya, jika judul ada di <h1>, <h2>, atau elemen lain)
    const episodeTitle = $('h1').text().trim() || $('h2').text().trim();

    // Cek hasil
    if (!episodeTitle) {
      console.log(`No title found for ${url}`);
    }

    return {
      url: url,
      title: episodeTitle, // Menyertakan judul episode
      iframeSources: iframeSources // Menyertakan iframe src
    };
  } catch (err) {
    console.error(`Error scraping iframe source for ${url}:`, err);
    return {}; // Mengembalikan objek kosong jika ada error
  }
}

// Fungsi untuk menampilkan progres dan estimasi waktu
function displayProgress(progress, total, startTime) {
  const elapsedTime = (Date.now() - startTime) / 1000; // waktu yang sudah berlalu dalam detik
  const avgTimePerTask = elapsedTime / progress; // rata-rata waktu per tugas
  const remainingTasks = total - progress; // jumlah tugas yang belum selesai
  const estimatedTimeRemaining = avgTimePerTask * remainingTasks; // perkiraan waktu yang tersisa
  const percentComplete = Math.round((progress / total) * 100);

  // Menampilkan progres dan estimasi waktu
  console.clear();
  console.log(`[Progress] ${percentComplete}% - ${progress}/${total} episodes processed`);
  console.log(`[Estimated Time Remaining] ${Math.round(estimatedTimeRemaining)} seconds`);
}

// Fungsi untuk memproses semua URL dan scrape iframe secara paralel
async function scrapeAllIframeSources(urls) {
  const limit = pLimit(5); // Membatasi 5 permintaan concurrent secara bersamaan
  const total = urls.length;
  const tasks = [];
  const startTime = Date.now(); // Waktu mulai

  for (let i = 0; i < total; i++) {
    const url = urls[i];
    tasks.push(
      limit(async () => {
        const episodeData = await scrapeIframeSource(url);
        
        if (episodeData.title) {
          console.log(`Successfully scraped: ${episodeData.title}`); // Log untuk debugging
          return episodeData; // Mengembalikan data jika ada title
        }
        return null;
      })
    );

    // Menampilkan progres setiap 10 tugas
    if (i % 10 === 0 || i === total - 1) {
      displayProgress(i + 1, total, startTime);
    }
  }

  const results = await Promise.all(tasks);
  return results.filter(result => result); // Hanya hasil yang valid
}

// Membaca data episode dari file JSON (episode_results.json)
const episodeData = readJsonData('episode_results.json'); // Ganti dengan path file JSON Anda

// Mengambil semua URL dari episode
const episodeUrls = extractUrlsFromEpisodes(episodeData);

// Menycrape semua iframe sources secara paralel
scrapeAllIframeSources(episodeUrls).then(results => {
  // Menyimpan hasil ke dalam file JSON
  if (results.length > 0) {
    fs.writeFileSync('iframe_sources.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('Hasil iframe sources telah disimpan ke dalam iframe_sources.json');
  } else {
    console.log('Tidak ada hasil yang valid untuk disimpan.');
  }
}).catch(err => {
  console.error('Error during scraping:', err);
});
