const fs = require('fs');

fs.readFile('dataanime.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    // Coba parsing JSON untuk memastikan formatnya valid
    JSON.parse(data);
    console.log("JSON is valid!");
  } catch (e) {
    console.error("Invalid JSON format:", e.message);
    // Di sini Anda bisa memanggil fungsi untuk memperbaiki JSON jika diperlukan
  }
});
