// handles coupon related requests

const express = require('express');
const router = express.Router();
const database = require('../db_connection');

// POST apply a coupon
router.post('/apply', (req, res) => {
    try {
        const { code, cart_total, user_id } = req.body;

        //find the coupon
        const coupon = database.prepare(
            'SELECT * FROM coupons WHERE code = ?'
        ).get(code);

        if (!coupon) {
            return res.status(404).json({ error: 'coupon not found' });
        }

        //check if expired
        const now = new Date();
        const expires = new Date(coupon.expires_at);
        if (now > expires) {
            return res.status(400).json({ error: 'coupon has expired' });
        }

        //check if user already used this coupon
        const used = database.prepare(
            'SELECT * FROM coupon_usage WHERE user_id = ? AND coupon_id = ?'
        ).get(user_id, coupon.id);

        if (used) {
            return res.status(400).json({ error: 'coupon already used' });
        }

        //calculate discount
        let discount = 0;
        if (coupon.discount_type === 'percent') {
            discount = cart_total * (coupon.discount_value / 100);
        } else {
            discount = coupon.discount_value;
        }

        const new_total = cart_total - discount;

        //record coupon usage
        database.prepare(
            'INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)'
        ).run(coupon.id, user_id);

        res.json({
            message: 'coupon applied successfully',
            discount,
            new_total
        });

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
