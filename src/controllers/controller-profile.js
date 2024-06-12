

const db = require('../configs/database.js');
const jwt = require('jsonwebtoken');

let mysql = require('mysql');
let pool = mysql.createPool(mysql);

pool.on('error', (err) => {
    console.error(err);
});

const getUserProfile = (req, res) => {
    // Mendapatkan informasi profil pengguna berdasarkan id_user dari token JWT
    const userId = req.user.id_user; // Anda perlu menyesuaikan cara mendapatkan id_user dari token JWT
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        connection.query(
            `SELECT * FROM tbl_users WHERE id_user = ?`, [userId], function (error, results) {
                if (error) {
                    console.error(error);
                    connection.release();
                    return res.status(500).json({ message: "Internal Server Error" });
                }
                if (results.length > 0) {
                    const userProfile = {
                        id_user: results[0].id_user,
                        name: results[0].name,
                        username: results[0].username,
                        email: results[0].email,
                        // Tambahkan kolom lain jika diperlukan
                    };
                    return res.json(userProfile);
                } else {
                    connection.release();
                    return res.status(404).json({ message: "Profil pengguna tidak ditemukan" });
                }
            }
        );
    });
};

const createUserProfile = (req, res) => {
    const { name, username, email, password, role } = req.body;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        connection.query(
            `INSERT INTO tbl_users (name, username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
            [name, username, email, password, role],
            function (error, results) {
                if (error) {
                    console.error(error);
                    connection.release();
                    return res.status(500).json({ message: "Internal Server Error" });
                }
                connection.release();
                return res.json({ message: "Profil pengguna berhasil dibuat" });
            }
        );
    });
};

const updateUserProfile = (req, res) => {
    // Mendapatkan id_user dari token JWT
    const userId = req.user.id_user; // Anda perlu menyesuaikan cara mendapatkan id_user dari token JWT
    const { name, username, email } = req.body;
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        connection.query(
            `UPDATE tbl_users SET name = ?, username = ?, email = ? WHERE id_user = ?`, [name, username, email, userId],
            function (error, results) {
                if (error) {
                    console.error(error);
                    connection.release();
                    return res.status(500).json({ message: "Internal Server Error" });
                }
                connection.release();
                return res.json({ message: "Profil pengguna berhasil diperbarui" });
            }
        );
    });
};

const deleteUserAccount = (req, res) => {
    // Mendapatkan id_user dari token JWT
    const userId = req.user.id_user; // Anda perlu menyesuaikan cara mendapatkan id_user dari token JWT
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        connection.query(
            `DELETE FROM tbl_users WHERE id_user = ?`, [userId],
            function (error, results) {
                if (error) {
                    console.error(error);
                    connection.release();
                    return res.status(500).json({ message: "Internal Server Error" });
                }
                connection.release();
                return res.json({ message: "Akun pengguna berhasil dihapus" });
            }
        );
    });
};

// Menambahkan middleware untuk memverifikasi token JWT pada endpoint-profile
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Token diperlukan" });
    }
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token tidak valid" });
        }
        req.user = decoded; // Menyimpan informasi pengguna dari token JWT di objek req
        next();
    });
};

module.exports = {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserAccount,
    verifyToken
};
