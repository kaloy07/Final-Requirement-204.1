// routes/patients.js
const express = require('express');
const sql = require('mssql');
const config = require('../config');
const router = express.Router();

// POST API to insert a new patient
router.post('/', async (req, res) => {
    try {
        const { FirstName, LastName, Gender, BirthDate, ContactInfo, Address } = req.body;
        let pool = await sql.connect(config);

        const result = await pool.request()
            .input('FirstName', sql.VarChar, FirstName)
            .input('LastName', sql.VarChar, LastName)
            .input('Gender', sql.VarChar, Gender)
            .input('BirthDate', sql.Date, BirthDate)
            .input('ContactInfo', sql.VarChar, ContactInfo)
            .input('Address', sql.VarChar, Address)
            .query(`INSERT INTO Patients_Dim (FirstName, LastName, Gender, BirthDate, ContactInfo, Address)
                    OUTPUT INSERTED.PatientID
                    VALUES (@FirstName, @LastName, @Gender, @BirthDate, @ContactInfo, @Address)`);

        res.status(201).json({ message: 'Patient added successfully', patientID: result.recordset[0].PatientID });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

module.exports = router;