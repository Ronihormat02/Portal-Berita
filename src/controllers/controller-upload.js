const path = require('path');
const fs = require('fs');
const jwtAuth = require('../middlewares/jwt-auth'); // Sesuaikan path dengan struktur proyek Anda

// Fungsi untuk menangani upload file
exports.uploadFile = (req, res) => {
    if (req.method === 'GET') {
        // Lakukan logika untuk mendapatkan daftar file
        const uploadDir = path.join(process.cwd(), 'uploads');
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(files);
        });
    } else if (req.method === 'POST') {
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
    } else if (req.method === 'PUT') {
        jwtAuth.verifyToken(req, res, () => {
            // Lakukan logika untuk mengupdate file
            const fileName = req.params.fileName;
            const filePath = path.join(process.cwd(), 'uploads', fileName);
        
            // Pastikan ada file yang diunggah
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('Tidak ada file yang diunggah.');
            }
        
            // Ambil file yang diunggah
            const file = req.files.file;
        
            // Simpan file ke server dengan nama file yang sama
            file.mv(filePath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
        
                // Konstruksi URL file yang diunggah
                const fileName = file.name.split('.').slice(0, -1).join('.'); // Menghapus ekstensi file
                const fileUrl = `http://localhost:5050/images/${fileName}.jpg`; // Sesuaikan dengan URL server Anda
        
                res.send(`File berhasil diperbarui! URL: ${fileUrl}`);
            });
        });
    } else if (req.method === 'DELETE') {
        jwtAuth.verifyToken(req, res, () => {
          const fileName = req.params.fileName;
        
          // Tentukan path lengkap file yang akan dihapus
          const filePath = path.join(uploadDir, fileName);
      
          // Hapus file menggunakan fs.unlink
          fs.unlink(filePath, (err) => {
              if (err) {
                  return res.status(500).send(err);
              }
      
              res.send('File berhasil dihapus');
            });
        });
    }
};
