const db = require('../configs/database');
const bcrypt = require('bcrypt');
const jwtAuth = require('../middlewares/jwt-auth');

async function runQuery(sql, args) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.changePassword = [
    jwtAuth.verifyToken,
    async (req, res) => {
        try {
            const userId = req.userId; // Ambil userId dari token JWT yang terverifikasi
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Password lama dan password baru diperlukan' });
            }

            // Ambil user dari database
            const userResult = await runQuery('SELECT * FROM tbl_users WHERE id_user = ?', [userId]);
            const user = userResult[0];

            if (!user) {
                return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
            }

            // Verifikasi password lama
            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: 'Password lama salah' });
            }

            // Hash password baru
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update password di database
            await runQuery('UPDATE tbl_users SET password = ? WHERE id_user = ?', [hashedNewPassword, userId]);

            res.json({ message: 'Password berhasil diubah' });
        } catch (error) {
            console.error('Kesalahan saat mengubah password:', error.message);
            res.status(500).json({ message: 'Kesalahan saat mengubah password' });
        }
    }
];
