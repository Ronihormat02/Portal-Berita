const db = require('../configs/database');
const bcrypt = require('bcrypt');
const jwtAuth = require('../middlewares/jwt-auth'); // Import middleware untuk verifikasi token

function runQuery(sql, args) {
  return new Promise((resolve, reject) => {
    db.query(sql, args, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

exports.getAllUsers = async (req, res) => {
  try {
    // Verifikasi token sebelum melanjutkan
    jwtAuth.verifyToken(req, res, async () => {
      // Update query untuk mencakup kolom created_at
      const users = await runQuery('SELECT id_user, name, username, email, role, created_at FROM tbl_users');
      console.log('Data pengguna:', users); // Debugging log

      if (!Array.isArray(users) || users.length === 0) {
        throw new Error('Data pengguna tidak valid');
      }

      // Update mapping untuk mencakup created_at
      const userData = users.map(user => ({
        id: user.id_user,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }));

      res.json(userData);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    // Verifikasi token sebelum melanjutkan
    jwtAuth.verifyToken(req, res, async () => {
      const userId = req.params.userId;

      // Dapatkan pengguna berdasarkan ID dari database
      const user = await runQuery('SELECT * FROM tbl_users WHERE id_user = ?', [userId]);

      if (user.length === 0) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      }

      res.json(user[0]);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Verifikasi token sebelum melanjutkan
    jwtAuth.verifyToken(req, res, async () => {
      const userId = req.params.userId;
      const { name, username, email, password, role } = req.body;

      // Validasi input
      if (!name || !username || !email || !password || !role) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Dapatkan informasi pengguna yang sudah ada di database
      const existingUser = await runQuery('SELECT * FROM tbl_users WHERE id_user = ?', [userId]);

      if (!existingUser) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      }

      // Cek apakah ada perubahan data
      const isDataChanged = (
        existingUser.name !== name ||
        existingUser.username !== username ||
        existingUser.email !== email ||
        existingUser.role !== role ||
        existingUser.password !== hashedPassword
      );

      if (!isDataChanged) {
        return res.status(400).json({ message: 'Tidak ada perubahan yang dilakukan' });
      }

      // Update informasi pengguna di database
      await runQuery('UPDATE tbl_users SET name = ?, username = ?, email = ?, password = ?, role = ? WHERE id_user = ?', [name, username, email, hashedPassword, role, userId]);

      res.json({ message: 'Pengguna berhasil diperbarui' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Verifikasi token sebelum melanjutkan
    jwtAuth.verifyToken(req, res, async () => {
      const userId = req.params.userId;

      // Hapus pengguna dari database berdasarkan ID
      await runQuery('DELETE FROM tbl_users WHERE id_user = ?', [userId]);

      res.json({ message: 'Data Berhasil Dihapus' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
