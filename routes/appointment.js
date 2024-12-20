const express = require('express');
const sql = require('mssql');
const config = require('../config'); // Your database configuration
const authenticateToken = require('../middleware/authMiddleware'); // JWT authentication middleware
const router = express.Router();

// Protected route to set an appointment
router.post('/set', authenticateToken, async (req, res) => {
    const { PatientID, DoctorID, SpecializationID, AppointmentDate } = req.body;

    console.log('Appointment route POST request received:', req.body);
    
    if (!PatientID || !DoctorID || !SpecializationID || !AppointmentDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let pool = await sql.connect(config.sql);
        const request = pool.request();
        
        // Set up input parameters
        request.input('PatientID', sql.VarChar(5), PatientID);
        request.input('DoctorID', sql.VarChar(6), DoctorID);
        request.input('SpecializationID', sql.VarChar(5), SpecializationID);
        request.input('AppointmentDate', sql.DateTime, AppointmentDate);
        
        // Set up output parameter
        request.output('BillingID', sql.VarChar(5));
        
        // Execute the stored procedure
        const result = await request.execute('SetAppointment');
        
        // Extract the values from the result
        if (result.recordset.length > 0) {
            // Destructure the returned data
            const { AppointmentDate, DoctorID, DoctorsName, BillingID } = result.recordset[0];

            // Respond with the result
            res.status(200).json({
                message: 'Appointment set successfully',
                AppointmentDate: AppointmentDate,
                DoctorID: DoctorID,
                DoctorsName: DoctorsName,
                BillingID: BillingID
            });
        } else {
            res.status(500).json({ error: 'No data returned from stored procedure' });
        }
    } catch (err) {
        console.error('SQL error:', err); // Log the full error
        res.status(500).json({ error: 'Error setting appointment in the database', details: err.message });
    }
});

// Route to fetch all appointments by UserID
router.get('/user/:userID', authenticateToken, async (req, res) => {
    const { userID } = req.params;

    console.log('Fetch appointments route GET request received for userID:', userID);
    
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT 
                    a.AppointmentID, 
                    a.PatientID, 
                    a.DoctorID, 
                    a.SpecializationID, 
                    a.BillingID, 
                    a.AppointmentDate,
                    CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName
                FROM 
                    Appointment_Fact a
                INNER JOIN 
                    Patients_Dim p ON a.PatientID = p.PatientID
                INNER JOIN 
                    Doctors_Dim d ON a.DoctorID = d.DoctorID
                WHERE 
                    p.UserID = @userID
                ORDER BY 
                    a.AppointmentDate DESC
            `);
        
        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ message: 'No appointments found for this UserID' });
        }
    } catch (err) {
        console.error('Error:', err.message); // Log the error for debugging
        res.status(500).send('Error fetching appointments from database');
    }
});

module.exports = router;