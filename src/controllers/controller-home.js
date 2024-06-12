//controller-home

const db = require('../configs/database.js');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

let pool = mysql.createPool(mysql);

module.exports = {
    home(req, res) {
        // Dapatkan peran pengguna dari sesi
        const userRole = req.session.role;

        res.render("home", {
            url: 'http://localhost:5050/',
            userName: req.session.username,
            userRole: userRole, // Teruskan peran pengguna ke template
        });
    }
};
