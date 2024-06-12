// models/Favorite.js

const db = require('../configs/database');

class Favorite {
    // Method untuk menambahkan berita ke daftar favorit pengguna
    static async addFavorite(userId, newsId) {
        try {
            const result = await db.query('INSERT INTO tbl_favorite (id_user, id_news) VALUES (?, ?)', [userId, newsId]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Method untuk menghapus berita dari daftar favorit pengguna
    static async removeFavorite(userId, newsId) {
        try {
            const result = await db.query('DELETE FROM tbl_favorite WHERE id_user = ? AND id_news = ?', [userId, newsId]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

   

    }

module.exports = Favorite;
