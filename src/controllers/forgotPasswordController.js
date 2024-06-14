// //forgoPasswordControllwwer.js

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer'); // Modul untuk pengiriman email

// const db = require('../configs/database');

// // Function untuk menjalankan query
// async function runQuery(sql, args) {
//     return new Promise((resolve, reject) => {
//         db.query(sql, args, (err, results) => {
//             if (err) return reject(err);
//             resolve(results);
//         });
//     });
// }

// // Endpoint untuk mengirim email reset password
// router.post('/forgot-password', async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Cari pengguna berdasarkan email
//         const userResult = await runQuery('SELECT * FROM tbl_users WHERE email = ?', [email]);
//         const user = userResult[0];

//         if (!user) {
//             return res.status(404).json({ message: 'Email tidak terdaftar' });
//         }

//         // Generate token untuk reset password
//         const token = jwt.sign({ userId: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Kirim email reset password
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: 'Reset Password',
//             html: `<p>Klik <a href="${process.env.BASE_URL}/reset-password/${token}">tautan ini</a> untuk mereset password Anda.</p>`,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Gagal mengirim email reset password:', error);
//                 return res.status(500).json({ message: 'Gagal mengirim email reset password' });
//             }
//             console.log('Email reset password berhasil dikirim:', info.response);
//             res.json({ message: 'Email reset password berhasil dikirim' });
//         });
//     } catch (error) {
//         console.error('Kesalahan saat memproses permintaan reset password:', error.message);
//         res.status(500).json({ message: 'Kesalahan saat memproses permintaan reset password' });
//     }
// });

// module.exports = router;

