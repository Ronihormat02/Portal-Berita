    // controllers/commentController.js

    const db = require('../configs/database');

    async function runQuery(sql, args) {
        return new Promise((resolve, reject) => {
            db.query(sql, args, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    // Fungsi untuk mengambil komentar berdasarkan ID berita
    exports.getCommentsByNewsId = async (req, res) => {
        try {
            const newsId = req.params.newsId;
    
            const sql = 'SELECT * FROM tbl_comment WHERE id_news = ?';
            const comments = await runQuery(sql, [newsId]);
    
            res.json(comments); // Mengirimkan hasil query langsung sebagai respons JSON
        } catch (error) {
            console.error('Error fetching comments by news ID:', error);
            res.status(500).json({ message: 'Error fetching comments' });
        }
    };

    // Fungsi untuk menambahkan komentar baru
    exports.addComment = async (req, res) => {
        try {
            const { id_news, comment } = req.body; // Menangkap data yang dikirim dari form
            const id_user = req.userId; 
            const created_at = new Date(); 

            // Lakukan validasi data
            if (!id_news || !id_user || !comment) {
                return res.status(400).json({ message: 'Semua field harus diisi' });
            }

            // Simpan komentar ke dalam database
            const result = await db.query('INSERT INTO tbl_comment (id_news, id_user, comment, created_at) VALUES (?, ?, ?, ?)', [id_news, id_user, comment, created_at]);
            const commentId = result.insertId;

            res.status(201).json({ message: 'Komentar berhasil ditambahkan', commentId });
        } catch (error) {
            console.error('Error adding comment:', error.message);
            res.status(500).json({ message: 'Error adding comment' });
        }
    };

    // Fungsi untuk menghapus komentar
    exports.deleteComment = async (req, res) => {
        try {
            const commentId = req.params.id;
            const userId = req.userId;
    
            // Lakukan kueri SQL untuk menghapus komentar dari basis data
            const result = await db.query('DELETE FROM tbl_comment WHERE id_comment = ? AND id_user = ?', [commentId, userId]);
    
            // Periksa apakah komentar berhasil dihapus
            if (result.affectedRows > 0) {
                res.json({ message: 'Comment deleted successfully' });
            } else {
                res.status(404).json({ message: 'Comment not found' });
            }
        } catch (error) {
            console.error('Error deleting comment:', error.message);
            res.status(500).json({ message: 'Error deleting comment' });
        }
    };
    