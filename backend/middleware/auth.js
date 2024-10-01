const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Adjust the path as necessary

const isAuthenticated = async (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming the token is sent as "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user in the database
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Invalid token, user not found.' });
        }

        next(); // User is authenticated, proceed to the next middleware/route handler
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is not valid.' });
    }
};

module.exports = isAuthenticated;
