const express = require('express');
const sql = require('mssql');
const config = require('../config');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log('Specialization route GET request received'); 
    try {
      const result = await sql.query('SELECT SpecializationID, Specialization FROM Specialization_Dim');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send('Error fetching data from database');
    }
  });

module.exports = router;