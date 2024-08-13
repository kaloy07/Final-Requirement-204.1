const express = require('express');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const config = require('../config');
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        if (result.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, hashedPassword)
            .query('INSERT INTO Users (Username, Password) VALUES (@username, @password)');

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;