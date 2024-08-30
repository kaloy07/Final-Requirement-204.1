const express = require('express');
const sql = require('mssql');
const config = require('../config'); // Your database configuration
const authenticateToken = require('../middleware/authMiddleware'); // JWT authentication middleware
const router = express.Router();

// Protected route to get bills by BillingID
router.get('/:BillingID', authenticateToken, async (req, res) => {
    const { BillingID } = req.params;

    console.log('Billing route GET request received for BillingID:', BillingID);

    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('BillingID', sql.VarChar, BillingID)
            .query('SELECT * FROM Billing_Dim WHERE BillingID = @BillingID');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ message: 'No bills found for this BillingID' });
        }
    } catch (err) {
        console.error('Error:', err.message); // Log the error for debugging
        res.status(500).send('Error fetching data from database');
    }
});

// New route to update the Paid status
router.put('/pay/:BillingID', authenticateToken, async (req, res) => {
    const { BillingID } = req.params;

    console.log('Billing route PUT request received for BillingID:', BillingID);

    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('BillingID', sql.VarChar, BillingID)
            .query('UPDATE Billing_Dim SET isPaid = 1 WHERE BillingID = @BillingID');
        
        if (result.rowsAffected[0] > 0) {
            res.json({ message: 'Payment status updated successfully.' });
        } else {
            res.status(404).json({ message: 'No bill found for this BillingID' });
        }
    } catch (err) {
        console.error('Error:', err.message); // Log the error for debugging
        res.status(500).send('Error updating payment status');
    }
});


module.exports = router;