const express = require('express');
const sql = require('mssql');
const config = require('./config');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const patientsRoute = require('./routes/patients');
const specializationRoute = require('./routes/specialization');
const doctorRoutes = require('./routes/doctors');
const authenticateToken = require('./middleware/authMiddleware'); // Import the middleware

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Connect to Azure SQL Database
sql.connect(config.sql).then(() => {
  console.log('Connected to Azure SQL Database');
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Public routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);

// Protected routes
app.use('/api/patients', authenticateToken, patientsRoute);
app.use('/api/specialization', authenticateToken, specializationRoute);
app.use('/api/doctors', authenticateToken, doctorRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});