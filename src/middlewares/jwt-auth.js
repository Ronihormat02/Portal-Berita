const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/jwtConfig');

// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log('Token yang diterima:', token);

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    if (!token.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Invalid token format' });
    }

    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, jwtSecret, (err, decoded) => {
        if (err) {
            console.error('Error verifikasi token:', err);
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.log('Decoded JWT:', decoded);

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
        return res.status(400).send('Tidak ada file yang diunggah.');
    }

    // Ambil file yang diunggah
    const file = req.files.file;

    // Tentukan lokasi untuk menyimpan file (misalnya: 'uploads' di dalam direktori proyek)
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir); // Buat direktori jika tidak ada
    }

    const uploadPath = path.join(uploadDir, file.name);

    // Simpan file ke server
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Konstruksi URL file yang diunggah
        const fileName = file.name.split('.').slice(0, -1).join('.'); // Menghapus ekstensi file
        const fileUrl = `http://localhost:3000/images/${fileName}.jpg`; // Sesuaikan dengan URL server Anda

        res.send(`File berhasil diunggah! URL: ${fileUrl}`);
    });
};

// Export middleware verifyToken untuk digunakan di file lain jika diperlukan
exports.verifyToken = verifyToken;
