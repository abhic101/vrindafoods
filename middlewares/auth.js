const jwt = require('jsonwebtoken');
const { UnauthorizedError , TokenExpiredError, ForbiddenError } = require('../errors/app.errors');
const hasPermission = require('../config/accessRules');

/**
 * 
 * @param {string} requiredPermission - The permission string to check against 
 * @returns {Function} Actual Express middleware function
 * @throws {UnauthorizedError} If no token found
 * @throws {ForbiddenError} If user does not have permission to access route
 * @throws {TokenExpiredError} If token has expired
 */
const auth = (requiredPermission) => ((req, res, next) => {
    try {
        if (!req.cookies.auth) {
            throw new UnauthorizedError('Please login to proceed');
        }
        const token = req.cookies.auth;
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;

        // Check permission
        if (!hasPermission(req.user.role, requiredPermission)) {
            throw new ForbiddenError('You do not have access to do this operation');
        }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new TokenExpiredError('Please login again 1');
        }
        next(err);
    }
})

module.exports = auth;