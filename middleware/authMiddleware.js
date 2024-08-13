const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
const authenticateToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Assumes 'Bearer [token]'

    if (token == null) return res.status(401).json({ message: 'Token required' });

    jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        req.user = user; // Add the user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;