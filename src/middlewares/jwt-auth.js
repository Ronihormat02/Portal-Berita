//jwt-auth.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/jwtConfig'); // Pastikan path ini benar
// jwt-auth.js

module.exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log('Token yang diterima:', token);

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    if (!token.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Invalid token format' });
    }

    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, jwtSecret, (err, decoded) => {
        if (err) {
            console.error('Error verifikasi token:', err);
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.log('Decoded JWT:', decoded);

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
};