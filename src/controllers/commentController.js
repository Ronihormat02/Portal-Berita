    // controllers/commentController.js

    const db = require('../configs/database');

    // Fungsi untuk menambahkan komentar baru
    exports.addComment = async (req, res) => {
        try {
            const { id_news, comment } = req.body; // Menangkap data yang dikirim dari form
            const id_user = req.userId; // Menggunakan userId dari token JWT yang telah diverifikasi
            const created_at = new Date(); // Gunakan tanggal dan waktu saat ini sebagai created_at

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

    // Fungsi untuk mengambil komentar berdasarkan ID berita
    exports.getCommentsByNewsId = async (req, res) => {
        try {
            const newsId = req.params.id;

            const comments = await Comment.getCommentsByNewsId(newsId);

            res.json(comments);
        } catch (error) {
            console.error('Error fetching comments by news ID:', error.message);
            res.status(500).json({ message: 'Error fetching comments' });
        }
    };

    // Fungsi untuk menghapus komentar
    exports.deleteComment = async (req, res) => {
        try {
            const commentId = req.params.id;
            const userId = req.userId;
    
            // Lakukan kueri SQL untuk menghapus komentar dari basis data
            const result = await db.query('DELETE FROM tbl_comment WHERE id = ? AND id_user = ?', [commentId, userId]);
    
            // Periksa apakah komentar berhasil dihapus
            if (result.affectedRows > 0) {
                res.json({ message: 'Comment deleted successfully' });
            } else {
                res.status(404).json({ message: 'Comment not found or user not authorized' });
            }
        } catch (error) {
            console.error('Error deleting comment:', error.message);
            res.status(500).json({ message: 'Error deleting comment' });
        }
    };
