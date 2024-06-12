// authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../configs/database');

// Fungsi untuk menjalankan query menggunakan pool koneksi
async function runQuery(sql, args) {
  return new Promise((resolve, reject) => {
    db.query(sql, args, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

exports.signup = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Validasi input
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await runQuery('SELECT * FROM tbl_users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Pisahkan email asli dari domain
    const emailParts = email.split('@');
    const emailUsername = emailParts[0];

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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan informasi pengguna baru ke database
    await runQuery('INSERT INTO tbl_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)', [name, username, formattedEmail, hashedPassword, role]);

    // Buat token JWT
    const token = jwt.sign({ email: formattedEmail, role }, process.env.JWT_SECRET);

    // Kirim respons dengan token
    res.json({ message: 'Signup berhasil', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.signin = async (req, res) => {
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

    // Log untuk debugging
    console.log('Email dari request:', email);

    // Cari pengguna berdasarkan email
    const results = await runQuery('SELECT * FROM tbl_users WHERE email = ?', [email.trim()]);

    // Log hasil query untuk debugging
    console.log('Hasil query:', results);

    // Pastikan bahwa pengguna ditemukan dalam database
    if (!results || results.length === 0) {
      return res.status(400).json({ message: 'Kombinasi email dan kata sandi tidak cocok' });
    }

    const user = results[0];

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Kombinasi email dan kata sandi tidak cocok' });
    }

    // Buat token JWT
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Kirim respons dengan token
    res.json({ message: 'Signin berhasil', token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat melakukan otentikasi' });
  }
};
