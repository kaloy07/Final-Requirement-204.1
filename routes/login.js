const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.recordset[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token with the user's ID and username
        const token = jwt.sign({ id: user.ID, username: user.Username }, process.env.JWT_SECRET, { expiresIn: '1h' });

         // Return the ID, token, and ProfileUpdated in the response
         res.json({ id: user.ID, token, profileUpdated: user.profile_updated });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;