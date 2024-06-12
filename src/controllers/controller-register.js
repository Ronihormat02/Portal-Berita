//controller-register.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../configs/database.js');
const mysql = require('mysql');

let pool = mysql.createPool(mysql);

module.exports = {
    formRegister(req, res) {
        res.render("register", {
            message: req.flash('message'),
            color: req.flash('color'),
            status: req.flash('status'),
            url: 'http://localhost:5050/',
        });
    },
    saveRegister(req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.pass;
        let role = req.body.role || 'user'; // Set default role to 'user'

        if (username && email && password) {
            if (!validateEmail(email, role)) {
                req.flash('color', 'danger');
                req.flash('status', 'Oops..');
                req.flash('message', 'Format email tidak valid');
                return res.redirect('/register');
            }

            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(
                    `SELECT * FROM tbl_users WHERE email = ?`, [email], function (error, results, fields) {
                        if (error) throw error;
                        if (results.length > 0) {
                            req.flash('color', 'danger');
                            req.flash('status', 'Oops..');
                            req.flash('message', 'Email sudah terdaftar');
                            res.redirect('/register');
                        } else {
                            bcrypt.hash(password, 10, function(err, hash) {
                                if (err) throw err;
                                connection.query(
                                    `INSERT INTO tbl_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)`,
                                    [username, username, email, hash, role],
                                    function (error, results, fields) {
                                        if (error) throw error;
                                        // Membuat token JWT setelah registrasi berhasil
                                        const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
                                        // Mengirim token sebagai respons atau menyimpan dalam sesi pengguna
                                        req.flash('color', 'success');
                                        req.flash('status', 'Yes..');
                                        req.flash('message', 'Registrasi berhasil');
                                        res.redirect('/login');
                                    }
                                );
                            });
                        }
                        connection.release();
                    }
                );
            });
        } else {
            // Berikan respons JSON jika data tidak lengkap
            res.status(400).json({
                message: 'Semua field harus diisi'
            });
        }
    }
};

// Validasi email berdasarkan role
function validateEmail(email, role) {
    var re;
    if (role === 'users') {
        re = /\S+@gmail\.com/;
    } else if (role === 'admin') {
        re = /\S+@admin\.com/;
    } else if (role === 'superadmin') {
        re = /\S+@superadmin\.com/;
    } else {
        return false;
    }
    return re.test(email); // Mengembalikan true jika format email benar, false jika tidak
}
