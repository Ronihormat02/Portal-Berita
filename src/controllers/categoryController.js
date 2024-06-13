// categoryController.js

const db = require('../configs/database');

async function runQuery(sql, args) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await runQuery('SELECT * FROM tbl_category');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};


exports.addCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const existingCategory = await runQuery('SELECT * FROM tbl_category WHERE name = ?', [name]);
        if (existingCategory.length > 0) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const result = await runQuery('INSERT INTO tbl_category (name) VALUES (?)', [name]);
        const newCategory = { id: result.insertId, name };

        res.status(201).json({ message: 'Category added', category: newCategory });
    } catch (error) {
        console.error('Error adding category:', error.message);
        res.status(500).json({ message: 'Error adding category' });
    }
};

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const existingCategory = await runQuery('SELECT * FROM tbl_category WHERE id_category = ?', [id]);
        if (existingCategory.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await runQuery('UPDATE tbl_category SET name = ? WHERE id_category = ?', [name, id]);
        res.status(200).json({ message: 'Category updated', category: { id, name } });
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).json({ message: 'Error updating category' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const existingCategory = await runQuery('SELECT * FROM tbl_category WHERE id_category = ?', [id]);
        if (existingCategory.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await runQuery('DELETE FROM tbl_category WHERE id_category = ?', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error.message);
        res.status(500).json({ message: 'Error deleting category' });
    }
};
