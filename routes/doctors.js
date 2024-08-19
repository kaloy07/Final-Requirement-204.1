const express = require('express');
const sql = require('mssql');
const config = require('../config'); // Your database configuration
const authenticateToken = require('../middleware/authMiddleware'); // JWT authentication middleware
const router = express.Router();

// Protected route to get doctors by specializationID
router.get('/:specializationID', authenticateToken, async (req, res) => {
    const { specializationID } = req.params;

    console.log('Doctors route GET request received for specializationID:', specializationID);
    
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('specializationID', sql.VarChar, specializationID)
            .query('SELECT DoctorID, FirstName, LastName, Gender, SpecializationID, ContactInfo, IsAvailableToday FROM Doctors_Dim WHERE SpecializationID = @specializationID');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ message: 'No doctors found for this specializationID' });
        }
    } catch (err) {
        console.error('Error:', err.message); // Log the error for debugging
        res.status(500).send('Error fetching data from database');
    }
});

module.exports = router;