//handles all product related requests
const express = require('express');
const router = express.Router();
const database = require('../db_connection');

//testing route
router.get('/test', (req, res) => {
    res.json({ message: 'products route working!' });
});



//GET all products 
router.get('/', (req, res) => {
 try {
    console.log('products:');
    const products = database.prepare(`
        SELECT p.*, c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
    `).all();
    console.log('products found:', products.length);
    res.json(products);
 } catch (error) {
    console.error('error:', error.message);
    res.status(500).json({ error: error.message });
 }
});


module.exports = router;

