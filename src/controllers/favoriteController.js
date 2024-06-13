///favoriteController.js
const db = require('../configs/database');
const Favorite = require('../models/Favorite');


async function runQuery(sql, args) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.getAllfavorites = async (req, res) => {
    try {
        const favorites = await runQuery('SELECT * FROM tbl_favorite');
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.userId; // Mengambil userId dari token JWT yang telah diverifikasi
        const { newsId } = req.body; // Mengambil newsId dari payload permintaan

        // Pastikan request body memiliki properti newsId
        if (!newsId) {
            return res.status(400).json({ message: 'News ID is required' });
        }

        // Tambahkan berita ke favorit dengan userId dan newsId yang sesuai
        const favoriteId = await Favorite.addFavorite(userId, newsId);
        
        // Periksa apakah favoriteId berhasil ditambahkan
        if (!favoriteId) {
            return res.status(500).json({ message: 'Berhasil di tambahkan ke favorite' });
        }

        res.status(201).json({ message: 'Berita Favorit Ditambahkan', favoriteId });
    } catch (error) {
        console.error('Error adding news to favorites:', error.message);
        res.status(500).json({ message: 'Error adding news to favorites' });
    }
};



exports.removeFavorite = async (req, res) => {
    try {
        const { newsId } = req.params;
        const userId = req.userId; // Pastikan userId telah diperoleh dari token JWT

        await Favorite.removeFavorite(userId, newsId);
        res.json({ message: 'Berita berhasil dihapus dari favorit' });
    } catch (error) {
        console.error('Kesalahan saat menghapus berita dari favorit:', error.message);
        res.status(500).json({ message: 'Kesalahan saat menghapus berita dari favorit' });
    }
};

exports.updateFavorite = async (req, res) => {
    try {
      const { favoriteId } = req.params;
      const { newsId } = req.body;
      const userId = req.userId;
  
      console.log(`Updating favorite with id ${favoriteId} and newsId ${newsId} for user ${userId}`);
  
      // Pastikan request body memiliki properti newsId
      if (!newsId) {
        return res.status(400).json({ message: 'Tidak ada data yang diperbarui' });
      }
  
      // Lakukan update favorit menggunakan kueri SQL langsung
      const updateQuery = 'UPDATE tbl_favorite SET id_news = ? WHERE id_favorite = ? AND id_user = ?';
      const result = await db.query(updateQuery, [newsId, favoriteId, userId]);
  
      console.log(`Update result: ${result}`);
  
      // Check if the query was successful
      if (result && result.affectedRows > 0) {
        res.json({ message: 'Favorit diperbarui dengan sukses' });
      } else {
        console.error(`Error updating favorite: affectedRows is 0`);
        res.status(404).json({ message: 'Favorit tidak ditemukan atau tidak ada perubahan yang dilakukan' });
      }
    } catch (error) {
      console.error(`Error updating favorite: ${error.message}`);
      res.status(500).json({ message: 'Kesalahan dalam memperbarui favorit' });
    }
  };
