const db = require('../configs/database');
const jwtAuth = require('../middlewares/jwt-auth');

async function runQuery(sql, args) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.getAllFavorites = [
    jwtAuth.verifyToken,
    async (req, res) => {
        try {
            const userId = req.userId; // Ambil userId dari token JWT yang diverifikasi
            const favorites = await runQuery('SELECT * FROM tbl_favorite WHERE id_user = ?', [userId]);
            res.json(favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
            res.status(500).json({ message: 'Error fetching favorites' });
        }
    }
];

exports.addFavorite = [
    jwtAuth.verifyToken,
    async (req, res) => {
        try {
            const userId = req.userId;
            const { newsId } = req.body;

            if (!newsId) {
                return res.status(400).json({ message: 'News ID is required' });
            }

            const insertQuery = 'INSERT INTO tbl_favorite (id_user, id_news) VALUES (?, ?)';
            const result = await runQuery(insertQuery, [userId, newsId]);

            if (result.insertId) {
                res.status(201).json({ message: 'Berita Favorit Ditambahkan', favoriteId: result.insertId });
            } else {
                res.status(500).json({ message: 'Failed to add to favorite' });
            }
        } catch (error) {
            console.error('Error adding news to favorites:', error.message);
            res.status(500).json({ message: 'Error adding news to favorites' });
        }
    }
];

exports.removeFavorite = [
    jwtAuth.verifyToken,
    async (req, res) => {
        try {
            const userId = req.userId;
            const { newsId } = req.params;

            const deleteQuery = 'DELETE FROM tbl_favorite WHERE id_user = ? AND id_news = ?';
            await runQuery(deleteQuery, [userId, newsId]);

            res.json({ message: 'Berita berhasil dihapus dari favorit' });
        } catch (error) {
            console.error('Kesalahan saat menghapus berita dari favorit:', error.message);
            res.status(500).json({ message: 'Kesalahan saat menghapus berita dari favorit' });
        }
    }
];

exports.updateFavorite = [
    jwtAuth.verifyToken,
    async (req, res) => {
        try {
            const userId = req.userId;
            const { favoriteId } = req.params;
            const { newsId } = req.body;

            if (!newsId) {
                return res.status(400).json({ message: 'News ID is required' });
            }

            const updateQuery = 'UPDATE tbl_favorite SET id_news = ? WHERE id_favorite = ? AND id_user = ?';
            const result = await runQuery(updateQuery, [newsId, favoriteId, userId]);

            if (result && result.affectedRows > 0) {
                res.json({ message: 'Favorite updated successfully' });
            } else {
                console.error(`Error updating favorite: affectedRows is 0`);
                res.status(404).json({ message: 'Favorite not found or no changes made' });
            }
        } catch (error) {
            console.error(`Error updating favorite: ${error.message}`);
            res.status(500).json({ message: 'Error updating favorite' });
        }
    }
];
