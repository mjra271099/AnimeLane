import json

def count_top_level_objects(data):
    """Menghitung objek di level pertama dari data JSON."""
    if isinstance(data, dict):
        return len(data)  # Menghitung jumlah key dalam dictionary
    elif isinstance(data, list):
        return len(data)  # Menghitung jumlah elemen dalam list
    else:
        return 0  # Tidak ada objek jika bukan dict atau list

# Membaca file JSON dan menangani beberapa objek JSON
total_objects = 0

# Menangani error encoding saat mencetak ke terminal
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('dataanime.json', 'r', encoding='utf-8') as file:
    try:
        # Menggunakan json.load untuk membaca file JSON jika hanya ada satu objek JSON
        data = json.load(file)
        total_objects += count_top_level_objects(data)

    except json.decoder.JSONDecodeError:
        # Jika file mengandung lebih dari satu objek JSON, baca baris per baris
        file.seek(0)  # Reset posisi pembacaan file ke awal
        for line in file:
            try:
                data = json.loads(line.strip())  # Menghapus spasi atau newline sebelum parsing
                total_objects += count_top_level_objects(data)
            except json.JSONDecodeError:
                print("Gagal mem-parsing baris:", line)

print(f"Jumlah objek di level pertama: {total_objects}")
