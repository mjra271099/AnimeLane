import requests
import json
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_session():
    """Membuat sesi requests dengan retry."""
    session = requests.Session()
    retry = Retry(
        total=5,  # Coba hingga 5 kali jika gagal
        backoff_factor=1,  # Jeda meningkat untuk setiap percobaan
        status_forcelist=[500, 502, 503, 504],  # Mencoba ulang untuk status error server
        allowed_methods=["GET", "POST"]  # Terapkan retry hanya untuk metode GET dan POST
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

def load_anime_ids(input_file):
    """Membaca file anime.json dan mengambil semua ID anime."""
    try:
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return [anime['id'] for anime in data]  # Mengambil semua 'id' anime
    except Exception as e:
        print(f"Error while loading {input_file}: {e}")
        return []

def scrape_anime_data(anime_id, session, output_file):
    """Scrape data untuk setiap anime berdasarkan id dan simpan hasilnya secara real-time."""
    url = f"http://localhost:3000/api/anime/{anime_id}"
    print(f"Fetching data for anime ID: {anime_id} from {url}...")

    try:
        response = session.get(url)
        if response.status_code == 200:
            data = response.json()

            # Ambil hanya objek pertama dari array jika ada lebih dari satu objek
            if isinstance(data, list) and len(data) > 0:
                data = data[0]

            # Simpan data secara real-time
            with open(output_file, 'a', encoding='utf-8') as file:
                # Menambahkan koma jika file tidak kosong
                if file.tell() > 0:
                    file.write(",\n")  # Menambahkan koma sebelum objek jika file tidak kosong
                json.dump(data, file, ensure_ascii=False, indent=4)

            print(f"Data for anime ID {anime_id} saved successfully.")
        else:
            print(f"Error fetching data for anime ID {anime_id}, Status Code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred while fetching data for anime ID {anime_id}: {e}")

def scrape_all_animes(input_file, output_file):
    """Menyaring semua anime ID dari file input, dan mengirim permintaan API untuk setiap ID secara paralel."""
    anime_ids = load_anime_ids(input_file)
    if not anime_ids:
        print("No anime IDs found to scrape.")
        return

    total_ids = len(anime_ids)
    print(f"Total anime IDs to scrape: {total_ids}")

    # Membuat session untuk setiap permintaan
    session = create_session()

    # Inisialisasi file output dengan array pembungkus
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write("[\n")  # Menambahkan tanda buka array pada awal file

    # Menyaring data per ID dengan multithreading
    with ThreadPoolExecutor(max_workers=10) as executor:  # Anda bisa mengatur max_workers sesuai dengan kapasitas server
        futures = {executor.submit(scrape_anime_data, anime_id, session, output_file): anime_id for anime_id in anime_ids}

        for future in as_completed(futures):
            anime_id = futures[future]
            try:
                future.result()  # Tunggu hingga scraping selesai untuk ID ini
            except Exception as e:
                print(f"An error occurred for anime ID {anime_id}: {e}")

            # Update progress secara real-time
            completed = sum(1 for future in futures if future.done())
            progress_percentage = (completed / total_ids) * 100
            print(f"Progress: {progress_percentage:.2f}% ({completed}/{total_ids})", end='\r')
            sys.stdout.flush()  # Memaksa untuk langsung menulis ke terminal

    # Setelah semua data disimpan, menutup array dengan tanda tutup
    with open(output_file, 'a', encoding='utf-8') as file:
        file.write("\n]")  # Menambahkan tanda tutup array pada akhir file

# Path ke file input dan output
input_file = "anime.json"  # Nama file yang berisi daftar anime
output_file = "dataanime.json"  # Nama file untuk menyimpan data hasil scrape

# Jalankan scraping
scrape_all_animes(input_file, output_file)
