//controller-login.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/database.js');
const mysql = require('mysql');
const config = require('../configs/jwtConfig'); // Import konfigurasi JWT
const pool = mysql.createPool(mysql);

const login = (req, res) => {
    res.render("login", {
        url: 'http://localhost:5050/',
        colorFlash: req.flash('color'),
        statusFlash: req.flash('status'),
        pesanFlash: req.flash('message'),
    });
};

const loginAuth = (req, res) => {
    let email = req.body.email;
    let password = req.body.pass;
    if (email && password) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
                return res.redirect('/login');
            }

            connection.query(
                `SELECT * FROM tbl_users WHERE email = ?`, [email], function (error, results) {
                    if (error) {
                        console.error(error);
                        connection.release();
                        return res.redirect('/login');
                    }

                    if (results.length > 0) {
                        bcrypt.compare(password, results[0].password, function (err, result) {
                            if (err) {
                                console.error(err);
                                connection.release();
                                return res.redirect('/login');
                            }
                            if (result) {
                                // Buat token JWT dengan menggunakan kunci rahasia dari konfigurasi
                                const token = jwt.sign({ email: email, role: results[0].role }, config.jwtSecret);
                                req.session.token = token;
                                req.session.userid = results[0].id_user;
                                req.session.username = results[0].name;
                                req.session.role = results[0].role || 'user'; // Set default role 'user' if role not found in database
                                connection.release();
                                // Redirect ke halaman setelah login
                                return res.redirect('/');
                            } else {
                                req.flash('color', 'danger');
                                req.flash('status', 'Oops..');
                                req.flash('message', 'Password salah');
                                connection.release();
                                return res.redirect('/login');
                            }
                        });
                    } else {
                        req.flash('color', 'danger');
                        req.flash('status', 'Oops..');
                        req.flash('message', 'Akun tidak ditemukan');
                        connection.release();
                        return res.redirect('/login');
                    }
                }
            );
        });
    } else {
        return res.redirect('/login');
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/login');
        }
        res.clearCookie('secretname');
        return res.redirect('/login');
    });
};

module.exports = {
    login,
    loginAuth,
    logout
};
