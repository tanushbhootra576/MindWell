
const jwt = require('jsonwebtoken');

// Initialize Firebase Admin if not already (you might need a service account for real verification)
// For this dev environment, we will trust the client sending the UID/Email in the body for login,
// or use a simple token check if we had the admin SDK set up.
// To keep it simple and fix the "email" issue without complex Firebase Admin setup:
// We will expect the client to send 'Authorization: Bearer <token>'
// And we will also look for user details in the request body for the /login route.


const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('verifyToken - authHeader present?', !!authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('verifyToken - missing or malformed Authorization header');
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Decode JWT without verifying signature (for dev only)
        const decoded = jwt.decode(token);
        console.log('verifyToken - decoded token (partial):', { sub: decoded?.sub || decoded?.user_id, email: decoded?.email });
        if (!decoded || (!decoded.sub && !decoded.user_id)) {
            console.log('verifyToken - decoded token missing sub/user_id');
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = {
            uid: decoded.sub || decoded.user_id,
            email: decoded.email || 'test@example.com',
            name: decoded.name || '',
            picture: decoded.picture || ''
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token error' });
    }
};

module.exports = verifyToken;
