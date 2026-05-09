// handles all cart related requests

const express = require('express');
const router = express.Router();
const database = require('../db_connection');

// GET user cart items
router.get('/:user_id', (req, res) => {
    try {
        const items = database.prepare(`
            SELECT c.id, c.quantity, c.added_at,
                   p.name, p.brand, p.price, p.image_url
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `).all(req.params.user_id);

        //total
        const total = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        res.json({ items, total });

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST add item to cart
router.post('/', (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        // check if product exists
        const product = database.prepare(
            'SELECT * FROM products WHERE id = ?'
        ).get(product_id);

        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        //check if item already in cart
        const existing = database.prepare(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?'
        ).get(user_id, product_id);

        if (existing) {
            //update quantity
            database.prepare(
                'UPDATE cart SET quantity = quantity + ? WHERE id = ?'
            ).run(quantity, existing.id);
        } else {
            //add new item
            database.prepare(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)'
            ).run(user_id, product_id, quantity);
        }

        res.json({ message: 'item added to cart' });

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// PUT update quantity
router.put('/:id', (req, res) => {
    try {
        const { quantity } = req.body;

        database.prepare(
            'UPDATE cart SET quantity = ? WHERE id = ?'
        ).run(quantity, req.params.id);

        res.json({ message: 'cart updated' });

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// DELETE item
router.delete('/:id', (req, res) => {
    try {
        database.prepare(
            'DELETE FROM cart WHERE id = ?'
        ).run(req.params.id);

        res.json({ message: 'item removed' });

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;




