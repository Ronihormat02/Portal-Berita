//authController.js


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../configs/database');
const { jwtSecret } = require('../configs/jwtConfig'); // Menggunakan kunci rahasia dari jwtConfig

// Fungsi untuk menjalankan query menggunakan pool koneksi
async function runQuery(sql, args) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// Signup function
async function signup(req, res) {
    try {
        const { name, username, email, password, role } = req.body;

        // Validasi input
        if (!name || !username || !email || !password || !role) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Validasi panjang password
        if (password.length < 5) {
            return res.status(400).json({ message: 'Password harus minimal 5 karakter' });
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format email salah' });
        }

        // Pisahkan email asli dari domain
        const emailParts = email.split('@');
        const emailUsername = emailParts[0];
        const emailDomain = emailParts[1];

        // Buat format email berdasarkan peran
        let formattedEmail;
        switch (role) {
            case 'user':
                formattedEmail = `${emailUsername}@gmail.com`;
                break;
            case 'admin':
                formattedEmail = `${emailUsername}@admin.com`;
                break;
            case 'superadmin':
                formattedEmail = `${emailUsername}@superadmin.com`;
                break;
            default:
                return res.status(400).json({ message: 'Peran pengguna tidak valid' });
        }

        // Validasi apakah email yang diformat sesuai dengan peran
        if (email !== formattedEmail) {
            return res.status(400).json({ message: 'Format email salah' });
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await runQuery('SELECT * FROM tbl_users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan informasi pengguna baru ke database
        await runQuery('INSERT INTO tbl_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)', [name, username, formattedEmail, hashedPassword, role]);

        // Buat token JWT
        const token = jwt.sign({ email: formattedEmail, role }, jwtSecret);

        // Kirim respons dengan token
        res.json({ message: 'Signup berhasil', token });
    } catch (error) {
        console.error(error); // Log error details for debugging
        res.status(500).json({ message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.' });
    }
}

async function signin(req, res) {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi' });
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format email tidak valid' });
        }

        // Cari pengguna berdasarkan email
        const results = await runQuery('SELECT * FROM tbl_users WHERE email = ?', [email.trim()]);

        // Pastikan bahwa pengguna ditemukan dalam database
        if (!results || results.length === 0) {
            return res.status(400).json({ message: 'Kombinasi email dan kata sandi tidak cocok' });
        }

        const user = results[0];

        // Verifikasi password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email atau kata sandi salah!' });
        }

        // Pastikan bahwa user.id_user ada
        if (!user.id_user) {
            return res.status(500).json({ message: 'Terjadi kesalahan, ID pengguna tidak ditemukan' });
        }

        // Buat token JWT dengan userId
        const token = jwt.sign({ email: user.email, userId: user.id_user, role: user.role }, jwtSecret, {
            expiresIn: '1h',
        });

        // Log untuk memeriksa token
        console.log('Generated JWT:', token);

        // Customize the response message based on the user role
        let loginMessage;
        switch (user.role) {
            case 'user':
                loginMessage = 'Signin berhasil untuk user';
                break;
            case 'admin':
                loginMessage = 'Signin berhasil untuk admin';
                break;
            case 'superadmin':
                loginMessage = 'Signin berhasil untuk superadmin';
                break;
            default:
                loginMessage = 'Signin berhasil';
        }

        // Kirim respons dengan token dan pesan khusus berdasarkan peran
        res.json({ message: loginMessage, token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat melakukan otentikasi' });
    }
}

// Export the signup and signin functions
module.exports = { signup, signin };