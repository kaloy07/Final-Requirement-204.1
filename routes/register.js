const express = require('express');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const config = require('../config');
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await sql.connect(config.sql);
        const userResult = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        if (userResult.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserResult = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, hashedPassword)
            .query('INSERT INTO Users (Username, Password) OUTPUT INSERTED.ID VALUES (@username, @password)');

        const userID = insertUserResult.recordset[0].ID;

        res.status(201).json({ message: 'User registered successfully', userID });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;