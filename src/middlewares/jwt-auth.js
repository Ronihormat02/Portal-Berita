const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/jwtConfig');

// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    if (!token.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Invalid token format' });
    }

    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, jwtSecret, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err); // Log kesalahan verifikasi token
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Pada lingkungan produksi, hindari mencetak decoded JWT seperti berikut
        // console.log('Decoded JWT:', decoded);

        req.userId = decoded.userId;
        req.role = decoded.role;

        // Menyimpan token dalam cookie dengan nama "token" dan opsi httpOnly
        res.cookie('token', tokenWithoutBearer, { httpOnly: true });

        next();
    });
};

// Fungsi untuk menangani upload file
exports.uploadFile = (req, res) => {
    // Pastikan ada file yang diunggah
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Ambil file yang diunggah
    const file = req.files.file;

    // Pastikan ekstensi file yang diperbolehkan, misalnya hanya gambar
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExt = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        return res.status(400).send('Only JPG, JPEG, and PNG files are allowed.');
    }

    // Tentukan lokasi untuk menyimpan file (misalnya: 'uploads' di dalam direktori proyek)
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir); // Buat direktori jika tidak ada
    }

    const uploadPath = path.join(uploadDir, file.name);

    // Simpan file ke server
    file.mv(uploadPath, (err) => {
        if (err) {
            console.error('Error saving file:', err); // Log kesalahan penyimpanan file
            return res.status(500).send(err);
        }

        // Konstruksi URL file yang diunggah
        const fileName = file.name.split('.').slice(0, -1).join('.'); // Menghapus ekstensi file
        const fileUrl = `http://localhost:3000/images/${fileName}.jpg`; // Sesuaikan dengan URL server Anda

        res.send(`File successfully uploaded! URL: ${fileUrl}`);
    });
};

// Export middleware verifyToken untuk digunakan di file lain jika diperlukan
exports.verifyToken = verifyToken;
