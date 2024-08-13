const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const config = require('../config');
const router = express.Router();

router.post('/',  (req, res, next) => {
    console.log('Login route POST request received');
    next(); },
    async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: user.Username }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;