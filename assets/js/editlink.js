// Fungsi untuk memperbarui semua link
function updateAllLinks(jsonData, newBaseLink) {
    jsonData.forEach(item => {
        const id = item.id; // Mengambil id untuk membuat link baru
        item.link = `${newBaseLink}${id}`; // Membuat link baru
    });
    return jsonData; // Mengembalikan JSON yang telah diperbarui
}

// Fungsi untuk mengunduh file JSON
function downloadJSON(updatedData, fileName) {
    const dataStr = JSON.stringify(updatedData, null, 2); // Ubah JSON ke string
    const blob = new Blob([dataStr], { type: "application/json" }); // Buat Blob dari data
    const url = URL.createObjectURL(blob); // Buat URL sementara
    const a = document.createElement("a"); // Buat elemen <a>
    a.href = url;
    a.download = fileName; // Nama file untuk diunduh
    a.click(); // Trigger klik untuk mulai mengunduh
    URL.revokeObjectURL(url); // Hapus URL sementara
}

// Mengambil file JSON
fetch('anime.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON dari file
    })
    .then(data => {
        const newBaseLink = "movie-detail.html/"; // Link dasar baru
        const updatedData = updateAllLinks(data, newBaseLink); // Perbarui link

        // Tampilkan hasil di konsol (opsional)
        console.log("JSON setelah update:", updatedData);

        // Unduh file JSON yang telah diperbarui
        downloadJSON(updatedData, "animeUpdate.json");
    })
    .catch(error => console.error("Gagal memuat atau memperbarui JSON:", error));
