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

        const rowsAffected = await Favorite.removeFavorite(userId, newsId);
        if (rowsAffected > 0) {
            res.json({ message: 'News removed from favorites' });
        } else {
            res.status(404).json({ message: 'News not found in favorites' });
        }
    } catch (error) {
        console.error('Error removing news from favorites:', error.message);
        res.status(500).json({ message: 'Error removing news from favorites' });
    }
};

exports.updateFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params;
        const { userId, newsId } = req.body; // Update yang ingin dilakukan

        // Pastikan request body memiliki properti userId dan newsId
        if (!userId || !newsId) {
            return res.status(400).json({ message: 'User ID and News ID are required for update' });
        }

        // Lakukan update favorit dengan userId dan newsId yang sesuai
        const rowsAffected = await Favorite.updateFavorite(favoriteId, userId, newsId);
        
        // Periksa apakah ada baris yang terpengaruh
        if (rowsAffected > 0) {
            res.json({ message: 'Favorite updated successfully' });
        } else {
            res.status(404).json({ message: 'Favorite not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating favorite:', error.message);
        res.status(500).json({ message: 'Error updating favorite' });
    }
};
