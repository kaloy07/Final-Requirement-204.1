const express = require('express');
const sql = require('mssql');
const config = require('../config');
const authenticateToken = require('../middleware/authMiddleware'); // Import your authentication middleware
const router = express.Router();

// Protected route to get specializations
router.get('/', authenticateToken, async (req, res) => {
    console.log('Specialization route GET request received');
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .query('SELECT SpecializationID, Specialization FROM Specialization_Dim');
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Error:', err.message); // Log the error for debugging
        res.status(500).send('Error fetching data from database');
    }
});

module.exports = router;