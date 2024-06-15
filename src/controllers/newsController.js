// newsController.js

// Import modul database
const db = require('../configs/database');

// Fungsi untuk menjalankan query menggunakan pool koneksi
async function runQuery(sql, args) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// Fungsi untuk mendapatkan semua berita
exports.getAllNews = async (req, res) => {
    try {
        const news = await runQuery('SELECT * FROM tbl_news');
        res.json(news);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ message: 'Error fetching news' });
    }
};
exports.getNewsById = async (req, res) => {
    const { id } = req.params;
    try {
        const news = await runQuery('SELECT * FROM tbl_news WHERE id_news = ?', [id]);
        if (news.length === 0) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(news[0]);
    } catch (error) {
        console.error('Error fetching news by ID:', error.message);
        res.status(500).json({ message: 'Error fetching news by ID' });
    }
};


// Fungsi untuk menambahkan berita baru

exports.addNews = async (req, res) => {
    try {
        const { title, description, content, image, id_category } = req.body;
        const id_user = req.userId; // Menggunakan userId dari token JWT yang telah diverifikasi
        const published_at = new Date(); // Mendapatkan timestamp saat ini
        
        await runQuery(
            `INSERT INTO tbl_news (title, description, content, image, id_category, id_user, published_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, content, image, id_category, id_user, published_at]
        );
        
        console.log('Berita ditambahkan:', req.body); // Menambahkan log
        res.status(201).json({ message: 'Berita berhasil ditambahkan' });
    } catch (error) {
        console.error('Error menambahkan berita:', error.message);
        res.status(500).json({ message: 'Error menambahkan berita' });
    }
};


// Fungsi untuk mendapatkan berita berdasarkan ID
exports.getNewsByCategory = async (req, res) => {
    const { id_category } = req.params;
    try {
        const news = await runQuery('SELECT * FROM tbl_news WHERE id_category = ?', [id_category]);
        res.json(news);
    } catch (error) {
        console.error('Error fetching news by category:', error.message);
        res.status(500).json({ message: 'Error fetching news by category' });
    }
};

// Fungsi untuk mendapatkan berita berdasarkan kategori
exports.getNewsByCategory = async (req, res) => {
    const { id_category } = req.params;
    try {
        const news = await runQuery('SELECT * FROM tbl_news WHERE id_category = ?', [id_category]);
        res.json(news);
    } catch (error) {
        console.error('Error fetching news by category:', error.message);
        res.status(500).json({ message: 'Error fetching news by category' });
    }
};

// Fungsi untuk memperbarui berita berdasarkan ID
exports.updateNews = async (req, res) => { // Mengganti nama fungsi menjadi "updateNews"
    const { id } = req.params;
    try {
        const { title, description, content, image, id_category, id_user, published_at } = req.body;
        await runQuery(
            `UPDATE tbl_news 
            SET title = ?, description = ?, content = ?, image = ?, id_category = ?, id_user = ?, published_at = ?
            WHERE id_news = ?`,
            [title, description, content, image, id_category, id_user, published_at, id]
        );
        console.log('Berita diperbarui:', req.body); // Menambahkan log
        res.json({ message: 'News updated successfully' });
    } catch (error) {
        console.error('Error updating news:', error.message);
        res.status(500).json({ message: 'Error updating news' });
    }
};

// Fungsi untuk menghapus berita berdasarkan ID
exports.deleteNews = async (req, res) => { // Mengganti nama fungsi menjadi "deleteNews"
    const { id } = req.params;
    try {
        await runQuery('DELETE FROM tbl_news WHERE id_news = ?', [id]);
        console.log('Berita dihapus dengan ID:', id); // Menambahkan log
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error.message);
        res.status(500).json({ message: 'Error deleting news' });
    }
};
