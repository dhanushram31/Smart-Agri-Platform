const jwt = require('jsonwebtoken');

// JWT auth middleware
module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid Authorization format. Use: Bearer <token>' });
        }

        const token = parts[1];
        const jwtSecret = process.env.JWT_SECRET || 'change_this_secret_in_env';

        const payload = jwt.verify(token, jwtSecret);
        // Attach user payload to request for downstream handlers
        req.user = payload;
        return next();
    } catch (err) {
        console.error('Auth middleware error:', err.message || err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
