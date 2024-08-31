const express = require('express');
const sql = require('mssql');
const config = require('../config');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded contains the user ID and other info
        next();
    } catch (err) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// POST API to insert a new patient
router.post('/', async (req, res) => {
    try {
        const { FirstName, LastName, Gender, BirthDate, ContactInfo, Address, UserID, InsuranceCoverage } = req.body;
        let pool = await sql.connect(config);

        // Begin transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert into Patients_Dim table
            const patientResult = await transaction.request()
                .input('FirstName', sql.VarChar, FirstName)
                .input('LastName', sql.VarChar, LastName)
                .input('Gender', sql.VarChar, Gender)
                .input('BirthDate', sql.Date, BirthDate)
                .input('ContactInfo', sql.VarChar, ContactInfo)
                .input('Address', sql.VarChar, Address)
                .input('UserID', sql.Int, UserID)
                .input('InsuranceCoverage', sql.VarChar, InsuranceCoverage)
                .query(`INSERT INTO Patients_Dim (FirstName, LastName, Gender, BirthDate, ContactInfo, Address, UserID, InsuranceCoverage)
                        OUTPUT INSERTED.PatientID
                        VALUES (@FirstName, @LastName, @Gender, @BirthDate, @ContactInfo, @Address, @UserID, @InsuranceCoverage)`);

            const patientID = patientResult.recordset[0].PatientID;

            // Update Users table
            await transaction.request()
                .input('UserID', sql.Int, UserID)
                .query(`UPDATE Users
                        SET profile_updated = 1
                        WHERE ID = @UserID`);

            // Commit transaction
            await transaction.commit();

            res.status(201).json({ message: 'Patient added successfully and user profile updated', patientID });
        } catch (err) {
            // Rollback transaction in case of error
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// GET API to retrieve the profile of the authenticated user
router.get('/profile', authenticate, async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('UserID', sql.Int, req.user.id) // Use the ID from the token
            .query('SELECT * FROM Patients_Dim WHERE UserID = @UserID');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;