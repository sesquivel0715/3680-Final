//handles register and login
const express = require('express');
const router = express.Router();
const database = require('../db_connection');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // check if username already exists
        const existing = database.prepare(
            'SELECT * FROM users WHERE username = ?'
        ).get(username);

        if (existing) {
            return res.status(400).json({ error: 'username already taken' });
        }

        // hash the password
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        // insert new user
        const result = database.prepare(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)'
        ).run(username, password_hash);

        // return user id so frontend can use it
        res.json({ 
            message: 'registered successfully',
            user_id: result.lastInsertRowid
        });

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // find user
        const user = database.prepare(
            'SELECT * FROM users WHERE username = ?'
        ).get(username);

        if (!user) {
            return res.status(400).json({ error: 'user not found' });
        }

        // check password
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(400).json({ error: 'incorrect password' });
        }

        // return user id so frontend can use it
        res.json({ 
            message: 'login successful',
            user_id: user.id,
            username: user.username
        });

    } catch (error) {
        console.error('error:', error.message);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;





