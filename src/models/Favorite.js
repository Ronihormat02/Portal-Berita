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

  
    static async findOneAndUpdate(favoriteId, userId, newsId) {
        try {
          const result = await db.query('UPDATE tbl_favorite SET id_news = ? WHERE id_favorite = ? AND id_user = ?', [newsId, favoriteId, userId]);
      
          if (result.affectedRows === 1) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          throw error;
        }
      }
      
    }

module.exports = Favorite;
