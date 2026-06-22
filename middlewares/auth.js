const jwt = require('jsonwebtoken');
const { UnauthorizedError , TokenExpiredError, InvalidTokenError } = require('../errors/app.errors');

function auth (req, res, next) {
    try {
        if (!req.cookies.auth) {
            throw new UnauthorizedError('Please login to proceed');
        }
        const token = req.cookies.auth;
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new TokenExpiredError('Please login again 1');
        }
        next(err);
    }
}

module.exports = auth;