const path = require('path');
const fs = require('fs');
const jwtAuth = require('../middlewares/jwt-auth'); // Sesuaikan path dengan struktur proyek Anda

// Fungsi untuk menangani upload file
exports.uploadFile = [
  jwtAuth.verifyToken, // Middleware untuk verifikasi token JWT
  (req, res) => {
    // Pastikan ada file yang diunggah
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('Tidak ada file yang diunggah.');
    }

    // Ambil file yang diunggah
    const file = req.files.file;

    // Tentukan lokasi untuk menyimpan file (misalnya: 'uploads' di dalam direktori proyek)
    const uploadDir = path.join(process.cwd(), 'uploads'); // Gunakan process.cwd() untuk mendapatkan direktori kerja saat ini
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Buat direktori jika tidak ada
    }

    // Tentukan nama file di server (gunakan nama asli file yang diunggah)
    const uploadPath = path.join(uploadDir, file.name);

    // Simpan file ke server
    file.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Konstruksi URL file yang diunggah
      const fileName = file.name.split('.').slice(0, -1).join('.'); // Menghapus ekstensi file
      const fileUrl = `http://localhost:5050/images/${fileName}.jpg`; // Sesuaikan dengan URL server Anda

      res.send(`File berhasil diunggah! URL: ${fileUrl}`);
    });
  }
];
