const express = require('express');
const sql = require('mssql');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to Azure SQL Database
sql.connect(config.sql).then(() => {
  console.log('Connected to Azure SQL Database');
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Define a route to fetch users
app.get('/api/specialization', async (req, res) => {
  try {
    const result = await sql.query('SELECT SpecializationID, Specialization FROM Specialization_Dim');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Error fetching data from database');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});