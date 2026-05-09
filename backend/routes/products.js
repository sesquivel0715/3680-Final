//handles all product related requests
const express = require('express');
const router = express.Router();
const database = require('../db_connection');

// GET /products - get all products, filter by category, or search by name
router.get('/', (req, res) => {
    try {
        const { category, search } = req.query;

        // search by name or brand
        if (search) {
            const products = database.prepare(`
                SELECT p.*, c.name AS category_name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.name LIKE ? OR p.brand LIKE ?
            `).all(`%${search}%`, `%${search}%`);
            return res.json(products);
        }

        // filter by category
        if (category) {
            const products = database.prepare(`
                SELECT p.*, c.name AS category_name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE c.name = ?
            `).all(category);
            return res.json(products);
        }

        // get all products
        const products = database.prepare(`
            SELECT p.*, c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
        `).all();
        res.json(products);

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

